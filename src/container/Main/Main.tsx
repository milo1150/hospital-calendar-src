import React from 'react';
import Calendar from '../../components/Calendar/Calendar';
import Topnav from '../hoc/Topnav';

const Main: React.FC = (): any => {
  return (
    <Topnav>
      <Calendar />
    </Topnav>
  );
};

export default Main;
