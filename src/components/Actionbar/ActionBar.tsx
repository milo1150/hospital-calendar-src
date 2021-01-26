import React, { FunctionComponent, useState, useRef } from 'react';
import { getYear } from 'date-fns';
import {
  Button,
  Input,
  Popover,
  message,
  Divider,
  Popconfirm,
} from 'antd';
import { Fab } from '@material-ui/core';
import {
  LockOutlined,
  Sync,
  Clear,
  CloudUploadOutlined,
  KeyboardArrowLeftOutlined,
} from '@material-ui/icons';

import * as CalendarType from '../Calendar/CalendarType';
import ExcelExport from '../Excel/ExcelExport';
import { database, auth } from '../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { TableData } from '../../Typescript/ReducerTypes';
import { useHistory } from 'react-router';

interface Props {
  lockStatus: boolean;
  onLock: () => any;
  onRandom: () => any;
  onClear: () => any;
  userData: CalendarType.userData;
  tableData: CalendarType.tableData;
  totalSchedule: CalendarType.totalSchedule;
  dateThaiFormat: CalendarType.dateThaiFormat;
  MonthYearSetup: [string, number, number];
  worksheetName: string;
}

interface WsConfig {
  worksheetName: string;
  userData: {
    person: CalendarType.userData;
  };
  tableData: CalendarType.tableData;
  MonthYearSetup: [string, number, number];
}

// const { Option } = Select;
const yearSelector: number[] = [];
(function setYearSelector() {
  let currentYear: number = getYear(new Date());
  for (let i: number = 0; i < 5; i++) {
    yearSelector.push(currentYear);
    currentYear += 1;
  }
})();

