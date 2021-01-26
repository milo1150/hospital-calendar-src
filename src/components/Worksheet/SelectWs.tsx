import React, {
  FunctionComponent,
  useState,
  useEffect,
  useReducer,
} from 'react';
import Topnav from '../../container/hoc/Topnav';
import { Steps, Button, Divider, Select, Modal } from 'antd';
import { getYear } from 'date-fns';
import { Fab } from '@material-ui/core';
import { Group } from '@material-ui/icons';
import SideDrawer from './ManageGroup';
import * as _ from 'lodash';
import { useHistory } from 'react-router';

import { useSelector, useDispatch } from 'react-redux';
import { TableData } from '../../Typescript/ReducerTypes';
import { MemberListEntries } from '../Calendar/CalendarType';
import { database, auth } from '../../firebase';
import * as CalendarType from '../Calendar/CalendarType';

/**
|--------------------------------------------------
| COMPONENT SETUP
|--------------------------------------------------
*/
type ModalType = boolean;
interface SaveWorkSheet {
  MonthYearSetup: [string, number, number];
  tableData: CalendarType.tableData;
  userData: CalendarType.userData;
  worksheetName: string;
}
const { Step } = Steps;
const { Option } = Select;

const yearSelector: number[] = [];
(function setYearSelector() {
  let currentYear: number = getYear(new Date());
  for (let i: number = 0; i < 5; i++) {
    yearSelector.push(currentYear);
    currentYear += 1;
  }
})();

/**
|--------------------------------------------------
| REDUCER
|--------------------------------------------------
*/
interface ReducerState {
  currentStep: number;
  SelectTeamStatus: boolean;
  completeStep: boolean;
  month: string;
  year: number;
  team: string;
  loadWorkSheet: SaveWorkSheet[];
}

type ActionType =
  | { type: 'currentstep'; payload: number }
  | { type: 'teamstatus' }
  | { type: 'completestep' }
  | { type: 'updatemonth'; payload: string }
  | { type: 'updateyear'; payload: number }
  | { type: 'updateteam'; payload: string }
  | { type: 'loadworksheet'; payload: SaveWorkSheet[] };

const initialState: ReducerState = {
  currentStep: 0,
  SelectTeamStatus: true,
  completeStep: true,
  month: '',
  year: getYear(new Date()),
  team: '',
  loadWorkSheet: [],
};

function reducer(state: ReducerState, action: ActionType) {
  switch (action.type) {
    case 'currentstep':
      state.currentStep = action.payload;
      return { ...state };
    case 'updatemonth':
      state.month = action.payload;
      return { ...state }; // WTF IS THIS . magic
    case 'updateyear':
      state.year = action.payload;
      return { ...state };
    case 'teamstatus':
      state.SelectTeamStatus = false;
      return { ...state };
    case 'updateteam':
      state.team = action.payload;
      return { ...state };
    case 'completestep':
      state.completeStep = false;
      return { ...state };
    case 'loadworksheet':
      state.loadWorkSheet = action.payload;
      return { ...state };
    default:
      return state;
  }
}

