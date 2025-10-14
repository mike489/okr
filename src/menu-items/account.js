// assets
import { IconDeviceIpadHorizontalX } from '@tabler/icons-react';
import { IconKey, IconUserCog } from '@tabler/icons-react';
import getRolesAndPermissionsFromToken from 'utils/auth/getRolesAndPermissionsFromToken';

// constant
const icons = {
  IconKey,
  IconUserCog,
  IconDeviceIpadHorizontalX,
};

// ==============================|| USER MANAGEMENT MENU ITEMS ||============================== //
const auth = getRolesAndPermissionsFromToken();

export const Accounts = () => {
  const childrenTemp = [];
  const addedPermissions = new Set();

  const orderedPermissions = [
    'read_role',
    'read:permissions',
    'read_user',
    'read:employees_plan_remove',
  ];

  const permissionMap = {
    read_role: {
      id: 'role',
      title: 'Role and Permission',
      icon: icons.IconKey,
      url: '/role-permission',
    },
    'read:permissions': {
      id: 'role',
      title: 'Role and Permission',
      icon: icons.IconKey,
      url: '/role-permission',
    },
    read_user: {
      id: 'users',
      title: 'Users',
      requiredRole: 'Admin',
      icon: icons.IconUserCog,
      url: '/users',
    },
    'read:employees_plan_remove': {
      id: 'employees_plan_remove',
      title: 'Plan Remove',
      icon: icons.IconDeviceIpadHorizontalX,
      url: '/employees_plan_remove',
    },
    'read:deletelog': {
      id: 'delated_plan_log',
      title: 'Removed Plan Log',
      icon: icons.IconDeviceIpadHorizontalX,
      url: '/delated_plan_log',
    },
  };

  if (auth) {
    // Loop through the permissions in the defined order
    orderedPermissions.forEach((permissionName) => {
      auth.forEach((role) => {
        const setting = permissionMap[permissionName];

        // Only add the item if the permission exists and hasn't been added yet
        if (setting && !addedPermissions.has(setting.id)) {
          const hasPermission = role.permissions.find(
            (per) => per.name === permissionName,
          );

          if (hasPermission) {
            childrenTemp.push({
              ...setting,
              type: 'item', // common type for all settings
            });
            addedPermissions.add(setting.id); // Mark the permission as added
          }
        }
      });
    });
  }

  return {
    id: 'account',
    title: 'Account',
    type: 'group',
    icon: icons.IconUserCog,
    children: childrenTemp,
  };
};
