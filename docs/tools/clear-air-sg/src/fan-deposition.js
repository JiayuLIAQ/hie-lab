// Experimental deposition equivalent; this is not an input to purifier sizing.
// Source: author-supplied beta_dt.csv; beta is a negative loss slope in h^-1.
export const FAN_EXPERIMENT = {
  "lengthM": 8.64,
  "widthM": 5.57,
  "heightM": 2.6,
  "volumeM3": 125.12448000000002,
  "fanCount": 2,
  "speedRpm": 117,
  "sourceFile": "beta_dt.csv",
  "sourceSha256": "5edc606e4ccac23919616d5294e0a01c2f92d0bc1f79ccc8c029e2b11e086907",
  "doi": "10.1016/j.indenv.2024.100039",
  "reviewed": "2026-10-17"
};

const BETA_PAIRS = [
  {
    "bin": "0.3-0.4",
    "lowerUm": 0.3,
    "upperUm": 0.4,
    "betaOff": -0.276322023,
    "betaOn": -0.356429448,
    "r2Off": 0.99862559,
    "r2On": 0.99850286
  },
  {
    "bin": "0.4-0.5",
    "lowerUm": 0.4,
    "upperUm": 0.5,
    "betaOff": -0.283434545,
    "betaOn": -0.367834634,
    "r2Off": 0.998639607,
    "r2On": 0.99874848
  },
  {
    "bin": "0.5-0.6",
    "lowerUm": 0.5,
    "upperUm": 0.6,
    "betaOff": -0.305585141,
    "betaOn": -0.389817593,
    "r2Off": 0.998381202,
    "r2On": 0.999251861
  },
  {
    "bin": "0.6-0.7",
    "lowerUm": 0.6,
    "upperUm": 0.7,
    "betaOff": -0.309773328,
    "betaOn": -0.390859322,
    "r2Off": 0.998474706,
    "r2On": 0.999296976
  },
  {
    "bin": "0.7-0.8",
    "lowerUm": 0.7,
    "upperUm": 0.8,
    "betaOff": -0.323468539,
    "betaOn": -0.406100459,
    "r2Off": 0.998083128,
    "r2On": 0.999426905
  },
  {
    "bin": "0.8-1.0",
    "lowerUm": 0.8,
    "upperUm": 1,
    "betaOff": -0.352852736,
    "betaOn": -0.442352969,
    "r2Off": 0.998000426,
    "r2On": 0.999800085
  },
  {
    "bin": "1.0-1.3",
    "lowerUm": 1,
    "upperUm": 1.3,
    "betaOff": -0.384627616,
    "betaOn": -0.471360406,
    "r2Off": 0.997848404,
    "r2On": 0.999655186
  },
  {
    "bin": "1.3-1.6",
    "lowerUm": 1.3,
    "upperUm": 1.6,
    "betaOff": -0.403498664,
    "betaOn": -0.489283834,
    "r2Off": 0.997396473,
    "r2On": 0.999422509
  },
  {
    "bin": "1.6-2.0",
    "lowerUm": 1.6,
    "upperUm": 2,
    "betaOff": -0.43833683,
    "betaOn": -0.533115821,
    "r2Off": 0.998007453,
    "r2On": 0.999556112
  },
  {
    "bin": "2.0-2.5",
    "lowerUm": 2,
    "upperUm": 2.5,
    "betaOff": -0.540879497,
    "betaOn": -0.655888686,
    "r2Off": 0.997619219,
    "r2On": 0.99885446
  },
  {
    "bin": "2.5-3.2",
    "lowerUm": 2.5,
    "upperUm": 3.2,
    "betaOff": -0.673028363,
    "betaOn": -0.813785667,
    "r2Off": 0.993344234,
    "r2On": 0.996089118
  },
  {
    "bin": "3.2-4.0",
    "lowerUm": 3.2,
    "upperUm": 4,
    "betaOff": -0.842051649,
    "betaOn": -1.026170512,
    "r2Off": 0.980020006,
    "r2On": 0.976262261
  },
  {
    "bin": "4.0-5.0",
    "lowerUm": 4,
    "upperUm": 5,
    "betaOff": -1.027412251,
    "betaOn": -1.5,
    "r2Off": 0.934732245,
    "r2On": null
  },
  {
    "bin": "5.0-6.4",
    "lowerUm": 5,
    "upperUm": 6.4,
    "betaOff": -1.47,
    "betaOn": -2.6,
    "r2Off": null,
    "r2On": null
  },
  {
    "bin": "6.4-8.0",
    "lowerUm": 6.4,
    "upperUm": 8,
    "betaOff": -2.37,
    "betaOn": -5.2,
    "r2Off": null,
    "r2On": null
  },
  {
    "bin": "8.0-10.0",
    "lowerUm": 8,
    "upperUm": 10,
    "betaOff": -4.07,
    "betaOn": -9,
    "r2Off": null,
    "r2On": null
  },
  {
    "bin": "10.0-",
    "lowerUm": 10,
    "upperUm": null,
    "betaOff": -6.07,
    "betaOn": -13.7,
    "r2Off": null,
    "r2On": null
  }
];

export function fanDepositionResults() {
 return BETA_PAIRS.map(row => {
  const lossOff = -row.betaOff;
  const lossOn = -row.betaOn;
  const deltaLossPerHour = lossOn - lossOff;
  return {...row, lossOff, lossOn, deltaLossPerHour,
   equivalentCadrM3h: FAN_EXPERIMENT.volumeM3 * deltaLossPerHour};
 });
}
