export type userData = userDataIndex[]; // state => userData
export type tableData = string[][]; // state => cellData
export type totalSchedule = totalScheduleSummary[]; // state => totalSch
export type dateThaiFormat = string[]; // state => dateThai

export interface userDataIndex {
  key: number;
  name: string;
  schedule: {
    row: number;
    column: any[];
  };
}
export interface MemberList {
  person: userDataIndex[];
  [value: number]: Object;
}
// API ~ Get teamlist
export interface getTeamListAPI {
  groupList: {
    person: userDataIndex[];
  };
}

export interface MemberListEntries {
  groupList: {
    person: userDataIndex[];
  };
}

interface totalScheduleSummary {
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
