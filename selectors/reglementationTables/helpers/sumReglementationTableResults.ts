export type ResultTotalBEGES = {
  result: number;
  uncertainty: number;
  co2: number;
  ch4: number;
  n2O: number;
  otherGaz: number;
  co2b: number;
};

export type ResultTotalGHG = {
  result: number;
  uncertainty: number;
  co2: number;
  ch4: number;
  n2O: number;
  otherGaz: number;
  co2b: number;
};

export type ResultTotalISO = {
  result: number;
  uncertainty: number;
  co2: number;
  ch4: number;
  n2O: number;
  fluoredGaz: number;
  otherGaz: number;
  co2bCombustion: number;
  co2bOther: number;
};

export type Result = {
  result: number;
  uncertainties: number[];
  co2: number;
  ch4: number;
  n2O: number;
  fluoredGaz: number;
  otherGaz: number;
  co2bCombustion: number;
  co2bOther: number;
  co2b: number;
  hfc: number;
  pfc: number;
  sf6: number;
};

function initResult(): Result {
  return {
    result: 0,
    uncertainties: [],
    co2b: 0,
    co2bCombustion: 0,
    fluoredGaz: 0,
    co2bOther: 0,
    ch4: 0,
    co2: 0,
    n2O: 0,
    otherGaz: 0,
    hfc: 0,
    pfc: 0,
    sf6: 0,
  };
}

function getResult(
  result: ResultTotalBEGES | ResultTotalGHG | ResultTotalISO
): Result {
  return {
    ...initResult(),
    ...result,
    uncertainties: [result.uncertainty]
  };
}

function sumResult(a: Result, b: Result): Result {
  return {
    result: a.result + b.result,
    uncertainties: [...a.uncertainties, ...b.uncertainties],
    co2: a.co2 + b.co2,
    ch4: a.ch4 + b.ch4,
    n2O: a.n2O + b.n2O,
    fluoredGaz: a.fluoredGaz ?? 0 + b.fluoredGaz,
    otherGaz: a.otherGaz + b.otherGaz,
    co2bCombustion: a.co2bCombustion + b.co2bCombustion,
    co2bOther: a.co2bOther + b.co2bOther,
    co2b: a.co2b + b.co2b,
    hfc: a.hfc + b.hfc,
    pfc: a.pfc + b.pfc,
    sf6: a.sf6 + b.sf6,
  };
}

export { getResult, sumResult, initResult };
