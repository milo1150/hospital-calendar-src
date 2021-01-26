import React, { FunctionComponent } from 'react';
import * as Types from '../../Typescript/ReducerTypes';
import { valueTypes, summaryValue, checkNightMorning } from './CalSumFnc';

// import PersonList from '../../data/persons.json';

import { Table } from 'antd';

interface NightMorning {
  pos: number;
  error: number;
}

interface CalSummaryProps {
  HeaderData: object[];
  SummaryData: Types.singleSummary[];
  nmData: NightMorning[];
}

const CalSummary: FunctionComponent<CalSummaryProps> = ({
  HeaderData,
  SummaryData,
  nmData,
}) => {
  const tableHeader: object[] = [];
  tableHeader.push(
    {
      title: <p className="p--table-header">#</p>,
      dataIndex: 'key',
      key: 'key',
      className: 'hos-table-cell--number',
      align: 'center',
      render: (key: string) => (
        <p className="p--table-namenum" id={key}>
          {key}
        </p>
      ),
    },
    {
      title: <p className="p--table-header">ชื่อ</p>,
      dataIndex: 'name',
      key: 'name',
      className: 'hos-table-cell--number',
      align: 'center',
      render: (text: string) => <p className="p--table-namenum">{text}</p>,
    },
    {
      title: <p className="p--table-header">จำนวนเวรทั้งหมด</p>,
      align: 'center',
      children: [
        // {
        //   title: <p className="p--table-header">OT ช</p>,
        //   align: 'center',
        //   className: 'hos-table-cell--sm-cell',
        //   dataIndex: 'key',
        //   // key: '',
        //   render: (key: string) => (
        //     <input
        //       className="input-editable p--table-rdcell"
        //       value={summaryValue(SummaryData, parseInt(key), valueTypes.otM)}
        //       readOnly
        //     />
        //   ),
        // },
        // {
        //   title: <p className="p--table-header">OT บ</p>,
        //   align: 'center',
        //   className: 'hos-table-cell--sm-cell',
        //   dataIndex: 'key',
        //   // key: '',
        //   render: (key: string) => (
        //     <input
        //       className="input-editable p--table-rdcell"
        //       value={summaryValue(SummaryData, parseInt(key), valueTypes.otE)}
        //       readOnly
        //     />
        //   ),
        // },
        // {
        //   title: <p className="p--table-header">OT ด</p>,
        //   align: 'center',
        //   // width: '5rem',
        //   dataIndex: 'key',
        //   // key: '',
        //   className: 'hos-table-cell--sm-cell',
        //   render: (key: string) => (
        //     <input
        //       className="input-editable p--table-rdcell"
        //       value={summaryValue(SummaryData, parseInt(key), valueTypes.otN)}
        //       readOnly
        //     />
        //   ),
        // },
        // {
        //   title: <p className="p--table-header">OT รวม</p>,
        //   align: 'center',
        //   // width: '5rem',
        //   dataIndex: 'key',
        //   // key: 'key',
        //   className: 'hos-table-cell--sm-cell',
        //   render: (key: string) => (
        //     <input
        //       className="input-editable p--table-rdcell"
        //       // value={CurrentValue(SummaryData, parseInt(key), valueTypes.ot)}
        //       value={summaryValue(SummaryData, parseInt(key), valueTypes.otAll)}
        //       readOnly
        //     />
        //   ),
        // },
        // {
        //   title: <p className="p--table-header">OT Ratio</p>,
        //   align: 'center',
        //   // width: '6rem',
        //   dataIndex: 'key',
        //   // key: '',
        //   className: 'hos-table-cell--sm-cell',
        //   render: (key: string) => (
        //     <input
        //       className="input-editable p--table-rdcell"
        //       value={summaryValue(
        //         SummaryData,
        //         parseInt(key),
        //         valueTypes.otRatio
        //       )}
        //       readOnly
        //     />
        //   ),
        // },
        {
          title: <p className="p--table-header">ช</p>,
          align: 'center',
          // width: '5rem',
          dataIndex: 'key',
          // key: '',
          className: 'hos-table-cell--sm-cell',
          render: (key: string) => (
            <input
              className="input-editable p--table-rdcell"
              value={summaryValue(SummaryData, parseInt(key), valueTypes.m)}
              readOnly
            />
          ),
        },
        {
          title: <p className="p--table-header">บ</p>,
          align: 'center',
          // width: '5rem',
          dataIndex: 'key',
          // key: '',
          className: 'hos-table-cell--sm-cell',
          render: (key: string) => (
            <input
              className="input-editable p--table-rdcell"
              value={summaryValue(SummaryData, parseInt(key), valueTypes.e)}
              readOnly
            />
          ),
        },
        {
          title: <p className="p--table-header">ด</p>,
          align: 'center',
          // width: '5rem',
          dataIndex: 'key',
          // key: '',
          className: 'hos-table-cell--sm-cell',
          render: (key: string) => (
            <input
              className="input-editable p--table-rdcell"
              value={summaryValue(SummaryData, parseInt(key), valueTypes.n)}
              readOnly
            />
          ),
        },
        // {
        //   title: <p className="p--table-header">รวม ช</p>,
        //   align: 'center',
        //   // width: '5rem',
        //   dataIndex: 'key',
        //   // key: '',
        //   className: 'hos-table-cell--sm-cell',
        //   render: (key: string) => (
        //     <input
        //       className="input-editable p--table-rdcell"
        //       value={summaryValue(SummaryData, parseInt(key), valueTypes.AllM)}
        //       readOnly
        //     />
        //   ),
        // },
        // {
        //   title: <p className="p--table-header">รวม บ</p>,
        //   align: 'center',
        //   // width: '5rem',
        //   dataIndex: 'key',
        //   // key: '',
        //   className: 'hos-table-cell--sm-cell',
        //   render: (key: string) => (
        //     <input
        //       className="input-editable p--table-rdcell"
        //       value={summaryValue(SummaryData, parseInt(key), valueTypes.AllE)}
        //       readOnly
        //     />
        //   ),
        // },
        // {
        //   title: <p className="p--table-header">รวม ด</p>,
        //   align: 'center',
        //   // width: '5rem',
        //   dataIndex: 'key',
        //   // key: '',
        //   className: 'hos-table-cell--sm-cell',
        //   render: (key: string) => (
        //     <input
        //       className="input-editable p--table-rdcell"
        //       value={summaryValue(SummaryData, parseInt(key), valueTypes.AllN)}
        //       readOnly
        //     />
        //   ),
        // },
        {
          title: <p className="p--table-header">รวม</p>,
          align: 'center',
          // width: '5rem',
          dataIndex: 'key',
          // key: '',
          className: 'hos-table-cell--sm-cell',
          render: (key: string) => (
            <input
              className="input-editable p--table-rdcell"
              value={summaryValue(SummaryData, parseInt(key), valueTypes.Total)}
              readOnly
            />
          ),
        },
        {
          title: <p className="p--table-header">OFF</p>,
          align: 'center',
          // width: '5rem',
          dataIndex: 'key',
          // key: '',
          className: 'hos-table-cell--sm-cell',
          render: (key: string) => (
            <input
              className="input-editable p--table-rdcell"
              value={summaryValue(SummaryData, parseInt(key), valueTypes.OFF)}
              readOnly
            />
          ),
        },
        {
          title: <p className="p--table-header">Vac</p>,
          align: 'center',
          // width: '5rem',
          dataIndex: 'key',
          // key: '',
          className: 'hos-table-cell--sm-cell',
          render: (key: string) => (
            <input
              className="input-editable p--table-rdcell"
              value={summaryValue(SummaryData, parseInt(key), valueTypes.vac)}
              readOnly
            />
          ),
        },
        {
          title: <p className="p--table-header p--warning">ด:ช</p>,
          align: 'center',
          // width: '6rem',
          dataIndex: 'key',
          // key: '',
          className: 'hos-table-cell--sm-cell',
          render: (key: string) => (
            <input
              className="input-editable p--table-rdcell p--warning"
              value={checkNightMorning(nmData, parseInt(key))}
              readOnly
            />
          ),
        },
      ],
    }
  );
  // console.log(data);
  // console.log(tableHeader);

  return (
    <div className="summary-table">
      <Table
        columns={tableHeader}
        dataSource={HeaderData}
        pagination={false}
        bordered={true}
        size="small"
        className="table-main"
      />
    </div>
  );
};

export default CalSummary;
