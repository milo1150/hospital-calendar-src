import * as _ from 'lodash';

/**
 * VARIABLES
 */
const MorningCheckStack: Array<string> = ['ช', 'ช.', 'ช*', 'คม', 'ปช'];

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
  [index: number]: number;
}

/**
|--------------------------------------------------
| UTIL FUNCTION
|--------------------------------------------------
*/
const scheduleTHtoEN = (schedule: string): string => {
  let str: string = '';
  if (schedule === 'ช' || schedule === 'ช*' || schedule === 'ช.') {
    // if (MorningCheckStack.includes(schedule)) {
    str = 'm';
  } else if (schedule === 'บ' || schedule === 'บ*' || schedule === 'บ.') {
    str = 'e';
  } else if (schedule === 'ด' || schedule === 'ด*' || schedule === 'ด.') {
    str = 'n';
  }
  return str;
};

const scheduleENtoTH = (schedule: string): string => {
  let str: string = '';
  switch (schedule) {
    case 'm':
      str = 'ช';
      break;
    case 'e':
      str = 'บ';
      break;
    case 'n':
      str = 'ด';
      break;
  }
  return str;
};

/**
|--------------------------------------------------
|HOLIDAY CHECK SAT | SUN
|--------------------------------------------------
*/
export const holidayCheck = (day: string): string | undefined => {
  if (day === 'Sat' || day === 'Sun') {
    return day;
  } else {
    return;
  }
};

/**
|--------------------------------------------------
| RANDOM BUTTON
|--------------------------------------------------
*/
type ScheduleData = string[][];

interface ScheduleLimit {
  m: number;
  e: number;
  n: number;
}
export const RandomSchedule = (data: ScheduleData): ScheduleData => {
  /* LOOP EACH COLUMN */
  // for (const i of data) {
  // console.log(data);
  for (let i = 0; i <= data.length - 1; i++) {
    // for (let i = 0; i <= 1; i++) {
    const ScheduleLimit: ScheduleLimit = {
      m: 4,
      e: 3,
      n: 2,
    };
    const FreeIndex: number[] = [];
    /* CALCULATE FREEINDEX OR INDEX THAT WILL RE RANDOM AND UPDATE SCHEDULE LIMIT */
    for (let j = 0; j < data[i].length; j++) {
      let cellValue: string = data[i][j];
      /* VALIDATE CELL VALUE*/
      const regex = /[*0a-zA-Zลา.คมปช/]/g;
      if (regex.test(cellValue) || cellValue.includes('/')) {
        // console.log(true);
        let valueSplit: string[] = cellValue.split('/');
        for (let x of valueSplit) {
          if (x === 'ช' || x === 'ช*' || x === 'ช.') {
            ScheduleLimit.m--;
          }
          if (x === 'บ' || x === 'บ*' || x === 'บ.') {
            ScheduleLimit.e--;
          }
          if (x === 'ด' || x === 'ด*' || x === 'ด.') {
            ScheduleLimit.n--;
          }
        }
      } else {
        data[i][j] = ''; // clear old random value on cell
        FreeIndex.push(j);
      }
    }
    // console.log('FreeIndex :', FreeIndex);

    /* CREATE RANDOM CELL VALUE */
    let randomPool: string[] = [];
    for (const value of Object.entries(ScheduleLimit)) {
      // console.log(value);
      let scheduleValue: string = value[0];
      let scheduleCount: number = value[1];
      scheduleValue = scheduleENtoTH(scheduleValue);
      for (let i = 0; i < scheduleCount; i++) {
        randomPool.push(scheduleValue);
      }
    }
    // console.log('Random Pool', randomPool);

    /* RANDOM INDEX AND RANDOM CELL VALUE */
    const randomFreeIndex = (
      FreeIndex: number[],
      randomPool: string[]
    ): void => {
      // console.log('FreeIndex', FreeIndex);
      if (FreeIndex.length === 0) {
        return;
      } else if (randomPool.length === 0) {
        return;
      }
      let randomIndex: any = _.sample(FreeIndex);
      // console.log('RandomIndex :', randomIndex);
      /* RANDOM VALUE FROM POOL AND PUSH IN TO CELL */
      const randomCellValue = (): any => {
        let randomPoolIndex: number = _.random(0, randomPool.length - 1);
        let randomValue: string = randomPool[randomPoolIndex];
        data[i][randomIndex] = randomValue; // push value into cell
        /* CHECK LIMIT */
        randomValue = scheduleTHtoEN(randomValue);
        switch (randomValue) {
          case 'm':
            ScheduleLimit.m--;
            break;
          case 'e':
            ScheduleLimit.e--;
            break;
          case 'n':
            ScheduleLimit.n--;
            break;
        }
        // console.log('randomPoolIndex:', randomPoolIndex);
        // console.log('Randomvalue: ', randomValue);
        let newRandomPool = randomPool.filter(
          (value, index) => index !== randomPoolIndex
        );
        return newRandomPool;
      };
      let newRandomPool = randomCellValue();
      // console.log('newRandomPool', newRandomPool);

      /* Return new newFreeIndex Array */
      let newFreeIndex: number[] = FreeIndex.filter(
        (value) => value !== randomIndex
      );
      return randomFreeIndex(newFreeIndex, newRandomPool);
    };
    randomFreeIndex(FreeIndex, randomPool);
    // console.log(ScheduleLimit);
    // console.log(data[i]);
  }
  // console.log(data);
  return data;
};

