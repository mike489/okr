import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Protected from 'Protected';

// dashboard routing
const Home = Loadable(lazy(() => import('views/dashboard')));
const Units = Loadable(lazy(() => import('views/units')));
const Employees = Loadable(lazy(() => import('views/employees')));

const EmployeesPlanRemove = Loadable(
  lazy(() => import('views/employees/components/EmployeesPlanRemove')),
);
const EmployeesRemovedPlanLog = Loadable(
  lazy(() => import('views/employees/components/EmployeesRemovedPlanLog')),
);
const MyEmployees = Loadable(
  lazy(() => import('views/employees/my_employees')),
);
const ViewEmployee = Loadable(lazy(() => import('views/employees/view')));
const ViewTaskEmployee = Loadable(
  lazy(() => import('views/dashboard/components/hr/view')),
);
// const ViewEmployeeFeedBack = Loadable(
//   lazy(() => import('views/feedbacks/feedBack')),
// );

const PerformanceRating = Loadable(
  lazy(() => import('views/settings/performance-ratings')),
);
const Perspectives = Loadable(
  lazy(() => import('views/settings/perspectives')),
);

const Periods = Loadable(lazy(() => import('views/settings/periods')));

const Frequencies = Loadable(lazy(() => import('views/settings/frequencies')));
const NotFound = Loadable(lazy(() => import('views/not-found')));

const Performance = Loadable(lazy(() => import('views/performance')));
const PerKPIPerformanceReport = Loadable(
  lazy(() => import('views/Report/components/per-kpi-performance')),
);

const Account = Loadable(lazy(() => import('views/account')));
const KPIManagement = Loadable(lazy(() => import('views/kpi')));
const Users = Loadable(lazy(() => import('views/users')));
const Workflows = Loadable(lazy(() => import('views/workflows')));
const Report = Loadable(lazy(() => import('views/Report')));
const Viewoverallcompany = Loadable(
  lazy(() => import('views/Report/admin_side/UnitDetailView')),
);
const ViewKpiDetail = Loadable(
  lazy(() => import('views/Report/admin_side/KpiDetailView')),
);
// const Job = Loadable(lazy(() => import('views/job-positions/index')));

// utilities routing
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const BasicConfigPage = Loadable(
  lazy(() => import('views/settings/view/basic-config')),
);
const RolePermission = Loadable(
  lazy(() => import('views/roles_permission/Page')),
);
const Unauthorized = Loadable(lazy(() => import('utils/unautorized')));

// sample page routingkpiMange-view
const Testpage = Loadable(lazy(() => import('views/sample-page/test')));
const Fortest = Loadable(lazy(() => import('views/dashboard/index')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: (
        <Protected>
          <Home />
        </Protected>
      ),
    },
    {
      path: 'home',
      element: (
        <Protected>
          <Home />
        </Protected>
      ),
    },

    {
      path: 'account',
      element: (
        <Protected>
          <Account />
        </Protected>
      ),
    },

    {
      path: 'employees',
      element: (
        <Protected>
          <Employees />
        </Protected>
      ),
    },
    {
      path: 'employees_plan_remove',
      element: (
        <Protected>
          <EmployeesPlanRemove />
        </Protected>
      ),
    },
    {
      path: 'delated_plan_log',
      element: (
        <Protected>
          <EmployeesRemovedPlanLog />
        </Protected>
      ),
    },
    {
      path: 'my_employees',
      element: (
        <Protected>
          <MyEmployees />
        </Protected>
      ),
    },

    {
      path: 'employees/view',
      element: (
        <Protected>
          <ViewEmployee />
        </Protected>
      ),
    },
    {
      path: 'hr/view',
      element: (
        <Protected>
          <ViewTaskEmployee />
        </Protected>
      ),
    },
    // {
    //   path: 'employeesFeedBack/view',
    //   element: (
    //     <Protected>
    //       <ViewEmployeeFeedBack />
    //     </Protected>
    //   ),
    // },

    {
      path: 'workflows',
      element: (
        <Protected>
          <Workflows />
        </Protected>
      ),
    },

    {
      path: 'performance',
      element: (
        <Protected>
          <Performance />
        </Protected>
      ),
    },
    {
      path: 'per-kpi-performance',
      element: (
        <Protected>
          <PerKPIPerformanceReport />
        </Protected>
      ),
    },

    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: (
            <Protected>
              <UtilsColor />
            </Protected>
          ),
        },
      ],
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: (
            <Protected>
              <UtilsShadow />
            </Protected>
          ),
        },
      ],
    },

    {
      path: 'basic-config',
      children: [
        {
          path: 'basic-config-creation',
          element: (
            <Protected>
              <BasicConfigPage />
            </Protected>
          ),
        },
      ],
    },
    {
      path: 'frequencies',
      element: (
        <Protected>
          <Frequencies />
        </Protected>
      ),
    },
    {
      path: 'periods',
      element: (
        <Protected>
          <Periods />
        </Protected>
      ),
    },

    {
      path: 'perspectives',
      element: (
        <Protected>
          <Perspectives />
        </Protected>
      ),
    },

    {
      path: 'performance-rating',
      element: (
        <Protected>
          <PerformanceRating />
        </Protected>
      ),
    },
    {
      path: 'kpi',
      children: [
        {
          path: 'kpi-managment',
          element: (
            <Protected>
              <KPIManagement />
            </Protected>
          ),
        },
      ],
    },

    {
      path: 'users',
      element: (
        <Protected>
          <Users />
        </Protected>
      ),
    },

    {
      path: 'role-permission',
      element: (
        <Protected>
          <RolePermission />
        </Protected>
      ),
    },

    {
      path: 'report',
      element: (
        <Protected>
          <Report />
        </Protected>
      ),
    },

    {
      path: '/report/overall_company',
      element: (
        <Protected>
          <Viewoverallcompany />
        </Protected>
      ),
    },

    {
      path: '/report/KpiDetailView',
      element: (
        <Protected>
          <ViewKpiDetail />
        </Protected>
      ),
    },

    {
      path: 'unauthorized',
      element: <Unauthorized />,
    },
    {
      path: 'test',
      element: (
        <Protected>
          <Testpage />
        </Protected>
      ),
    },
    {
      path: 'fortest',
      element: (
        <Protected>
          <Fortest />
        </Protected>
      ),
    },

    // {
    //   path: 'job',
    //   element: (
    //     <Protected>
    //       <Job />
    //     </Protected>
    //   ),
    // },
    {
      path: 'units',
      element: (
        <Protected>
          <Units />
        </Protected>
      ),
    },
    {
      path: '/*',
      element: <NotFound />,
    },
  ],
};

export default MainRoutes;
