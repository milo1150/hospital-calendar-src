import React, { FunctionComponent, useState, useEffect } from 'react';
import { Alert } from 'antd';

type ErrorSch = {
  m: number;
  e: number;
  n: number;
};

interface ErrorData {
  ErrorData: ErrorSch[];
}

const CalError: FunctionComponent<ErrorData> = ({ ErrorData }) => {
  const [data, setData] = useState<ErrorSch[]>([]);
  useEffect(() => {
    if (ErrorData.length !== 0) {
      setData(ErrorData);
    } else {
      return;
    }
  }, [ErrorData]);

  interface AlertType {
    date: number;
    expect: string[];
    over: string[];
  }

  /**
   * AlertMessage
   */
  const AlertMessage = (data: AlertType): string => {
    let text: string[] = [];
    text.push('วันที่ ' + data.date + ' :');
    if (data.expect.length !== 0) {
      text.push('ขาด ~');
      for (let i of data.expect) {
        text.push(i);
      }
    }
    if (data.over.length !== 0) {
      if (data.expect.length !== 0) {
        text.push(' | ');
      }
      text.push('เกิน ~');
      for (let i of data.over) {
        text.push(i);
      }
    }
    // console.log(text.join(' '));
    return text.join(' ');
  };

  /**
   * AlertType
   */
  const AlertMessageType = (data: AlertType): any => {
    let type: string;
    if (data.over.length !== 0) {
      type = 'error';
    } else {
      type = 'warning';
    }
    return type;
  };

  /**
   * Calculate Warning String
   */
  const ErrorElement = () => {
    if (data.length !== 0) {
      let renderData: AlertType[] = [];
      for (let i in data) {
        const ObjectValue: ErrorSch = data[i];
        const anyColumnValue: AlertType = {
          date: parseInt(i) + 1,
          expect: [],
          over: [],
        };
        /* Morning */
        let morning: string = ObjectValue.m.toString().replace('-', '');
        if (ObjectValue.m > 0) {
          anyColumnValue.expect.push('เช้า ' + morning);
        } else if (ObjectValue.m < 0) {
          anyColumnValue.over.push('เช้า ' + morning);
        }
        /* Evening */
        let evening: string = ObjectValue.e.toString().replace('-', '');
        if (ObjectValue.e > 0) {
          anyColumnValue.expect.push('บ่าย ' + evening);
        } else if (ObjectValue.e < 0) {
          anyColumnValue.over.push('บ่าย ' + evening);
        }
        /* Night */
        let night: string = ObjectValue.n.toString().replace('-', '');
        if (ObjectValue.n > 0) {
          anyColumnValue.expect.push('ดึก ' + night);
        } else if (ObjectValue.n < 0) {
          anyColumnValue.over.push('ดึก ' + night);
        }
        renderData.push(anyColumnValue);
      }

      return (
        <div className="error-table__body">
          <div className="error-table__message-box">
            {renderData.map((el) => (
              <div className="error-table__message-box--alert">
                {(el.expect.length !== 0 || el.over.length !== 0) && (
                  <Alert
                    message={AlertMessage(el)}
                    type={AlertMessageType(el)}
                    showIcon
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return;
    }
  };
  return <div className="error-table">{ErrorElement()}</div>;
};
export default CalError;
