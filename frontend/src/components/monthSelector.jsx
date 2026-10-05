import React from 'react'
import { useState } from 'react'

function MonthSelector({viewDate,setViewDate}) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const isAtCurrentMonth =
    viewDate.year === currentYear && viewDate.month === currentMonth;

  const handlePrevious = () => {
    setViewDate((prev) =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year, month: prev.month - 1 }
    );
  };

  const handleNext = () => {
    if (isAtCurrentMonth) return;
    setViewDate((prev) =>
      prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { year: prev.year, month: prev.month + 1 }
    );
  };

  return (
    <div className="month-selector">
      <button onClick={handlePrevious}>
        <i className="bi bi-chevron-left"></i>
      </button>

      <span>
        {monthNames[viewDate.month]} {viewDate.year}
      </span>

      <button
        onClick={handleNext}
        disabled={isAtCurrentMonth}
        style={{
          opacity: isAtCurrentMonth ? 0.4 : 1,
          cursor: isAtCurrentMonth ? "not-allowed" : "pointer",
        }}
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
}

export default MonthSelector;
