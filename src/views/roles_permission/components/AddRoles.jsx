import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {
  Modal,
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { toast } from 'react-toastify';
import { Formik, Form, Field, FieldArray } from 'formik';
import { motion } from 'framer-motion';
import Fallbacks from 'utils/components/Fallbacks';
import * as Yup from 'yup';
import DrogaCard from 'ui-component/cards/DrogaCard';
import Search from 'ui-component/search';
import DrogaButton from 'ui-component/buttons/DrogaButton';
import { IconX } from '@tabler/icons-react';
import GetToken from 'utils/auth-token';
import Backend from 'services/backend';
import ActivityIndicator from 'ui-component/indicators/ActivityIndicator';

const roleSchema = Yup.object().shape({
  roleName: Yup.string().required('Role name is required'),
  permissions: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one permission is required'),
});

const AddRole = ({ open, handleClose, onSave, submitting }) => {
  const [search, setSearch] = useState('');
  const [permissionLoading, setPermissionLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState(false);

  const handleSearchingPermission = (event) => {
    const value = event.target.value;
    setSearch(value);
  };

  const filteredPermissions = Object.keys(permissions).reduce((acc, type) => {
    const filtered = permissions[type].filter((perm) =>
      perm.name.toLowerCase().includes(search.toLowerCase()),
    );
    if (filtered.length > 0) {
      acc[type] = filtered;
    }
    return acc;
  }, {});

  const handleFetchingPermissions = async () => {
    setPermissionLoading(true);
    const token = await GetToken();
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

          setPermissions(grouped);
        }
      })
      .catch(() => {})
      .finally(() => setPermissionLoading(false));
  };

  useEffect(() => {
    handleFetchingPermissions();
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      }}
      fullWidth={true}
      maxWidth="lg"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          height: '90vh',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '1200px',
          bgcolor: 'background.paper',
          background: `linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)`,
          boxShadow: '0 32px 64px rgba(0,0,0,0.2)',
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header - Fixed */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 4,
            pb: 3,
            background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
            color: 'white',
            flexShrink: 0,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
            Create New Role
          </Typography>

          <motion.div
            whileHover={{
              rotate: 90,
              scale: 1.1,
            }}
            transition={{ duration: 0.2 }}
            style={{ cursor: 'pointer' }}
            onClick={handleClose}
          >
            <IconX size="1.6rem" stroke={2.5} color="white" />
          </motion.div>
        </Box>

        {/* Scrollable Content */}
        <Box
          sx={{
            p: 4,
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Formik
            initialValues={{ roleName: '', permissions: [] }}
            validationSchema={roleSchema}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
              if (values.permissions.length === 0) {
                setFieldError(
                  'permissions',
                  'Please select at least one permission.',
                );
                setSubmitting(false);
                return;
              }

              onSave(values, permissions)
                .then(() => {
                  handleClose();
                  toast.success('Role created successfully');
                })
                .catch(() => {
                  toast.error('Failed to save role. Please try again.');
                })
                .finally(() => {
                  setSubmitting(false);
                });
            }}
          >
            {({ values, setFieldValue, errors, touched, resetForm }) => (
              <Form
                style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
              >
                {/* Role Name Field */}
                <TextField
                  name="roleName"
                  label="Role Name"
                  value={values.roleName}
                  onChange={(e) => setFieldValue('roleName', e.target.value)}
                  error={touched.roleName && Boolean(errors.roleName)}
                  helperText={touched.roleName && errors.roleName}
                  margin="normal"
                  fullWidth
                  sx={{
                    my: 3,
                    flexShrink: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />

                <Typography
                  variant="h4"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: 'text.primary',
                    flexShrink: 0,
                  }}
                >
                  Attach Permissions
                </Typography>

                {/* Search - Fixed */}
                <Box sx={{ flexShrink: 0 }}>
                  <Search
                    title="Search Permissions"
                    filter={false}
                    value={search}
                    onChange={handleSearchingPermission}
                  />
                </Box>

                {/* Permissions Grid - Scrollable */}
                <Grid
                  container
                  spacing={3}
                  sx={{
                    mt: 1,
                    flex: 1,
                    overflowY: 'auto',
                    alignContent: 'flex-start',
                  }}
                >
                  {permissionLoading ? (
                    <Grid item xs={12}>
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
                    </Grid>
                  ) : error ? (
                    <Grid item xs={12}>
                      <Fallbacks
                        severity="error"
                        title="Server error"
                        description="There is an error fetching Permissions"
                      />
                    </Grid>
                  ) : Object.keys(permissions).length === 0 ? (
                    <Grid item xs={12}>
                      <Fallbacks
                        severity="info"
                        title="No Permissions Found"
                        description="The list of added Permissions will be listed here"
                        sx={{ paddingTop: 6 }}
                      />
                    </Grid>
                  ) : (
                    <FieldArray
                      name="permissions"
                      render={() =>
                        Object.keys(filteredPermissions).map((type) => (
                          <Grid item xs={12} sm={6} md={4} xl={3} key={type}>
                            <Card
                              sx={{
                                height: '100%',
                                background: `linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)`,
                                border: `1px solid rgba(0,0,0,0.08)`,
                                borderRadius: 3,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease',
                                overflow: 'hidden',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                                },
                              }}
                            >
                              <CardContent
                                sx={{ p: 3, '&:last-child': { pb: 3 } }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    mb: 2,
                                    fontWeight: 600,
                                    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {type}
                                </Typography>

                                {filteredPermissions[type].map((perm) => (
                                  <FormControlLabel
                                    key={perm.id}
                                    control={
                                      <Field
                                        type="checkbox"
                                        name="permissions"
                                        value={perm.name}
                                        as={Checkbox}
                                        checked={values.permissions.includes(
                                          perm.name,
                                        )}
                                        onChange={() => {
                                          if (
                                            values.permissions.includes(
                                              perm.name,
                                            )
                                          ) {
                                            setFieldValue(
                                              'permissions',
                                              values.permissions.filter(
                                                (p) => p !== perm.name,
                                              ),
                                            );
                                          } else {
                                            setFieldValue('permissions', [
                                              ...values.permissions,
                                              perm.name,
                                            ]);
                                          }
                                        }}
                                        sx={{
                                          color: 'primary.main',
                                          '&.Mui-checked': {
                                            color: 'primary.main',
                                          },
                                        }}
                                      />
                                    }
                                    label={
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontSize: '0.85rem',
                                          fontWeight: 500,
                                        }}
                                      >
                                        {perm.name}
                                      </Typography>
                                    }
                                    sx={{
                                      width: '100%',
                                      m: 0,
                                      mb: 1,
                                      p: 1.5,
                                      borderRadius: 2,
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        backgroundColor: 'action.hover',
                                        transform: 'translateX(4px)',
                                      },
                                      '&:last-child': {
                                        mb: 0,
                                      },
                                    }}
                                  />
                                ))}
                              </CardContent>
                            </Card>
                          </Grid>
                        ))
                      }
                    />
                  )}
                </Grid>

                {/* Error Message - Fixed at bottom */}
                {errors.permissions && touched.permissions && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      backgroundColor: 'error.light',
                      color: 'error.dark',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'error.main',
                      textAlign: 'center',
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    <Typography variant="body2">
                      {errors.permissions}
                    </Typography>
                  </Box>
                )}

                {/* Actions - Fixed at bottom */}
                <Grid container sx={{ mt: 4, flexShrink: 0 }}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 2,
                    }}
                  >
                    <Button
                      onClick={() => {
                        resetForm();
                        handleClose();
                      }}
                      variant="outlined"
                      sx={{
                        px: 4,
                        py: 1,
                        borderRadius: 2,
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        },
                      }}
                    >
                      Cancel
                    </Button>

                    <DrogaButton
                      title={
                        submitting ? (
                          <ActivityIndicator
                            size={18}
                            sx={{ color: 'white' }}
                          />
                        ) : (
                          'Create Role'
                        )
                      }
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        px: 4,
                        py: 1,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                        },
                      }}
                      disabled={submitting}
                    />
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddRole;
