import {
  IconHome,
  IconGauge,
  IconLayoutCards,
  IconTrophy,
  IconZoomScan,
  IconCircleCheck,
  IconListCheck,
  IconHazeMoon,
  IconList,
  IconChartInfographic,
  IconKey,
  IconAnalyze,
  IconSteam,
  IconCircle,
  IconFocus2,
  IconCreditCardRefund,
  IconAlbum,
  IconDeviceCctv,
  IconHeartHandshake,
  IconFileSymlink,
  IconFileAnalytics,
  IconBrandAsana,
  IconDeviceDesktopAnalytics,
} from '@tabler/icons-react';

const icons = {
  IconHome,
  IconGauge,
  IconLayoutCards,
  IconTrophy,
  IconZoomScan,
  IconCircleCheck,
  IconListCheck,
  IconHazeMoon,
  IconList,
  IconChartInfographic,
  IconKey,
  IconAnalyze,
  IconSteam,
  IconCircle,
  IconFocus2,
  IconCreditCardRefund,
  IconAlbum,
  IconDeviceCctv,
  IconHeartHandshake,
  IconFileSymlink,
  IconFileAnalytics,
  IconBrandAsana,
  IconDeviceDesktopAnalytics,
};
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();
export const dashboard = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const userPermissions = [
    'read:kpi',
    'read:employeetask',
    'read:myteams',
    'read:endofdayactivity',
    'read:my-teams-eod-reports',
    'read:kpitracker',
    'read:plan_status',
    'read:task_status',
    'read:approval',
    'read:monitoring',
    'read:monitor-status',
    'read:evaluation',
    'read:feedback',
    'read:coaching',
    'read:myfeedbacks',
    'read:performance',
    'read:report',
    'read:monitoringReport',
    'read:deletelog',
    'read:revision',
  ];

  const permissionMap = {
    'read:kpi': {
      id: 'kpi-management',
      title: 'KPI Management',
      url: '/kpi/kpi-managment',
      icon: icons.IconKey,
    },

    'read:kpitracker': {
      id: 'planning',
      title: 'Planning',
      url: '/planning',
      icon: icons.IconLayoutCards,
    },

    'read:approval': {
      id: 'approvals',
      title: 'Approval Requests',
      url: '/approvals',
      icon: icons.IconCircleCheck,
    },

    'read:monitoring': {
      id: 'monitoring',
      title: 'Monitoring',
      url: '/monitoring',
      icon: icons.IconAnalyze,
    },

    'read:deletelog': {
      id: 'delated_plan_log',
      title: 'Deleted Log',
      url: '/delated_plan_log',
      icon: icons.IconAlbum,
    },

    'read:evaluation': {
      id: 'evaluations',
      title: 'Evaluation',
      url: '/evaluations',
      icon: icons.IconListCheck,
    },

    'read:performance': {
      id: 'performance',
      title: 'Performance',
      url: '/performance',
      icon: icons.IconTrophy,
    },
    'read:report': {
      id: 'report',
      title: 'Reports',
      url: '/report',
      icon: icons.IconChartInfographic,
    },
    'read:revision': {
      id: 'revision',
      title: 'Revision',
      url: '/revision',
      icon: icons.IconFileSymlink,
    },
  };

  if (auth) {
    userPermissions.forEach((permissionName) => {
      auth.forEach((role) => {
        const setting =
          permissionMap[permissionName] ||
          permissionMap[`${permissionName}-approvals`];

        if (setting && !addedPermissions.has(setting.id)) {
          const hasPermission = role.permissions.find(
            (per) => per.name === permissionName,
          );

          if (hasPermission) {
            childrenTemp.push({
              ...setting,
              type: 'item',
            });
            addedPermissions.add(setting.id);
          }
        }
      });
    });
  }

  return {
    id: 'dashboard',
    title: 'Performance Management',
    icon: icons.IconGauge,
    type: 'group',
    children: childrenTemp,
  };
};
