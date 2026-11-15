// ASHRAE 52.2 size-band minimum capture efficiencies, as reproduced by EPA:
// https://www.epa.gov/indoor-air-quality-iaq/what-merv-rating
// E1: 0.3–1 µm; E2: 1–3 µm; E3: 3–10 µm. Null means no minimum specified
// (MERV 1–4 specify E3 <20%, rather than a positive lower bound).
// The mass-balance model uses the E1 minimum as a fine-particle proxy, not as
// a certified mass-weighted PM2.5 efficiency. No E1 requirement earns no credit.
const bands = [
 [null, null, null], [null, null, null], [null, null, null], [null, null, null],
 [null, null, .20], [null, null, .35], [null, null, .50], [null, .20, .70],
 [null, .35, .75], [null, .50, .80], [.20, .65, .85], [.35, .80, .90],
 [.50, .85, .90], [.75, .90, .95], [.85, .90, .95], [.95, .95, .95],
];

export const MERV_LOOKUP = Object.freeze(bands.map(([e1, e2, e3], index) =>
 Object.freeze({grade: index + 1, e1, e2, e3, efficiency: e1 ?? 0})
));

export const FILTER_OPTIONS = Object.freeze([
 Object.freeze({id: 'none', grade: null, efficiency: 0}),
 ...MERV_LOOKUP.map(({grade, efficiency}) => Object.freeze({id: `merv${grade}`, grade, efficiency})),
 Object.freeze({id: 'custom', grade: null, efficiency: null}),
]);

export const DEFAULT_OFFICE_FILTER = 'merv14';

/** Resolve the declared grade, or validate a measured/custom fractional efficiency. */
export function filterEfficiency(selection, customEfficiency) {
 const option = FILTER_OPTIONS.find(filter => filter.id === selection);
 if(!option) throw new RangeError('Invalid filter selection');
 if(selection !== 'custom') return option.efficiency;
 if(typeof customEfficiency !== 'number' || !Number.isFinite(customEfficiency) || customEfficiency < 0 || customEfficiency > 1) {
  throw new RangeError('Invalid custom filter efficiency');
 }
 return customEfficiency;
}

/** Change one independent stream without mutating the current plan. */
export function withFilterSelection(inputs, stream, selection) {
 if(!['supply', 'recirculation'].includes(stream)) throw new RangeError('Invalid filter stream');
 return {
  ...inputs,
  [`${stream}Filter`]: selection,
  [`${stream}Efficiency`]: filterEfficiency(selection, inputs[`${stream}Efficiency`]),
 };
}

/** Legacy numerical efficiencies remain custom; explicit grades are authoritative. */
export function normaliseFilters(inputs) {
 const result = {...inputs};
 for(const stream of ['supply', 'recirculation']) {
  const selection = inputs[`${stream}Filter`] === undefined ? 'custom' : inputs[`${stream}Filter`];
  result[`${stream}Filter`] = selection;
  result[`${stream}Efficiency`] = filterEfficiency(selection, inputs[`${stream}Efficiency`]);
 }
 return result;
}
