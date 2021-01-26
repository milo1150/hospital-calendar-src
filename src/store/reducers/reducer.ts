import * as Types from '../../Typescript/ReducerTypes';

/* TEST DATA */
// import PersonList from '../../data/persons.json';
// const initialState: Types.TableData = {
//   tableHeader: PersonList,
//   teamList: [],
//   MonthYear: ['มีนาคม', 2, 2022],
//   worksheetName: 'testWorkSheet01',
//   tableData: [],
// };

/* DEPLOY DATA */
const initialState: Types.TableData = {
  tableHeader: {},
  teamList: [],
  MonthYear: ['', 0, 0],
  worksheetName: '',
  tableData: [],
};

const reducer = (state = initialState, action: Types.ACTIONTYPE) => {
  switch (action.type) {
    case 'UPDATE_TABLE_HEADER':
      // console.log('HEADER UPDATE');
      state.tableHeader = action.payload;
      return state;
    case 'UPDATE_TEAM_LIST':
      // console.log('UPDATE TEAM LIST');
      state.teamList = action.payload;
      return state;
    case 'UPDATE_MONTH_YEAR':
      // console.log('UPDATE MONTH YEAR');
      state.MonthYear = action.payload;
      return state;
    case 'LOAD_WORKSHEET':
      // console.log('LOAD_WORKSHEET');
      state.tableHeader = action.payload.userData;
      state.MonthYear = action.payload.MonthYearSetup;
      state.worksheetName = action.payload.worksheetName;
      state.tableData = action.payload.tableData;
      return state;
    case 'UPDATE_WORKSHEET_NAME':
      state.worksheetName = action.payload;
      return state;
    case 'CLEAR':
      state.tableHeader = {};
      state.MonthYear = ['', 0, 0];
      state.worksheetName = '';
      state.tableData = [];
      return state;
    default:
      return state;
  }
};

export default reducer;
