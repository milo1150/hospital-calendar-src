import { getTeamListAPI } from '../components/Calendar/CalendarType';
import * as CalendarType from '../components/Calendar/CalendarType';

export interface singleSummary {
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

// INIT REDUX DATA
export interface TableData {
  tableHeader: object;
  teamList: getTeamListAPI[];
  MonthYear: [string, number, number];
  worksheetName: string;
  tableData: string[][];
}

// Action Type
interface SaveWorkSheet {
  MonthYearSetup: [string, number, number];
  tableData: CalendarType.tableData;
  userData: CalendarType.userData;
  worksheetName: string;
}

export type ACTIONTYPE =
  | { type: 'UPDATE_TABLE_HEADER'; payload: Object[] }
  | { type: 'UPDATE_TEAM_LIST'; payload: getTeamListAPI[] }
  | { type: 'UPDATE_MONTH_YEAR'; payload: [string, number, number] }
  | { type: 'LOAD_WORKSHEET'; payload: SaveWorkSheet }
  | { type: 'UPDATE_WORKSHEET_NAME'; payload: string }
  | { type: 'CLEAR' };
