

import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRolesAndPermissionsFromToken } from './utils/auth/getRolesAndPermissionsFromToken';

const Protected = ({ children, requiredRole, requiredPermission }) => {
  const roles = getRolesAndPermissionsFromToken() || [];

  const hasRequiredRole = requiredRole ? roles.some((role) => role.name === requiredRole) : true;
  const hasRequiredPermission = requiredPermission
    ? roles.some((role) => role.permissions.some((permission) => permission.name === requiredPermission))
    : true;

  if (!hasRequiredRole || !hasRequiredPermission) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default Protected;

