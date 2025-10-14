// material-ui
// import logo from 'assets/images/droga.svg';
// import iconLogo from 'assets/images/logo-icon.svg';

import logo from 'assets/images/droga.svg';
import iconLogo from 'assets/images/droga.svg';

// ==============================|| LOGO ||============================== //

const Logo = () => {
  return <img src={logo} alt="Droga PMS" width="140px" height="60px" />;
};

export const IconLogo = () => {
  return <img src={iconLogo} alt="Logo" width="100px" height="40px" />;
};

export default Logo;