/**
|--------------------------------------------------
| (ERROR BOX) SHOW ERROR OF EACH DAY
| ONCHANGE TABLE VALUE BY TYPING (COLUMN CALCULATE NOT ROW CALCULATE)
|--------------------------------------------------
*/
interface schLimitObj {
  m: number;
  e: number;
  n: number;
  // [index: string]: number; // 1 line 2hr =.=
}

type schLimit = {}[];

export const TableSummary = (data: ScheduleData): schLimit => {
  // console.log(data);
  const schColumnLimit: schLimit = [];
  for (const i of data) {
    // console.log(i);
    const ScheduleLimit: schLimitObj = {
      m: 4,
      e: 3,
      n: 2,
    };
    const regex = /[A-Za-zลา]/g;
    // const regex2 = /[*0a-zA-Zลา/]/g;
    // const regex2 = new RegExp('/*0');
    for (const j of i) {
      let cellValue: string = j;
      if (typeof cellValue != undefined) {
        if (
          regex.test(cellValue) ||
          cellValue.includes('/') ||
          cellValue === '0'
        ) {
          // console.log('value get test:', cellValue);
          if (cellValue.includes('/')) {
            // console.log('VALUE INCLUDE / :', cellValue);
            const splitCell: string[] = cellValue.split('/');
            for (const k of splitCell) {
              if (!regex.test(k)) {
                // any value != regexpool that's mean value = ช|บ|ด
                // main schedule (m:4,e:3,n2) . srsly case
                if (k === 'ช' || k === 'ช*' || k === 'ช.') {
                  ScheduleLimit.m--;
                }
                if (k === 'บ' || k === 'บ*' || k === 'บ.') {
                  ScheduleLimit.e--;
                }
                if (k === 'ด' || k === 'ด*' || k === 'ด.') {
                  ScheduleLimit.n--;
                }
              }
            }
          } else {
            // this line mean value equal English Alphabet or 0 or ลา
            // console.log('REGEX POOL GOTCHA :', cellValue);
          }
        } else {
          // CELL THAT DO RANDOM VALUE
          cellValue = scheduleTHtoEN(cellValue);
          switch (cellValue) {
            case 'm':
              ScheduleLimit.m--;
              break;
            case 'e':
              ScheduleLimit.e--;
              break;
            case 'n':
              ScheduleLimit.n--;
              break;
          }
        }
      }
    }
    schColumnLimit.push(ScheduleLimit);
  }
  return schColumnLimit;
};

