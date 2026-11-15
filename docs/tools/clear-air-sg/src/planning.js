// Buying a purifier uses a stable haze scenario, independently of today's NEA reading.
export const DEFAULT_PLANNING_OUTDOOR = 150;

/**
 * Select the outdoor concentration for a room estimate without mutating its plan.
 * A missing regional NEA reading stays unavailable; it never becomes a plan value.
 * Model validation remains the caller's responsibility for both sources.
 */
export function resolveEstimate(planningInputs, {source = 'live', region = 'central', nea = null} = {}) {
 if(source !== 'live' && source !== 'plan') throw new RangeError(`Unknown estimate source: ${source}`);

 if(source === 'plan') {
  return {
   inputs: {...planningInputs}, source, region, available: true,
   stale: false, cached: false, timestamp: null, updated: null, fetchedAt: null,
  };
 }

 const outdoor = nea?.values?.[region];
 const available = typeof outdoor === 'number' && Number.isFinite(outdoor) && outdoor >= 0;
 return {
  inputs: available ? {...planningInputs, outdoor} : null,
  source, region, available,
  stale: Boolean(nea?.stale), cached: Boolean(nea?.cached),
  timestamp: nea?.timestamp ?? null,
  updated: nea?.updated ?? null,
  fetchedAt: nea?.fetchedAt ?? null,
 };
}
