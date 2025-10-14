// assets
import {
  IconBriefcase,
  IconBuildingSkyscraper,
  IconFileRss,
  IconHierarchy,
  IconUsersGroup,
} from '@tabler/icons-react';
import { IconKey, IconABOff, IconFile3d } from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// constant
const icons = {
  IconKey,
  IconABOff,
  IconFile3d,
  IconFileRss,
  IconBuildingSkyscraper,
  IconUsersGroup,
  IconHierarchy,
  IconBriefcase,
};

// ==============================|| ORGANIZATION PAGES MENU ITEMS ||============================== //

const auth = getRolesAndPermissionsFromToken();

export const getOrgStructure = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = [
    'read_unit',
    'read:employee',
    'read:jobposition',
    'read:my_units',
    'read:my_employees',
  ];

  const permissionMap = {
    read_unit: {
      id: 'units',
      title: 'Units',
      icon: icons.IconBuildingSkyscraper,
      url: '/units',
    },
    read_employee: {
      id: 'employees',
      title: 'Employees',
      requiredRole: 'Admin',
      url: '/employees',
      icon: icons.IconUsersGroup,
    },

    'read:my_units': {
      id: 'my_units',
      title: 'My Units',
      icon: icons.IconBuildingSkyscraper,
      url: '/my_units',
    },

    'read:my_employees': {
      id: 'my_employees',
      title: 'My Employees',
      requiredRole: 'Admin',
      url: '/my_employees',
      icon: icons.IconUsersGroup,
    },
    'read:jobposition': {
      id: 'Job',
      title: 'Job Positions',
      url: '/job',
      icon: icons.IconBriefcase,
    },
  };

  if (auth) {
    orderedPermissions.forEach((permissionName) => {
      auth.forEach((role) => {
        const setting = permissionMap[permissionName];

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
    id: 'dep',
    title: 'Organization Structure',
    type: 'group',
    icon: icons.IconHierarchy,
    children: childrenTemp,
  };
};