/**
|--------------------------------------------------
| TOTAL SCHEDULE CALCULATE
|--------------------------------------------------
*/
const checkCellValue = (
  value: string,
  summary: singleSummary[],
  row: number
): void => {
  const cellValue = value.split('/');
  const regex = {
    isVAC0: /VAC|0|ลา/g,
    notVAC0: /[a-zA-Z]/g,
  };
  for (const i of cellValue) {
    let value: string = i;
    // console.log(value);
    if (value === '') {
      return;
    }
    /* if value is VAC or 0 */
    if (regex.isVAC0.test(value)) {
      switch (value) {
        case 'VAC':
          summary[row].vac++;
          break;
        case '0':
          summary[row].OFF++;
          break;
        case 'ลา':
      }
    } else {
      /* if value is ENG char */
      if (regex.notVAC0.test(value)) {
        summary[row].m++;
      } else if (MorningCheckStack.includes(value)) {
        // Morning Schedule check in stack
        summary[row].m++;
      }
    }
    /* if value is normal schedule */
    switch (value) {
      /* Second Algorithm: Delete all OT row from summaryTable */
      case 'บ':
        summary[row].e++;
        break;
      case 'บ.':
        summary[row].e++;
        break;
      case 'บ*':
        summary[row].e++;
        break;
      case 'ด':
        summary[row].n++;
        break;
      case 'ด.':
        summary[row].n++;
        break;
      case 'ด*':
        summary[row].n++;
        break;

      /* First */
      // case 'ANC*':
      //   summary[row].m--;
      //   summary[row].otM++;
      //   break;
      // case 'ช':
      //   summary[row].m++;
      //   break;
      // case 'ช.':
      //   summary[row].m++;
      //   break;
      // case 'ช*':
      //   summary[row].otM++;
      //   break;
      // case 'บ':
      //   summary[row].e++;
      //   break;
      // case 'บ.':
      //   summary[row].e++;
      //   break;
      // case 'บ*':
      //   summary[row].otE++;
      //   break;
      // case 'ด':
      //   summary[row].n++;
      //   break;
      // case 'ด.':
      //   summary[row].n++;
      //   break;
      // case 'ด*':
      //   summary[row].otN++;
      //   break;
    }
    // console.log(regex2.test(value));
  }
};

export const totalSchedule = (data: string[][]): singleSummary[] => {
  /* Create array that contain all singleSummary */
  const totalSummary: singleSummary[] = [];
  for (let i = 0; i < data[0].length; i++) {
    const singleSummary: singleSummary = {
      pos: 0,
      ot: 0,
      otM: 0,
      otE: 0,
      otN: 0,
      m: 0,
      e: 0,
      n: 0,
      OFF: 0,
      vac: 0,
    };
    singleSummary['pos'] = i;
    totalSummary.push(singleSummary);
  }
  /* LOOP VALUE IN EACH COLUMN */
  for (let i = 0; i < data.length; i++) {
    // for (let i = 0; i < 1; i++) {
    const columnData: string[] = data[i];
    for (let j = 0; j < columnData.length; j++) {
      const cellValue: string = columnData[j];
      checkCellValue(cellValue, totalSummary, j);
    }
    // console.log(data[i]);
  }

  // console.log('totalSummary', totalSummary);

  return totalSummary;
};

/**
|--------------------------------------------------
| CHECK MORNING AFTER NIGHT
|--------------------------------------------------
*/
interface NightMorning {
  pos: number;
  error: number;
}

type nmError = NightMorning[];

export const NightMorningError = (data: string[][]): nmError => {
  const peopleCount: number = data[0].length;
  const columnCount: number = data.length;
  const returnData: nmError = []; // Return Data
  for (let i: number = 0; i < peopleCount; i++) {
    returnData.push({ pos: i, error: 0 });
    // console.log(data);
    for (let j: number = 0; j < columnCount; j++) {
      // console.log(j);
      if (j === columnCount - 1) {
        break;
      }
      /* current cell value */
      let currentCellVal: any = data[j][i];
      currentCellVal = currentCellVal.split('/');
      currentCellVal = currentCellVal[currentCellVal.length - 1];
      /* next cell value */
      let nextCellVal: any = data[j + 1][i];
      nextCellVal = nextCellVal.split('/');
      nextCellVal = nextCellVal[0];
      /* LOGIC */
      const regex = {
        isVAC0: /VAC|0|ลา/g,
        notVAC0: /[a-zA-Z]/g,
      };
      if (
        (currentCellVal === 'ด' && nextCellVal === 'ช') ||
        (currentCellVal === 'ด*' && nextCellVal === 'ช') ||
        (currentCellVal === 'ด.' && nextCellVal === 'ช')
      ) {
        // console.log(currentCellVal);
        returnData[i].error++;
      } else if (
        currentCellVal === 'ด' &&
        regex.notVAC0.test(nextCellVal) &&
        !regex.isVAC0.test(nextCellVal)
      ) {
        // console.log('MORNING');
        returnData[i].error++;
      }
      // console.log(currentCellVal, nextCellVal);
    }
  }
  // console.log(returnData);
  return returnData;
};

/**
|--------------------------------------------------
| CLEAR TABLE
|--------------------------------------------------
*/
export const clearTableData = (data: string[][], ppLength: number) => {
  const column: number = data.length;
  const newData: string[][] = data;

  for (let i: number = 0; i < column; i++) {
    for (let j: number = 0; j < ppLength; j++) {
      let value: string = data[i][j];
      value = '';
      newData[i][j] = value;
    }
  }
  // console.log(newData);

  return newData;
  // return data;
};