const ActionBar: FunctionComponent<Props> = (props) => {
  const { userData, tableData, MonthYearSetup, worksheetName } = props;
  const [savePopup, setSavePopup] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  // const [ruleModal, setRuleModal] = useState<boolean>(false);
  const [filename, setFileName] = useState<string>('');
  const saveInput = useRef<any>();
  const history = useHistory();
  const wsName = useSelector<TableData>((state) => state.worksheetName);
  const _dispatch = useDispatch();

  /* WORKSHEET (WS) CONFIG */
  const PersonList: { person: CalendarType.userData } = {
    person: userData,
  };
  const wsConfig: WsConfig = {
    worksheetName: worksheetName,
    userData: PersonList,
    tableData: tableData,
    MonthYearSetup: MonthYearSetup,
  };
  const UID: string | undefined = auth.currentUser?.uid;

  /**
  |--------------------------------------------------
  | FUNCTION
  |--------------------------------------------------
  */
  const saveWorkSheet = async () => {
    if (wsConfig.worksheetName) {
      // console.log(wsConfig.worksheetName);
      const ref = database.ref(
        `users/${UID}/save_worksheet/${wsConfig.worksheetName}`
      );
      await ref.update(wsConfig, (err) => {
        if (err) {
          alert('this is error. please contact oosamuoo02@gmail.com');
        } else {
          message.success('Save complete', 2);
        }
      });
    } else {
      setSavePopup((state) => !state);
    }
  };

  const onSaveFileHandler = async () => {
    if (wsConfig.worksheetName) {
      alert('this is error. please contact oosamuoo02@gmail.com');
    } else {
      if (!filename) {
        saveInput.current.focus();
        return;
      } else if (filename) {
        setSaveLoading(true);
        const ref = database.ref(`users/${UID}/save_worksheet/${filename}`);
        await ref.set(
          {
            MonthYearSetup: wsConfig.MonthYearSetup,
            tableData: wsConfig.tableData,
            userData: wsConfig.userData,
            worksheetName: filename,
          },
          (err) => {
            if (err) {
              alert('this is error. please contact oosamuoo02@gmail.com');
            } else {
              setSaveLoading(false);
              setSavePopup(false);
              message.success('Save complete', 2);
              _dispatch({ type: 'UPDATE_WORKSHEET_NAME', payload: filename });
            }
          }
        );
      }
    }
  };

  /* Save As Popover */
  const savePopverElement = () => {
    return (
      <div className="save-popover">
        <p className="save-popover__p-topic">Save As</p>
        <Input
          className="save-popover__input"
          placeholder="Filename"
          onChange={(e) => {
            setFileName(e.target.value);
          }}
          value={filename}
          ref={saveInput}
        />
        <div className="save-popover__action">
          <Button
            type="primary"
            onClick={() => onSaveFileHandler()}
            loading={saveLoading}
          >
            Save
          </Button>
          <Button type="link" onClick={() => setSavePopup(false)}>
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
    <div className="actionbar">
      <div className="actionbar__project-setup">
        <Popconfirm
          title="Back to setup ?"
          onConfirm={() => {
            history.push('/setup');
          }}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
          placement="bottomRight"
        >
          <div className="actionbar__back-btn">
            <KeyboardArrowLeftOutlined fontSize="large" />
            <p className="p--table-header">Back</p>
          </div>
        </Popconfirm>

        {wsName && <Divider className="actionbar__divider" type="vertical" />}
        <div className="actionbar__wsname">
          {wsName ? (
            <p className="p--table-header">Worksheet : {wsName}</p>
          ) : null}
        </div>
      </div>

      {/* DO NOT FUCKING TOUCH THIS SHIT. IT'S COMPLETE ............... */}
      <div className="actionbar__button-group">
        <div className="actionbar__fab-box">
          <Popover
            placement="left"
            content={savePopverElement}
            trigger="click"
            visible={savePopup}
          >
            <Fab
              size="small"
              className="actionbar__fab actionbar__fab--"
              onClick={saveWorkSheet}
            >
              <CloudUploadOutlined className="actionbar__fabicon" />
            </Fab>
          </Popover>
          <p className="actionbar__fab-text">Save</p>
        </div>
        <ExcelExport
          userData={props.userData}
          tableData={props.tableData}
          totalSchedule={props.totalSchedule}
          dateThaiFormat={props.dateThaiFormat}
        />
        <Divider className="actionbar__divider" type="vertical" />
        <div className="actionbar__fab-box">
          <Fab
            size="small"
            className="actionbar__fab actionbar__fab--lock"
            onClick={props.onLock}
          >
            <LockOutlined className="actionbar__fabicon" />
          </Fab>
          <p className="actionbar__fab-text">
            {props.lockStatus ? <p>Unlock</p> : <p>Lock</p>}
          </p>
        </div>
        <div className="actionbar__fab-box">
          <Fab
            size="small"
            className="actionbar__fab actionbar__fab--random"
            onClick={props.onRandom}
            disabled={props.lockStatus}
          >
            <Sync className="actionbar__fabicon" />
          </Fab>
          <p className="actionbar__fab-text">Random</p>
        </div>
        <div className="actionbar__fab-box">
          <Fab
            size="small"
            className="actionbar__fab actionbar__fab--clear"
            onClick={props.onClear}
            disabled={props.lockStatus}
          >
            <Clear className="actionbar__fabicon" />
          </Fab>
          <p className="actionbar__fab-text">Clear</p>
        </div>
        {/* <div className="actionbar__fab-box">
          <Fab size="small" className="actionbar__fab actionbar__fab--clear">
            <TuneOutlined className="actionbar__fabicon" />
          </Fab>
          <p className="actionbar__fab-text">Rule</p>
        </div> */}
      </div>
      {/* <Modal
        visible={ruleModal}
        keyboard={true} // prevent ESC button
        centered={true} // Center modal
        closable={true} // hide x button on top right
        maskClosable={false} // prevent click on backdrop
        zIndex={10}
        footer={false}
      >
        hello
      </Modal> */}
    </div>
  );
};

export default ActionBar;
