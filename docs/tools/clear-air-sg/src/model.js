import {DEFAULT_OFFICE_FILTER, filterEfficiency, normaliseFilters} from './filters.js?v=20261023-office-filters-r2';

// Units: hours, m³, m³/h, µg/m³, µg/h. CO₂ is in ppm.
export const VERSION = '2.1.0';
export const PRESETS = {
  bedroom: {area: 15, height: 2.6, people: 2, leak: .5, openAch: 3, supply: 0, supplyFilter: 'custom', supplyEfficiency: 0, recirculation: 0, recirculationFilter: 'custom', recirculationEfficiency: 0, generation: .004},
  home: {area: 90, height: 2.6, people: 2, leak: .5, openAch: 3, supply: 0, supplyFilter: 'custom', supplyEfficiency: 0, recirculation: 0, recirculationFilter: 'custom', recirculationEfficiency: 0, generation: .004},
  classroom: {area: 65, height: 3, people: 30, leak: .5, openAch: 6, supply: 0, supplyFilter: 'custom', supplyEfficiency: 0, recirculation: 0, recirculationFilter: 'custom', recirculationEfficiency: 0, generation: .0035},
  office: {area: 100, height: 2.8, people: 10, leak: .3, openAch: 3, supply: 360, supplyFilter: DEFAULT_OFFICE_FILTER, supplyEfficiency: .75, recirculation: 1000, recirculationFilter: DEFAULT_OFFICE_FILTER, recirculationEfficiency: .75, generation: .005},
};
// Penetration .9 and deposition .15 reproduce the infiltration factors measured in
// Singapore homes (Gall et al. 2015: .60 air-conditioned, .74 fan-assisted natural
// ventilation). Haze PM2.5 sits in the 0.3-1 um range, where penetration is highest
// and deposition slowest. See research/RESEARCH.md.
export const BASE = {outdoor: 150, target: 15, penetration: .9, deposition: .15, emission: 0, outdoorCO2: 450, initialCO2: 600, co2Trigger: 1000, co2Reset: 800, airingLimit: 35, windows: 'closed'};
export const LIMITS = {
 area:[1,5000], height:[1.8,10], people:[0,1000], leak:[0,10], openAch:[0,50], supply:[0,100000], supplyEfficiency:[0,1], recirculation:[0,100000], recirculationEfficiency:[0,1], generation:[.001,.02], outdoor:[0,2000], target:[1,200], penetration:[0,1], deposition:[0,3], emission:[0,1000000], outdoorCO2:[300,1000], initialCO2:[300,10000], co2Trigger:[600,2500], co2Reset:[400,2000], airingLimit:[1,100],
};
export function validate(p) {
 const errors = [];
 const resolved = {...p};
 for(const stream of ['supply', 'recirculation']) {
  const selection = p[`${stream}Filter`] === undefined ? 'custom' : p[`${stream}Filter`];
  try { resolved[`${stream}Efficiency`] = filterEfficiency(selection, p[`${stream}Efficiency`]); }
  catch { errors.push(selection === 'custom' ? `${stream}Efficiency` : `${stream}Filter`); }
 }
 for (const [k,[min,max]] of Object.entries(LIMITS)) if (!Number.isFinite(resolved[k]) || resolved[k]<min || resolved[k]>max) errors.push(k);
 if (!Number.isInteger(p.people)) errors.push('people');
 if (p.openAch < p.leak) errors.push('openAch');
 if (p.co2Reset <= p.outdoorCO2 || p.co2Reset >= p.co2Trigger) errors.push('co2Reset');
 if (!['closed','open'].includes(p.windows)) errors.push('windows');
 return [...new Set(errors)];
}
export function flows(p, windows=p.windows) {
 const filtered = normaliseFilters(p);
 const volume=p.area*p.height;
 const leak=p.leak*volume;
 const natural=windows==='open' ? Math.max(0,p.openAch-p.leak)*volume : 0;
 const outdoorFlow=leak+natural+p.supply;
 const source=(leak*p.penetration+natural+p.supply*(1-filtered.supplyEfficiency))*p.outdoor+p.emission;
 const sink=outdoorFlow+p.deposition*volume+p.recirculation*filtered.recirculationEfficiency;
 return {volume, leak, natural, outdoorFlow, source, sink};
}
export function steady(p,cadr=0,windows=p.windows) {
 const f=flows(p,windows), sink=f.sink+cadr;
 return sink>0 ? f.source/sink : f.source>0 ? Infinity : 0;
}
export function advance(initial,source,loss,hours) {
 if (loss<=0) return initial+source*hours;
 const decay=Math.exp(-loss*hours);
 return initial*decay+source/loss*(-Math.expm1(-loss*hours));
}
export function crossing(initial,target,source,loss) {
 if (initial===target) return 0;
 if (loss===0) return source!==0 && (target-initial)/source>=0 ? (target-initial)/source : Infinity;
 const equilibrium=source/loss;
 // An equilibrium is approached asymptotically. Round-off at the direct
 // model CADR must not turn that limit into a finite target-arrival time.
 const equilibriumTolerance=16*Number.EPSILON*Math.max(1,Math.abs(target),Math.abs(equilibrium));
 if(Math.abs(target-equilibrium)<=equilibriumTolerance) return Infinity;
 const ratio=(target-equilibrium)/(initial-equilibrium);
 return ratio>0 && ratio<=1 ? -Math.log(ratio)/loss : Infinity;
}
export function size(p) {
 const errors=validate(p); if(errors.length) throw new RangeError(errors.join(', '));
 const f=flows(p);
 const minimumEffective=Math.max(0,f.source/p.target-f.sink);
 // CADR is the clean airflow used directly in the room mass balance.
 // No nameplate derating, extra margin, reference floor or product rounding.
 const minimum=minimumEffective, recommended=minimumEffective;
 const without=steady(p,0), withPurifier=steady(p,recommended);
 const settlingMinutes=60*Math.log(10)/((f.sink+recommended)/f.volume);
 const initial=Number.isFinite(without)?without:p.outdoor;
 // The recommended CADR puts the equilibrium exactly at the target, so the target is
 // approached asymptotically and this is Infinity by design. Callers wanting a finite
 // arrival time must ask for a band around the target, as the UI does.
 const targetMinutes=initial<=p.target?0:60*crossing(initial,p.target,f.source/f.volume,(f.sink+recommended)/f.volume);
 return {minimum,minimumEffective,recommended,without,withPurifier,settlingMinutes,targetMinutes,...f};
}
export function co2Terms(p,windows='closed') {
 const f=flows(p,windows), loss=f.outdoorFlow/f.volume;
 const generation=p.people*p.generation*3.6; // L/s/person -> m³/h total
 return {loss,source:loss*p.outdoorCO2+generation*1e6/f.volume};
}
export function ventilation(p) {
 const closed=co2Terms(p,'closed'), open=co2Terms(p,'open');
 const initialMinutes=p.initialCO2>=p.co2Trigger?0:60*crossing(p.initialCO2,p.co2Trigger,closed.source,closed.loss);
 const repeatMinutes=60*crossing(p.co2Reset,p.co2Trigger,closed.source,closed.loss);
 const purgeMinutes=60*crossing(p.co2Trigger,p.co2Reset,open.source,open.loss);
 const closedEquilibrium=closed.loss>0?closed.source/closed.loss: p.people>0?Infinity:p.initialCO2;
 const openEquilibrium=open.loss>0?open.source/open.loss:p.people>0?Infinity:p.initialCO2;
 return {initialMinutes,repeatMinutes,purgeMinutes,closedEquilibrium,openEquilibrium,canPurge:Number.isFinite(purgeMinutes),outdoorSuitable:p.outdoor<=p.airingLimit,requiredOutdoor:p.people*p.generation*3.6*1e6/(p.co2Trigger-p.outdoorCO2)};
}
export function simulate(p,cadr,{airing=false,hours=8,stepMinutes=1}={}) {
 const result=[]; let pm=steady(p,0), baseline=pm, co2=p.initialCO2, co2Baseline=co2, opened=false;
 if(!Number.isFinite(pm)) pm=baseline=p.outdoor;
 const plan=ventilation(p);
 const baseFlow=flows(p), baseCO2=co2Terms(p,p.windows);
 for(let i=0;i<=Math.round(hours*60/stepMinutes);i++) {
  const t=i*stepMinutes;
  if(airing && p.windows==='closed' && plan.canPurge) {
   if(co2>=p.co2Trigger) opened=true;
   if(co2<=p.co2Reset) opened=false;
  }
  result.push({minute:t,pm,baseline,co2,co2Baseline,opened});
  const f=flows(p,opened?'open':p.windows), ct=co2Terms(p,opened?'open':p.windows), dt=stepMinutes/60;
  pm=advance(pm,f.source/f.volume,(f.sink+cadr)/f.volume,dt);
  baseline=advance(baseline,baseFlow.source/baseFlow.volume,baseFlow.sink/baseFlow.volume,dt);
  co2=advance(co2,ct.source,ct.loss,dt);
  co2Baseline=advance(co2Baseline,baseCO2.source,baseCO2.loss,dt);
 }
 return result;
}
export function sensitivity(p) {
 // Deliberately a scenario envelope, not a statistical confidence interval.
 return [.5,1,2].map(multiplier=>{
  const leak=Math.min(10,p.leak*multiplier), openAch=Math.max(leak,Math.min(50,p.openAch*multiplier));
  return {multiplier,...size({...p,leak,openAch})};
 });
}
