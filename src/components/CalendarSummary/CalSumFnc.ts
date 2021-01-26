/**
|--------------------------------------------------
| TABLE SUMMARY
|--------------------------------------------------
*/
interface singleSummary {
  pos: number;
  ot: number;
  otM: number;
  otE: number;
  otN: number;
  m: number;
  e: number;
  n: number;
  OFF: number;
  vac: number;
  [value: number]: number;
}

interface NightMorning {
  pos: number;
  error: number;
}

export enum valueTypes {
  otAll = 'ot',
  otM = 'otM',
  otE = 'otE',
  otN = 'otN',
  m = 'm',
  e = 'e',
  n = 'n',
  OFF = 'OFF',
  vac = 'vac',
  otRatio = 'otRatio',
  NpM = 'NpM',
  AllM = 'AllM',
  AllE = 'AllN',
  AllN = 'ALLN',
  Total = 'Total',
}

export const summaryValue = (
  data: singleSummary[],
  key: number,
  type: valueTypes
): number | string => {
  let value: number | string = 0;
  if (data.length === 0) {
    value = 0;
  } else if (data.length > 0) {
    switch (type) {
      case valueTypes.otAll:
        return data[key - 1].otM + data[key - 1].otE + data[key - 1].otN;
      case valueTypes.otM:
        return (value = data[key - 1].otM);
      case valueTypes.otE:
        return (value = data[key - 1].otE);
      case valueTypes.otN:
        return (value = data[key - 1].otN);
      case valueTypes.m:
        return (value = data[key - 1].m);
      case valueTypes.e:
        return (value = data[key - 1].e);
      case valueTypes.n:
        return (value = data[key - 1].n);
      case valueTypes.OFF:
        return (value = data[key - 1].OFF);
      case valueTypes.vac:
        return (value = data[key - 1].vac);
      case valueTypes.AllM:
        return (value = data[key - 1].m + data[key - 1].otM);
      case valueTypes.AllE:
        return (value = data[key - 1].e + data[key - 1].otE);
      case valueTypes.AllN:
        return (value = data[key - 1].n + data[key - 1].otN);
      case valueTypes.Total:
        return (value = data[key - 1].m + data[key - 1].e + data[key - 1].n);
      default:
        return (value = '9:4');
    }
  }
  return value;
};

/**
|--------------------------------------------------
| NIGHT MORNING ERROR
|--------------------------------------------------
*/
interface NightMorning {
  pos: number;
  error: number;
}

export const checkNightMorning = (
  data: NightMorning[],
  key: number
): number => {
  if (data.length !== 0) {
    return data[key - 1].error;
  } else {
    return 0;
  }
};
