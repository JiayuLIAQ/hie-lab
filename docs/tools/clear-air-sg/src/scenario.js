import {PRESETS, LIMITS, validate} from './model.js?v=20261023-office-filters-r2';
import {REGIONS} from './nea.js?v=20261023-office-filters-r2';
import {normaliseFilters} from './filters.js?v=20261023-office-filters-r2';

const MAX_CADR = 10000000;
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const validCadr = value => value === null || (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= MAX_CADR);
const validOutdoor = value => value === null || (typeof value === 'number' && Number.isFinite(value) && value >= LIMITS.outdoor[0] && value <= LIMITS.outdoor[1]);

function checkInputs(preset, inputs) {
 if(!Object.hasOwn(PRESETS, preset)) throw new RangeError('Invalid preset');
 if(!isRecord(inputs)) throw new TypeError('Invalid planning inputs');
 const errors = validate(inputs);
 if(errors.length) throw new RangeError(`Invalid planning inputs: ${errors.join(', ')}`);
}

function checkMetadata(estimate) {
 if(!isRecord(estimate) || !['plan', 'live', 'snapshot'].includes(estimate.source)) throw new RangeError('Invalid estimate source');
 if(!validOutdoor(estimate.outdoor)) throw new RangeError('Invalid estimate outdoor concentration');
 if(estimate.timestamp !== null && (typeof estimate.timestamp !== 'string' || !Number.isFinite(Date.parse(estimate.timestamp)))) throw new TypeError('Invalid estimate timestamp');
 if(typeof estimate.cached !== 'boolean' || typeof estimate.stale !== 'boolean') throw new TypeError('Invalid estimate status');
}

/** Build a browser-independent v2 payload with separate purchase and estimate bases. */
export function scenarioState({preset, inputs, ownCadr = null, region = 'central', airing = false, estimate = {source: 'plan'}}) {
 checkInputs(preset, inputs);
 const canonicalInputs = normaliseFilters(inputs);
 if(!validCadr(ownCadr)) throw new RangeError('Invalid CADR');
 if(!REGIONS.includes(region)) throw new RangeError('Invalid region');
 if(typeof airing !== 'boolean') throw new TypeError('Invalid airing mode');
 const metadata = {
  source: estimate.source,
  outdoor: estimate.source === 'plan' ? inputs.outdoor : (estimate.outdoor ?? null),
  timestamp: estimate.timestamp ?? null,
  cached: estimate.cached === undefined ? false : estimate.cached,
  stale: estimate.stale === undefined ? false : estimate.stale,
 };
 checkMetadata(metadata);
 return {v: 2, preset, p: canonicalInputs, ownCadr, region, airing, estimate: metadata};
}

/** Restore an available shared reading as a fixed snapshot, never as changing live data. */
export function restoreScenario(state) {
 if(!isRecord(state) || ![1, 2].includes(state.v)) throw new RangeError('Invalid scenario version');
 checkInputs(state.preset, state.p);
 const inputs = normaliseFilters(state.p);
 if(state.v === 1) {
  return {
   preset: state.preset, inputs,
   ownCadr: validCadr(state.ownCadr) ? state.ownCadr : null,
   region: REGIONS.includes(state.region) ? state.region : 'central',
   airing: state.airing === true, source: 'plan', sharedReading: null,
  };
 }
 if(!validCadr(state.ownCadr)) throw new RangeError('Invalid CADR');
 if(!REGIONS.includes(state.region)) throw new RangeError('Invalid region');
 if(typeof state.airing !== 'boolean') throw new TypeError('Invalid airing mode');
 checkMetadata(state.estimate);
 const estimate = state.estimate;
 const hasReading = estimate.source !== 'plan' && estimate.outdoor !== null;
 return {
  preset: state.preset, inputs, ownCadr: state.ownCadr,
  region: state.region, airing: state.airing,
  source: estimate.source === 'plan' ? 'plan' : hasReading ? 'snapshot' : 'live',
  sharedReading: hasReading ? {
   values: {[state.region]: estimate.outdoor},
   timestamp: estimate.timestamp, cached: estimate.cached, stale: estimate.stale,
  } : null,
 };
}
