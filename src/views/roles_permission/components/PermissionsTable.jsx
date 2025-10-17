import React, { useState, useEffect } from 'react';
import {
  TableContainer,
  Paper,
  useTheme,
  Box,
  Typography,
  Grid,
  Divider,
  Tooltip,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import Backend from 'services/backend';
import Fallbacks from 'utils/components/Fallbacks';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import DrogaCard from 'ui-component/cards/DrogaCard';

const PermissionsTable = ({ onPermissionsFetch }) => {
  const theme = useTheme();
  const [permissionLoading, setPermissionLoading] = useState(true);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [error, setError] = useState(false);
  const [permissionMap, setPermissionMap] = useState({});

  const handleFetchingPermissions = () => {
    setPermissionLoading(true);
    const token = localStorage.getItem('token');
    const Api = Backend.auth + Backend.permissi;
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
        setPermissionLoading(false);

        if (response.success) {
          const permissionsData = response.data;

          const grouped = permissionsData.reduce((acc, perm) => {
            const parts = perm.name.split('_');
            const type = parts.slice(1).join('_');
            if (!acc[type]) {
              acc[type] = [];
            }
            acc[type].push({ name: perm.name, id: perm.uuid });
            return acc;
          }, {});

          const permissionMap = permissionsData.reduce((map, perm) => {
            map[perm.name] = perm.uuid;
            return map;
          }, {});

          setGroupedPermissions(grouped);
          setPermissionMap(permissionMap);
          onPermissionsFetch(permissionsData);
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        setPermissionLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    handleFetchingPermissions();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '5dvh',
        margin: 0,
        marginTop: 0,
        paddingY: 4,
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      {permissionLoading ? (
        <Box
          sx={{
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
          }}
        >
          <ActivityIndicator size={24} />
        </Box>
      ) : error ? (
        <Fallbacks
          severity="error"
          title="Server error"
          description="There is an error fetching Permissions"
        />
      ) : Object.keys(groupedPermissions).length === 0 ? (
        <Fallbacks
          severity="info"
          title="Permission not found"
          description="The list of added Permissions will be listed here"
          sx={{ paddingTop: 6 }}
        />
      ) : (
        <Grid container spacing={3}>
          {Object.keys(groupedPermissions).map((type) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={type}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                    borderColor: theme.palette.primary.light,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  },
                }}
              >
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="700"
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'capitalize',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Typography>
                    <Chip
                      label={groupedPermissions[type].length}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
                        minWidth: 24,
                      }}
                    />
                  </Box>

                  <Divider
                    sx={{
                      mb: 2.5,
                      borderColor: theme.palette.divider,
                      opacity: 0.6,
                    }}
                  />

                  <Box>
                    {groupedPermissions[type].map((perm, index) => (
                      <Tooltip
                        key={perm.id}
                        title={perm.name}
                        placement="top"
                        arrow
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{
                            marginBottom: 1.5,
                            padding: 2,
                            borderRadius: 2,
                            background: theme.palette.background.default,
                            border: `1px solid ${theme.palette.divider}`,
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                              borderColor: theme.palette.primary.light,
                              transform: 'translateX(4px)',
                            },
                            '&:last-child': {
                              marginBottom: 0,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.primary.main,
                              marginRight: 2,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{
                              flex: 1,
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontWeight: 500,
                              color: theme.palette.text.primary,
                              fontSize: '0.85rem',
                            }}
                          >
                            {perm.name}
                          </Typography>
                        </Box>
                      </Tooltip>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PermissionsTable;