/**
|--------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------
*/
const SelectWs: FunctionComponent = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [visible, setVisible] = useState<ModalType>(false);
  const [sdVisible, setSdVisible] = useState<ModalType>(false);
  const [wsName, setWsName] = useState<string>('');
  const teamList: any | unknown = useSelector<TableData>(
    (data) => data.teamList
  ); //if select just state . it will not update
  const _dispatch = useDispatch();
  const history = useHistory();
  const UID: string | undefined = auth.currentUser?.uid;

  const showSideDraw = () => {
    setSdVisible(true);
  };
  const hideSideDraw = () => {
    setSdVisible(false);
  };
  const showModal = () => {
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
  };

  /**
   * WORK FLOW
   */

  useEffect(() => {
    dispatch({ type: 'updatemonth', payload: '' });
    dispatch({ type: 'currentstep', payload: 0 });
    _dispatch({ type: 'CLEAR' });
  }, [_dispatch]);

  /* GET WORKSHEET SAVED */
  useEffect(() => {
    const ref = database.ref(`users/${UID}/save_worksheet`);
    ref.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        dispatch({ type: 'loadworksheet', payload: Object.values(data) });
      }
    });
  }, [UID]);

  useEffect(() => {
    if (state.month) {
      if (state.team) return;
      dispatch({ type: 'currentstep', payload: 1 });
      dispatch({ type: 'teamstatus' });
    }
  }, [state.month, state.team]);

  useEffect(() => {
    if (state.team) {
      dispatch({ type: 'currentstep', payload: 2 });
      dispatch({ type: 'completestep' });
    }
  }, [state.team]);

  /**
  |--------------------------------------------------
  | FUNCTION
  |--------------------------------------------------
  */
  const MonthChangeHandler = (value: string) => {
    return dispatch({ type: 'updatemonth', payload: value });
  };

  const YearChangeHandler = (value: number) => {
    return dispatch({ type: 'updateyear', payload: value });
  };

  const TeamSelectChange = (value: string) => {
    return dispatch({ type: 'updateteam', payload: value });
  };

  type THMonth = { ThaiText: string; MonthNumber: number };
  const ConvertMonthTH = (text: string): THMonth => {
    switch (text) {
      case 'January':
        return { ThaiText: 'มกราคม', MonthNumber: 0 };
      case 'February':
        return { ThaiText: 'กุมภาพันธ์', MonthNumber: 1 };
      case 'March':
        return { ThaiText: 'มีนาคม', MonthNumber: 2 };
      case 'April':
        return { ThaiText: 'เมษายน', MonthNumber: 3 };
      case 'May':
        return { ThaiText: 'พฤษภาคม', MonthNumber: 4 };
      case 'June':
        return { ThaiText: 'มิถุนายน', MonthNumber: 5 };
      case 'July':
        return { ThaiText: 'กรกฏาคม', MonthNumber: 6 };
      case 'August':
        return { ThaiText: 'สิงหาคม', MonthNumber: 7 };
      case 'September':
        return { ThaiText: 'กันยายน', MonthNumber: 8 };
      case 'October':
        return { ThaiText: 'ตุลาคม', MonthNumber: 9 };
      case 'November':
        return { ThaiText: 'พฤศจิกายน', MonthNumber: 10 };
      case 'December':
        return { ThaiText: 'ธันวาคม', MonthNumber: 11 };
      default:
        throw new Error();
    }
  };

  const setupDone = () => {
    const Teamlist: [string, MemberListEntries][] = Object.entries(teamList);
    const index: number = (function findTeamIndex(): number {
      let teamIndex: number = 0;
      for (let i in Teamlist) {
        if (Teamlist[i][0] === state.team) {
          return (teamIndex = parseInt(i));
        }
      }
      return teamIndex;
    })();

    /* FINAL STEP */
    const PersonList = Teamlist[index][1];
    const monthToThai = ConvertMonthTH(state.month);
    const MonthYear: [string, number, number] = [
      monthToThai.ThaiText,
      monthToThai.MonthNumber,
      state.year,
    ];
    _dispatch({ type: 'UPDATE_TABLE_HEADER', payload: PersonList.groupList });
    _dispatch({ type: 'UPDATE_MONTH_YEAR', payload: MonthYear });
    history.push('/worksheet');
  };

  /**
  |--------------------------------------------------
  | JSX FUNCTION
  |--------------------------------------------------
  */
  /* (SELECT) TEAM VALUE */
  const SelectTeam = (): any => {
    const optionList: any[] = [];
    if (!teamList) return;
    const teamListData = Object.entries(teamList);
    // or check by _.some(Object)
    if (teamListData.length !== 0) {
      // console.log(teamListData);
      for (const i in teamListData) {
        optionList.push(
          <Option value={teamListData[i][0]}>{teamListData[i][0]}</Option>
        );
      }
      return optionList.map((el) => el);
    } else {
      return;
    }
  };

  const loadWorkSheet = (): any => {
    const worksheet: SaveWorkSheet[] = state.loadWorkSheet;
    const optionWs: any[] = [];
    for (let i: number = 0; i < worksheet.length; i++) {
      let wsName: string = worksheet[i].worksheetName;
      optionWs.push(<Option value={wsName}>{wsName}</Option>);
    }
    const prepWorkSheet = () => {
      const wsData = _.find(state.loadWorkSheet, {
        worksheetName: wsName,
      });
      // console.log(wsData);
      if (wsData) {
        _dispatch({ type: 'LOAD_WORKSHEET', payload: wsData });
        history.push('/worksheet');
      }
    };
    return (
      <div className="save-popover">
        <p className="save-popover__p-topic--loadws">Load</p>
        <Select
          showSearch
          placeholder="Worksheet"
          optionFilterProp="children"
          className="ws-setup__team-select"
          onChange={(e) => {
            setWsName(e.toString());
          }}
        >
          {optionWs.map((el) => el)}
        </Select>
        <div className="save-popover__action">
          <Button
            type="primary"
            onClick={() => prepWorkSheet()}
            // loading={saveLoading}
          >
            OK
          </Button>
          <Button type="link" onClick={() => hideModal()}>
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  /**
  |--------------------------------------------------
  | RETURN 
  |--------------------------------------------------
  */
  return (
    <Topnav>
      {/* <p>Month is : {state.month}</p> */}
      <div className="worksheet-layout">
        <div className="worksheet-box">
          <div className="worksheet-box__new-ws">
            <Steps direction="vertical" current={state.currentStep}>
              <Step title="Calendar" description="Select month and year" />
              <Step title="Group" description="Select group" />
              <Step title="Ready" description="Worksheet is ready" />
            </Steps>
            <div className="ws-setup">
              <div className="ws-setup__year-month">
                <div className="ws-setup__year-month-block">
                  <div>
                    <Select
                      className="ws-setup__year-month--month"
                      defaultValue="Month"
                      onChange={MonthChangeHandler}
                    >
                      <Option value="January">January</Option>
                      <Option value="February">February</Option>
                      <Option value="March">March</Option>
                      <Option value="April">April</Option>
                      <Option value="May">May</Option>
                      <Option value="June">June</Option>
                      <Option value="July">July</Option>
                      <Option value="August">August</Option>
                      <Option value="September">September</Option>
                      <Option value="October">October</Option>
                      <Option value="November">November</Option>
                      <Option value="December">December</Option>
                    </Select>
                  </div>
                  <div>
                    <Select
                      className="ws-setup__year-month--year"
                      defaultValue={state.year}
                      onChange={YearChangeHandler}
                    >
                      {yearSelector.map((el) => (
                        <Option value={el}>{el}</Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="ws-setup__team-box">
                <Select
                  showSearch
                  placeholder="Search to Select"
                  optionFilterProp="children"
                  className="ws-setup__team-select"
                  onChange={TeamSelectChange}
                  disabled={state.SelectTeamStatus}
                >
                  {SelectTeam()}
                </Select>
                {/* <Tooltip placement="right" title="Manage group"> */}
                <Fab
                  size="small"
                  className="group-fab"
                  disabled={false}
                  onClick={() => showSideDraw()}
                >
                  <Group className="group-icon" />
                </Fab>
                {/* </Tooltip> */}
              </div>
              <div className="ws-setup__done">
                <Button
                  type="primary"
                  disabled={state.completeStep}
                  onClick={() => setupDone()}
                >
                  GO TO WORKSHEET
                </Button>
              </div>
            </div>
          </div>
          <Divider type="vertical" className="divider-prepsheet">
            <p className="divider-text">OR</p>
          </Divider>
          <div className="ws-setup__done">
            <Button
              className="btn-custom-01"
              type="primary"
              onClick={() => showModal()}
            >
              LOAD WORKSHEET
            </Button>
          </div>
        </div>
      </div>
      <SideDrawer sdOnClose={hideSideDraw} sdVisible={sdVisible} />{' '}
      <Modal
        visible={visible}
        keyboard={false} // prevent ESC button
        centered={true} // Center modal
        closable={false} // hide x button on top right
        maskClosable={false} // prevent click on backdrop
        zIndex={10}
        footer={false}
      >
        {loadWorkSheet()}
      </Modal>
    </Topnav>
  );
};

export default SelectWs;
