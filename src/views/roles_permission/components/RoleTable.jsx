import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
  TextField,
  useTheme,
  ListItemIcon,
  Checkbox,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Chip,
  InputLabel,
} from '@mui/material';
import { toast } from 'react-toastify';
import { DotMenu } from 'ui-component/menu/DotMenu';
import { IconChevronDown, IconChevronRight, IconX } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Backend from 'services/backend';
import Fallbacks from 'utils/components/Fallbacks';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';
import DrogaButton from 'ui-component/buttons/DrogaButton';
import Search from 'ui-component/search';
import DrogaCard from 'ui-component/cards/DrogaCard';
import GetToken from 'utils/auth-token';

const RoleTable = ({ searchQuery }) => {
  const theme = useTheme();
  const [roleLoading, setRoleLoading] = useState(true);
  const [permLoading, setPermLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editedRole, setEditedRole] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [allPermissions, setAllPermissions] = useState([]); // To store all available permissions
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
          setRoles(response.data); // Update roles state
        }
        setRoleLoading(false);
      })
      .catch((error) => {
        setRoleLoading(false);
        setError(true);
        toast(error.message);
      });
  };

  const filteredPermissions = Object.keys(allPermissions).reduce(
    (acc, type) => {
      const filtered = allPermissions[type].filter((perm) =>
        perm.name.toLowerCase().includes(search.toLowerCase()),
      );
      if (filtered.length > 0) {
        acc[type] = filtered;
      }
      return acc;
    },
    {},
  );

  const handleSearchingPermission = (event) => {
    const value = event.target.value;
    setSearch(value);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenRole = (index) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedRole(null);
  };

  const handleOpenEditModal = (role) => {
    setPermLoading(true);
    setEditedRole({ name: role.name });
    setSelectedRole(role);
    setSelectedPermissions(role.permissions.map((perm) => perm.uuid));
    setOpenEditModal(true);
    handleCloseMenu();

    // Fetch all permissions from the backend
    const token = localStorage.getItem('token');
    const Api = Backend.auth + Backend.permissi; // Assuming this is the correct endpoint
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

          setAllPermissions(grouped); // Store all permissions
        } else {
          toast('Error fetching permissions');
        }
      })
      .catch((error) => {
        toast(error.message);
      })
      .finally(() => setPermLoading(false));
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedRole(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedRole((prev) => ({ ...prev, [name]: value }));
  };
  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prevSelected) => {
      if (prevSelected.includes(permissionId)) {
        return prevSelected.filter((id) => id !== permissionId); // Deselect permission
      } else {
        return [...prevSelected, permissionId]; // Select permission
      }
    });
  };

  const handleSaveEdit = async () => {
    setSubmitting(true);
    const token = await GetToken();
    const Api = Backend.auth + Backend.roles + `/${selectedRole.uuid}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    // Prepare the payload with role name and selected permissions
    const payload = {
      name: editedRole.name,
      permissions: selectedPermissions, // Send the updated list of permissions
    };

    fetch(Api, {
      method: 'PATCH',
      headers: header,
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          toast('Role updated successfully');
          handleFetchingRole();
          handleCloseEditModal();
        } else {
          toast('Error updating role');
        }
      })
      .catch((error) => {
        toast(error.message);
      })
      .finally(() => setSubmitting(false));
  };

  const handleDelete = (roleId) => {
    const token = localStorage.getItem('token');
    const Api = Backend.auth + Backend.roles + `/${roleId}`;
    const header = {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    };

    fetch(Api, {
      method: 'DELETE',
      headers: header,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          setRoles((prevRoles) =>
            prevRoles.filter((role) => role.uuid !== roleId),
          );
          toast.success(response?.data?.message);
          handleFetchingRole();
        } else {
          toast('Error deleting role');
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const groupPermissionsByType = (permissions) => {
    return permissions.reduce((groups, permission) => {
      const { type } = permission;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(permission);
      return groups;
    }, {});
  };

  useEffect(() => {
    handleFetchingRole();
  }, []);

  return (
    <Box
      component={Paper}
      sx={{
        minHeight: '40dvh',
        width: '100%',
        border: 0,
        borderRadius: 3,
        p: 3,
        background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {roleLoading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40dvh',
          }}
        >
          <ActivityIndicator size={24} />
        </Box>
      ) : error ? (
        <Fallbacks
          severity="error"
          title="Server error"
          description="There is an error fetching Roles"
        />
      ) : filteredRoles.length === 0 ? (
        <Fallbacks
          severity="info"
          title="No Roles Found"
          description="The list of added Roles will be listed here"
        />
      ) : (
        filteredRoles.map((role, index) => (
          <Box
            key={role.uuid}
            onClick={() => handleOpenRole(index)}
            sx={{
              mb: 2,
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                borderColor: theme.palette.primary.light,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background:
                  selectedIndex === index
                    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                p: 3,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor:
                      selectedIndex === index
                        ? 'white'
                        : theme.palette.primary.main,
                    transition: 'all 0.3s ease',
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    color:
                      selectedIndex === index
                        ? 'white'
                        : theme.palette.text.primary,
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {role.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DotMenu
                  orientation="horizontal"
                  onEdit={() => handleOpenEditModal(role)}
                  onDelete={() => handleDelete(role.uuid)}
                  sx={{
                    color:
                      selectedIndex === index
                        ? 'white'
                        : theme.palette.text.secondary,
                    '&:hover': {
                      color:
                        selectedIndex === index
                          ? 'white'
                          : theme.palette.primary.main,
                    },
                  }}
                />

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenRole(index);
                  }}
                  sx={{
                    marginLeft: 1,
                    color:
                      selectedIndex === index
                        ? 'white'
                        : theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor:
                        selectedIndex === index
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  {selectedIndex === index ? (
                    <IconChevronDown size="1.4rem" stroke="2" />
                  ) : (
                    <IconChevronRight size="1.4rem" stroke="2" />
                  )}
                </IconButton>
              </Box>
            </Box>
            {selectedIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ p: 3, background: theme.palette.background.paper }}>
                  <Divider
                    sx={{
                      borderBottom: 1,
                      borderColor: theme.palette.divider,
                      mb: 3,
                      opacity: 0.6,
                    }}
                  />
                  {Object.entries(groupPermissionsByType(role.permissions)).map(
                    ([type, perms], i) => (
                      <Box key={i} sx={{ mb: 4 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            textTransform: 'uppercase',
                            mb: 3,
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            letterSpacing: '0.1em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.primary.main,
                            }}
                          />
                          Assigned Permissions
                        </Typography>

                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: 2,
                          }}
                        >
                          {perms.map((perm, idx) => (
                            <Card
                              key={idx}
                              elevation={0}
                              sx={{
                                padding: 2.5,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                                border: `1px solid ${theme.palette.divider}`,
                                transition:
                                  'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                                  borderColor: theme.palette.primary.light,
                                },
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  height: 3,
                                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                },
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  mb: 1.5,
                                  color: theme.palette.text.primary,
                                  fontSize: '0.95rem',
                                }}
                              >
                                {perm.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{
                                  mb: 2,
                                  lineHeight: 1.5,
                                  fontSize: '0.825rem',
                                }}
                              >
                                {perm.description || 'No description available'}
                              </Typography>
                              <Chip
                                label="Assigned"
                                size="small"
                                sx={{
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  height: 24,
                                  background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
                                  color: 'white',
                                  '& .MuiChip-label': {
                                    px: 1.5,
                                  },
                                }}
                              />
                            </Card>
                          ))}
                        </Box>
                      </Box>
                    ),
                  )}
                </Box>
              </motion.div>
            )}
          </Box>
        ))
      )}

      {/* Edit Modal */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        fullWidth={true}
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            pb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 600, color: 'white' }}>
            Edit Role
          </Typography>

          <motion.div
            whileHover={{
              rotate: 90,
              scale: 1.1,
            }}
            transition={{ duration: 0.2 }}
            style={{ cursor: 'pointer' }}
            onClick={handleCloseEditModal}
          >
            <IconX size="1.6rem" stroke={2.5} color="white" />
          </motion.div>
        </Box>

        <DialogContent sx={{ p: 4 }}>
          <Box>
            <TextField
              label="Role Name"
              name="name"
              value={editedRole.name}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />

            <Divider sx={{ my: 3, opacity: 0.6 }} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h4" mb={2} sx={{ fontWeight: 600 }}>
                  Permissions
                </Typography>
              </Grid>

              <Grid item xs={12} mb={2}>
                <Search
                  title="Search Permissions"
                  filter={false}
                  value={search}
                  onChange={handleSearchingPermission}
                />
              </Grid>
              {permLoading ? (
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 4,
                    }}
                  >
                    <ActivityIndicator size={24} />
                  </Grid>
                </Grid>
              ) : (Object.keys(allPermissions).length === 0) === 0 ? (
                <Typography
                  sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}
                >
                  No permissions available
                </Typography>
              ) : (
                Object.keys(filteredPermissions).map((type, index) => (
                  <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                    <DrogaCard
                      sx={{
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      <Box sx={{ p: 2.5 }}>
                        {filteredPermissions[type].map((permission) => (
                          <Box
                            key={permission.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 1.5,
                              borderRadius: 2,
                              transition: 'all 0.2s ease',
                              mb: 1,
                              '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                transform: 'translateX(4px)',
                              },
                              '&:last-child': {
                                mb: 0,
                              },
                            }}
                          >
                            <Checkbox
                              checked={selectedPermissions.includes(
                                permission.id,
                              )}
                              onChange={() =>
                                handlePermissionChange(permission.id)
                              }
                              sx={{
                                color: theme.palette.primary.main,
                                '&.Mui-checked': {
                                  color: theme.palette.primary.main,
                                },
                              }}
                            />

                            <Typography
                              sx={{
                                ml: 2,
                                cursor: 'pointer',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                flex: 1,
                              }}
                              onClick={() =>
                                handlePermissionChange(permission.id)
                              }
                            >
                              {permission.name}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </DrogaCard>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
          <Button
            onClick={handleCloseEditModal}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              borderColor: theme.palette.divider,
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            }}
          >
            Cancel
          </Button>
          <DrogaButton
            title={
              submitting ? (
                <ActivityIndicator size={18} sx={{ color: 'white' }} />
              ) : (
                'Save Changes'
              )
            }
            onPress={handleSaveEdit}
            color="primary"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: `0 6px 20px ${theme.palette.primary.main}40`,
              },
            }}
          />
        </DialogActions>
      </Dialog>

      {/* View Details Modal */}
      <Dialog
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            fontWeight: 600,
          }}
        >
          Role Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Role Name:
          </Typography>
          <Typography
            sx={{
              mb: 3,
              p: 2,
              backgroundColor: theme.palette.action.hover,
              borderRadius: 2,
            }}
          >
            {selectedRole?.name}
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Permissions:
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedRole?.permissions.length === 0 ? (
              <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                No permissions assigned
              </Typography>
            ) : (
              selectedRole?.permissions.map((perm) => (
                <Chip
                  key={perm.uuid}
                  label={perm.name}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
                    color: 'white',
                    fontWeight: 500,
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseDetailModal}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleTable;
