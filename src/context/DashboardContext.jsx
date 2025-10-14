import React, { createContext, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { CheckForPendingTasks } from 'utils/check-for-pending-tasks';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [activeDashboard, setActiveDashboard] = useState('Employee');
  const dispatch = useDispatch();

  const handleChangingDashboard = async (newDashboard, fiscal_year_id) => {
    setActiveDashboard(newDashboard);
    // await CheckForPendingTasks(dispatch);
  };

  return (
    <DashboardContext.Provider
      value={{
        activeDashboard,
        handleChangingDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboards = () => useContext(DashboardContext);
