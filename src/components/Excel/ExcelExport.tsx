import React, { FunctionComponent } from 'react';
import { Fab } from '@material-ui/core';
import { ArchiveOutlined } from '@material-ui/icons';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { useSelector } from 'react-redux';
import { TableData } from '../../Typescript/ReducerTypes';

/**
|--------------------------------------------------
| TYPE
|--------------------------------------------------
*/
interface userData {
  key: number;
  name: string;
  schedule: {
    row: number;
    column: any[];
  };
}

interface Summary {
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

interface Data {
  userData: userData[];
  tableData: string[][];
  totalSchedule: Summary[];
  dateThaiFormat: string[];
}

type strNum = string | number;

/**
|--------------------------------------------------
| COMPONENT
|--------------------------------------------------
*/
const ExcelExport: FunctionComponent<Data> = ({
  userData,
  tableData,
  totalSchedule,
  dateThaiFormat,
}) => {
  const MonthYear: any = useSelector<TableData>((state) => state.MonthYear);
  const FileName: any = useSelector<TableData>((state) => state.worksheetName);
  if (MonthYear) {
  }

  /**
   * EXPORT DATA
   */
  const exportHandler = (
    userData: userData[],
    tableData: string[][],
    totalSchedule: Summary[],
    dateThaiFormat: string[]
  ) => {
    // console.log(userData, tableData, totalSchedule);

    // Set Filename of excel
    let ExportName: string = '';
    if (FileName) {
      ExportName = FileName;
    } else {
      ExportName = MonthYear[0] + ' ' + MonthYear[2];
    }

    const exportData: strNum[][] = []; // EXPORT DATA
    exportData.push(dateThaiFormat); // PUSH THAI DATE FORMAT TABLEHEADE

    const dayFormat: strNum[] = ['#', 'ชื่อ - สกุล']; // SECOND HEADER ROW
    for (let i in tableData) {
      let date: number = parseInt(i) + 1;
      dayFormat.push(date);
    }
    // dayFormat.push('OT ช');
    // dayFormat.push('OT บ');
    // dayFormat.push('OT ด');
    // dayFormat.push('OT รวม');
    // dayFormat.push('สัดส่วน OT');
    dayFormat.push('ช');
    dayFormat.push('บ');
    dayFormat.push('ด');
    dayFormat.push('รวม');
    // dayFormat.push('รวม ช');
    // dayFormat.push('รวม บ');
    // dayFormat.push('รวม ด');
    dayFormat.push('OFF');
    dayFormat.push('VAC');

    exportData.push(dayFormat); //PUSH DATE NUMBER

    /* PUSH TABLE DATA */
    for (let i: number = 0; i < totalSchedule.length; i++) {
      let peopleData: strNum[] = [];
      peopleData.push(i + 1);
      peopleData.push(userData[i].name);
      for (let j: number = 0; j < tableData.length; j++) {
        peopleData.push(tableData[j][i]);
      }
      // peopleData.push(totalSchedule[i].otM);
      // peopleData.push(totalSchedule[i].otE);
      // peopleData.push(totalSchedule[i].otN);
      // peopleData.push(
      //   totalSchedule[i].otM + totalSchedule[i].otE + totalSchedule[i].otN
      // );
      // peopleData.push('');
      peopleData.push(totalSchedule[i].m);
      peopleData.push(totalSchedule[i].e);
      peopleData.push(totalSchedule[i].n);
      peopleData.push(
        totalSchedule[i].m + totalSchedule[i].e + totalSchedule[i].n
      );
      // peopleData.push(totalSchedule[i].m + totalSchedule[i].otM);
      // peopleData.push(totalSchedule[i].e + totalSchedule[i].otE);
      // peopleData.push(totalSchedule[i].n + totalSchedule[i].otN);
      peopleData.push(totalSchedule[i].OFF);
      peopleData.push(totalSchedule[i].vac);

      exportData.push(peopleData);
    }

    // console.log(exportData);

    /**
     * EXCEL EXPORT SETTING
     */
    const fileType: string =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension: string = '.xlsx';
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, ExportName + fileExtension); // EXPORT
  };

  return (
    <div className="actionbar__fab-box">
      <Fab
        size="small"
        className="actionbar__fab actionbar__fab--export-excel"
        onClick={() =>
          exportHandler(userData, tableData, totalSchedule, dateThaiFormat)
        }
      >
        <ArchiveOutlined className="actionbar__fabicon" />
      </Fab>
      <p className="actionbar__fab-text">Excel</p>
    </div>
  );
};

export default ExcelExport;
