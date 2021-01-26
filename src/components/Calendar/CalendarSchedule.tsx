import React, { useState } from 'react';

import Calendar from './Calendar';
// import CalSummary from '../CalendarSummary/CalSummary';

const CalendarSchedule: React.FC = () => {
  return (
    <div className="content">
      <Calendar />
      {/* <CalSummary /> */}
    </div>
  );
};

export default CalendarSchedule;
