// import dashboard from './dashboard';
import { getOrgStructure } from './org-structure';
import { settings } from './settings';
import { Accounts } from './account';
import { dashboard } from './dashboard';
import { TeamAndPersonalReports } from './Team-personal-reports';
import { StatusReport } from './status-reports';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [
    dashboard(),
    TeamAndPersonalReports(),
    StatusReport(),
    getOrgStructure(),
    Accounts(),
    settings(),
  ],
};

export default menuItems;
