import React, { useEffect, useState } from 'react';
// material-ui
import Grid from '@mui/material/Grid';

// project imports
import { gridSpacing } from 'store/constant';
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Card,
  alpha,
} from '@mui/material';
import {
  IconArrowsDiagonal,
  IconLock,
  IconCheck,
  IconUsers,
  IconUser,
} from '@tabler/icons-react';
import { toast } from 'react-toastify';

import PageContainer from 'ui-component/MainPage';
import DrogaCard from 'ui-component/cards/DrogaCard';

import GetToken from 'utils/auth-token';
import Backend from 'services/backend';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import AssignedPermission from './components/AssignedPermission';
import DashboardSelector from './dashboard-selector';

const SuperAdminDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roleLoading, setRoleLoading] = useState(false);
  const [statLoading, setStatLoading] = useState(true);
  const [stats, setStats] = useState([]);

  const handleFetchingStats = async () => {
    setStatLoading(true);
    const token = await GetToken();
    const Api = Backend.api + Backend.getStats;

    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    fetch(Api, {
      method: 'GET',
      headers: header,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setStats(response.data);
        } else {
          toast.warning(response.message);
        }
      })
      .catch((error) => {
        toast.warning(error.message);
      })
      .finally(() => {
        setStatLoading(false);
      });
  };

  const handleFetchingRole = () => {
    setRoleLoading(true);
    const token = localStorage.getItem('token');
    const Api = `${Backend.auth}${Backend.roles}`;

    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    fetch(Api, {
      method: 'GET',
      headers: header,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setRoles(response.data);
        }
        setRoleLoading(false);
      })
      .catch((error) => {
        setRoleLoading(false);
        toast(error.message);
      });
  };

  useEffect(() => {
    handleFetchingRole();
  }, []);
  // useEffect(() => {
  //   handleFetchingStats();
  // }, []);

  const StatCard = ({ icon: Icon, value, label, description, color }) => (
    <DrogaCard
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease-in-out',
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
          borderColor: alpha(color, 0.3),
        },
      }}
    >
      {statLoading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <ActivityIndicator size={20} />
        </Box>
      ) : (
        <React.Fragment>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 2,
                backgroundColor: alpha(color, 0.1),
                color: color,
              }}
            >
              <Icon size="1.8rem" stroke="1.8" />
            </Box>

            <Box>
              <Typography variant="h2" fontWeight="700" color={color}>
                {value}
              </Typography>
              <Typography
                variant="h6"
                fontWeight="600"
                color={theme.palette.text.primary}
              >
                {label}
              </Typography>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                {description}
              </Typography>
            </Box>
          </Box>

          <IconArrowsDiagonal
            size="1.2rem"
            stroke="1.8"
            color={theme.palette.grey[400]}
          />
        </React.Fragment>
      )}
    </DrogaCard>
  );

  return (
    <PageContainer title="Dashboard">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          {/* <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={IconUser}
                value={stats?.users}
                label="Users"
                description="Total System Users"
                color={theme.palette.primary.main}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={IconCheck}
                value={stats?.roles}
                label="Roles"
                description="Total User Roles"
                color="#10b981"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={IconLock}
                value={stats?.permissions}
                label="Permissions"
                description="Total Permissions"
                color="#8b5cf6"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={IconUsers}
                value={
                  stats?.eligible_employee + stats?.not_eligible_employee || 0
                }
                label="Employees"
                description="Total Employees"
                color="#f59e0b"
              />
            </Grid>
          </Grid> */}

          <Grid container spacing={gridSpacing} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <DrogaCard sx={{ p: 3, mt: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                  }}
                >
                  <Typography variant="h4" fontWeight="600">
                    Assigned Permissions & Roles
                  </Typography>
                </Box>

                {loading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 8,
                    }}
                  >
                    <ActivityIndicator size={24} />
                  </Box>
                ) : (
                  <AssignedPermission assigneperm={roles} />
                )}
              </DrogaCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default SuperAdminDashboard;
