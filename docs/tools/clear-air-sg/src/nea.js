export const ENDPOINT='https://api-open.data.gov.sg/v2/real-time/api/pm25';
export const REGIONS=['central','north','south','east','west'];
export function parseNEA(raw,now=Date.now()) {
 if(raw.code!==undefined && raw.code!==0) throw new Error('NEA returned an error');
 const items=raw.data?.items ?? raw.items;
 if(!Array.isArray(items)||!items.length) throw new Error('No NEA observations');
 const item=[...items].filter(x=>Number.isFinite(Date.parse(x.timestamp))).sort((a,b)=>Date.parse(b.timestamp)-Date.parse(a.timestamp))[0];
 if(!item) throw new Error('Missing observation timestamp');
 const readings=item.readings?.pm25_one_hourly;
 const values={};
 for(const r of REGIONS) values[r]=typeof readings?.[r]==='number' && Number.isFinite(readings[r]) && readings[r]>=0 ? readings[r]:null;
 if(Object.values(values).every(x=>x===null)) throw new Error('No valid regional readings');
 const age=now-Date.parse(item.timestamp);
 if(age< -15*60*1000) throw new Error('Observation timestamp is in the future');
 return {values,timestamp:item.timestamp,updated:item.updatedTimestamp??item.update_timestamp??item.timestamp,stale:age>2*60*60*1000,fetchedAt:new Date(now).toISOString()};
}
export async function fetchNEA({proxy='/api/pm25'}={}) {
 let lastError;
 for(const endpoint of [proxy,ENDPOINT].filter(Boolean)) {
  try {
   const response=await fetch(endpoint,{signal:AbortSignal.timeout(12000),cache:'no-store'});
   if(!response.ok) throw new Error(`HTTP ${response.status}`);
   const data=parseNEA(await response.json());
   try{localStorage.setItem('clearair-nea-v1',JSON.stringify(data));}catch{}
   return {...data,cached:false};
  } catch(error) {lastError=error;}
 }
 try {
  const old=JSON.parse(localStorage.getItem('clearair-nea-v1'));
  if(old && Date.now()-Date.parse(old.timestamp)<24*60*60*1000) {
   const checked=parseNEA({items:[{timestamp:old.timestamp,readings:{pm25_one_hourly:old.values}}]});
   return {...checked,cached:true,stale:true};
  }
 }catch{}
 throw lastError;
}
