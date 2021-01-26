import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as _ from 'lodash';
import { Table } from 'antd';
import {
  format,
  getDaysInMonth,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
// import { AuthContext } from '../../Context/AuthContext';

import CalSummary from '../CalendarSummary/CalSummary';
import CalError from '../CalError/CalError';
import ActionBar from '../Actionbar/ActionBar';

// import PersonList from '../../data/persons.json';
import * as TableFnc from './CalFnc';
import { useHistory } from 'react-router';

const Calendar = () => {
  const history = useHistory();
  const [userData, setUserData] = useState([]);
  const [dateThai, setDateThai] = useState([]);
  const MemberList = useSelector((state) => state.tableHeader);
  const MonthYearSetup = useSelector((state) => state.MonthYear);
  const worksheetName = useSelector((state) => state.worksheetName);
  const tableData = useSelector((state) => state.tableData);
  if (!_.some(MemberList) || !_.some(MonthYearSetup)) {
    history.push('/setup'); // if no PersonList Data -> RETURN
  }

  /**
  |--------------------------------------------------
  | MONTH & DATE
  |--------------------------------------------------
  */
  if (_.some(MonthYearSetup)) {
    var dayCurrentMonth = getDaysInMonth(
      new Date(MonthYearSetup[2], MonthYearSetup[1])
    );
    var dayStartMonth = startOfMonth(
      new Date(MonthYearSetup[2], MonthYearSetup[1])
    );
    var dayEndMonth = endOfMonth(
      new Date(MonthYearSetup[2], MonthYearSetup[1])
    );
    var dayInterval = eachDayOfInterval({
      start: dayStartMonth,
      end: dayEndMonth,
    });
  }
  // console.log(format(dayStartMonth,'EEEE'));
  // console.log(dayStartMonth, dayEndMonth);
  // console.log(dayInterval);

  const formatDayOfWeek = (day) => {
    switch (day) {
      case 'Monday':
        return (day = 'จ');
      case 'Tuesday':
        return (day = 'อ');
      case 'Wednesday':
        return (day = 'พ');
      case 'Thursday':
        return (day = 'พฤ');
      case 'Friday':
        return (day = 'ศ');
      case 'Saturday':
        return (day = 'ส');
      case 'Sunday':
        return (day = 'อา');
    }
  };

  const exportExcelDate = (date) => {
    const dateThai = ['', ''];
    for (let i of date) {
      dateThai.push(formatDayOfWeek(format(i, 'EEEE')));
    }
    return dateThai;
  };

  useMemo(() => {
    if (_.some(MemberList) && _.some(MonthYearSetup)) {
      /* REAL WORK FLOW */
      setDateThai(exportExcelDate(dayInterval));
      setUserData(MemberList.person);
      /* TEST WORK FLOW */
      // console.log('MEMOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
      // console.log(MemberList);
      // console.log('DUMMY DAYA: ', PersonList);
      // setUserData(PersonList.person);
      // dispatch({ type: 'UPDATE_TABLE_HEADER', payload: PersonList.person });
      // dispatch({ type: 'UPDATE_TOTALSCH', payload: totalSch });
      // console.log(PersonList);
      // console.log('FIREBASE CURRENT USER', auth.currentUser);
    } else {
      history.push('/setup'); // if no PersonList Data -> RETURN
    }
    // console.log(MemberList.person);
    // setUserData(MemberList.person);
    // setDateThai(exportExcelDate(dayInterval));
  }, []);

  /**
  |--------------------------------------------------
  | FUNCTION
  |--------------------------------------------------
  */

  /* ----------- CELL DATA -----------*/
  // data is column not row . it mean position 0 = day 1 ***IMPORTANT
  const cD = [];
  // const memberLength = PersonList.person.length;
  if (_.some(MemberList)) {
    const memberLength = MemberList.person.length;
    for (let i = 1; i <= dayCurrentMonth; i++) {
      let empAr = []; // prepare array for push empty value in each column
      if (
        format(dayInterval[i - 1], 'E') === 'Sat' ||
        format(dayInterval[i - 1], 'E') === 'Sun'
      ) {
        for (let j = 0; j < 3; j++) {
          // empAr.push('0');
          empAr.push('');
        }
        for (let k = 0; k < memberLength - 3; k++) {
          empAr.push('');
        }
        cD.push(empAr);
      } else {
        for (let j = 0; j < memberLength; j++) {
          empAr.push('');
        }
        cD.push(empAr);
      }
    }
  }

  /* -------------- CELL TABLE DATA --------------- */
  const [cellData, setCellData] = useState(cD);
  const [limitCheck, setLimitCheck] = useState([]);
  const [totalSch, setTotalSch] = useState([]);
  const [nightMorning, setNightMorning] = useState([]);

  const updateCellData = (e, col, row) => {
    let value = e.target.value;
    setCellData((os) => {
      let data = [...os];
      data[col - 1][row - 1] = value;
      return data;
    });
  };

  useEffect(() => {
    // console.log('DATA TABLE UPDATE !!!');
    // console.log('UPDATE DATA :', cellData);
    setLimitCheck(() => {
      // const limitCheck = TableFnc.TableSummary(cellData); // ON CHANGE VALUE -> CALCULATE SCHEDULE LIMIT
      return [...TableFnc.TableSummary(cellData)];
    });
    setTotalSch(() => {
      return [...TableFnc.totalSchedule(cellData)];
    });
    setNightMorning(() => {
      return [...TableFnc.NightMorningError(cellData)];
    });
    // dispatch({ type: 'UPDATE_DATA', payload: cellData });
    // dispatch({ type: 'UPDATE_TOTALSCH', payload: totalSch });
    // console.log('UPDATE limitCheck', limitCheck);
  }, [cellData]);

  useEffect(() => {
    // dispatch({ type: 'UPDATE_DATA', payload: cellData });
    // console.log('UPDATE limitCheck', limitCheck);
    // console.log('TOTAL SCHEDULE', totalSch);
    // dispatch({ type: 'UPDATE_TOTALSCH', payload: totalSch });
  }, [limitCheck, totalSch]);

  useMemo(() => {
    // console.log(tableData);
    if (tableData.length !== 0) {
      setCellData(tableData);
    }
  }, []);

  // ----- UPDATE DATA (CLICK RANDOM BUTTON) -----
  const randomButton = () => {
    setCellData((os) => {
      return TableFnc.RandomSchedule([...os]); /* accidentally code */
    });
  };

  /*------------------------ TABLE HEADER STACK --------------------------*/

  const tableHeader = [];
  tableHeader.push(
    {
      title: <p className="p--table-header">#</p>,
      dataIndex: 'key',
      key: 'key',
      // width: '4.2rem',
      className: 'hos-table-cell--number',
      align: 'center',
      render: (key) => (
        <p className="p--table-namenum" id={key}>
          {key}
        </p>
      ),
    },
    {
      title: <p className="p--table-header">ชื่อ</p>,
      dataIndex: 'name',
      key: 'name',
      // width: '30rem',
      className: 'hos-table-cell--name',
      align: 'center',
      render: (text) => <p className="p--table-namenum">{text}</p>,
      // render: (text) => <p className="p--table-namenum"></p>,
    },
    {
      title: (
        <p className="p--table-header">{`${MonthYearSetup[0]} ${
          MonthYearSetup[2] + 543
        }`}</p>
      ),
      align: 'center',
      children: [],
    }
  );

  /* ---- 1 MONTH INPUT ---- */
  if (_.some(MonthYearSetup)) {
    for (let el of dayInterval) {
      let dayNumber = format(el, 'd');
      let dayText = formatDayOfWeek(format(el, 'EEEE')); // THAI TEXT STRING
      let titleClassname = ['p--table-header'];
      if (TableFnc.holidayCheck(format(el, 'E'))) {
        titleClassname.push('p--holiday');
      }
      tableHeader[2].children.push({
        title: <p className={titleClassname.join(' ')}>{dayNumber}</p>,
        align: 'center',
        // width: '50px',
        children: [
          {
            title: <p className={titleClassname.join(' ')}>{dayText}</p>,
            // width: '50px',
            align: 'center',
            dataIndex: 'schedule',
            key: dayNumber,
            className: 'hos-table-cell--nm-cell',
            render: (schedule) => (
              <input
                maxLength={6}
                className="input-editable p--table-rdcell"
                id={'r' + schedule.row + 'c' + dayNumber}
                onChange={(e) => {
                  updateCellData(e, parseInt(dayNumber), schedule.row);
                }}
                value={cellData[parseInt(dayNumber) - 1][schedule.row - 1]}
              />
            ),
          },
        ],
      });
    }
  }

  /*------------------------ TABLE CONFIG --------------------------*/
  const columns = tableHeader;
  const data = userData;
  const [lockStatus, setLockStatus] = useState(true);

  // console.log(userData, cellData, totalSch, dateThai);

  return (
    <div>
      {/* <button onClick={() => testUser()}>TEST FNC</button> */}
      <ActionBar
        lockStatus={lockStatus}
        onLock={() => setLockStatus((state) => !state)}
        onRandom={() => {
          // console.log(cellData);
          setCellData((data) => {
            return [...TableFnc.RandomSchedule(data)];
          });
        }}
        onClear={() => {
          const peopleCount = cellData[0].length;
          setCellData((data) => {
            return [...TableFnc.clearTableData(data, peopleCount)];
          });
        }}
        userData={userData}
        tableData={cellData}
        totalSchedule={totalSch}
        dateThaiFormat={dateThai}
        MonthYearSetup={MonthYearSetup}
        worksheetName={worksheetName}
      />
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered={true}
        size="small"
        className="table-main"
      />
      <div className="table-calculate">
        <CalSummary
          HeaderData={userData}
          SummaryData={totalSch}
          nmData={nightMorning}
        />
        <CalError ErrorData={limitCheck} />
      </div>
    </div>
  );
  // });
};

export default Calendar;
