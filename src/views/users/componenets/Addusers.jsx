import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import DrogaFormModal from 'ui-component/modal/DrogaFormModal';

const AddUser = ({ add, isAdding, roles, units, onClose, onSubmit }) => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    roles: [],
    units: [],
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleRoleChange = (event) => {
    const selectedRoles = event.target.value;
    setUserDetails({ ...userDetails, roles: selectedRoles });
  };

  const handleUnitChange = (event) => {
    const selectedUnits = event.target.value;
    setUserDetails({ ...userDetails, units: selectedUnits });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { name, email, password, confirmPassword } = userDetails;

    if (!email || !name || !password || !confirmPassword) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    onSubmit(userDetails);
  };

  return (
    <DrogaFormModal
      open={add}
      title="Add User"
      handleClose={onClose}
      onCancel={onClose}
      onSubmit={handleSubmit}
      submitting={isAdding}
    >
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={userDetails.name}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        value={userDetails.email}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Phone"
        name="phone"
        value={userDetails.phone}
        onChange={handleChange}
        margin="normal"
      />

      {/* Roles */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Roles</InputLabel>
        <Select
          label="Roles"
          multiple
          value={userDetails.roles}
          onChange={handleRoleChange}
          renderValue={(selected) =>
            roles
              .filter((role) => selected.includes(role.uuid))
              .map((role) => role.name)
              .join(', ')
          }
        >
          {roles.map((role) => (
            <MenuItem key={role.uuid} value={role.uuid}>
              <ListItemText primary={role.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Units */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Units</InputLabel>
        <Select
          label="Units"
          multiple
          value={userDetails.units}
          onChange={handleUnitChange}
          renderValue={(selected) =>
            units
              .filter((unit) => selected.includes(unit.uuid))
              .map((unit) => unit.name)
              .join(', ')
          }
        >
          {units.map((unit) => (
            <MenuItem key={unit.uuid} value={unit.uuid}>
              <ListItemText primary={unit.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Password */}
      <TextField
        fullWidth
        type={showPassword ? 'text' : 'password'}
        label="Password"
        name="password"
        value={userDetails.password}
        onChange={handleChange}
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Confirm Password */}
      <TextField
        fullWidth
        type={showConfirmPassword ? 'text' : 'password'}
        label="Confirm Password"
        name="confirmPassword"
        value={userDetails.confirmPassword}
        onChange={handleChange}
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </DrogaFormModal>
  );
};

AddUser.propTypes = {
  add: PropTypes.bool.isRequired,
  isAdding: PropTypes.bool.isRequired,
  roles: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddUser;
