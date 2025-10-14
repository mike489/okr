import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

// project imports
import AuthWrapper from './components/AuthWrapper';
import AuthCardWrapper from './components/AuthCardWrapper';
import AuthLogin from './components/auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import { Link } from 'react-router-dom';
import Copyright from './components/copyright';
import BG from '../../assets/images/auth/ils1.svg';

// ================================|| AUTH - LOGIN ||================================ //

const Login = () => {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: '100vh',
        // backgroundImage: 'url(/images/auth/ils1.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          height: '100vh',
          overflow: 'auto',
          py: downSM ? 1 : 3,
        }}
      >
        <Grid container sx={{ height: '100%' }}>
          {/* Left Side - Brand Section */}
          <Grid
            item
            xs={false}
            lg={6}
            sx={{
              display: { xs: 'none', lg: 'block' },
              flex: 1,
              overflow: 'hidden',
              fontSize: '40px',
              lineHeight: '48px',
              color: 'var(--mui-palette-text-secondary)',
              position: 'relative',
              zIndex: 1,
              backgroundColor: 'var(--mui-palette-background-default)',
            }}
          >
            <Box
              sx={{
                maxWidth: '520px',
                ps: 20,
              }}
            >
              <Link href="/" className="mb-2 inline-block">
                <Logo />
              </Link>
              <h4>
                Unlock your Project
                <span
                  style={{
                    color: 'var(--mui-palette-text-primary)',
                    fontWeight: 'bold',
                    marginLeft: '8px',
                  }}
                >
                  performance
                </span>
              </h4>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                bottom: { xs: -130, xl: -160 },
                height: '100%',
                width: '100%',
                zIndex: -1,
              }}
            >
              <Link to="/">
                <Box
                  component="img"
                  src={BG}
                  alt="Company Logo"
                  sx={{
                    maxWidth: 700,
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </Link>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', lg: 'flex-start' },
              py: { xs: 4, md: 8 },
            }}
          >
            <Paper
              elevation={8}
              sx={{
                width: '100%',
                maxWidth: 520,
                mx: { xs: 2, sm: 'auto', lg: '150px 0 0 auto' },
                p: { xs: 3, sm: 4, md: 6 },
                backgroundColor: 'background.paper',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Mobile Logo */}
              <Box
                sx={{
                  display: { xs: 'flex', lg: 'none' },
                  justifyContent: 'center',
                  mb: 4,
                }}
              >
                <Link to="/">
                  <Logo />
                </Link>
              </Box>

              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  Sign In
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 300,
                    mx: 'auto',
                  }}
                >
                  Sign in to your account to start using OKR
                </Typography>
              </Box>

              {/* Login Form */}
              <AuthLogin />

              {/* Divider with Text */}
              <Divider sx={{ my: 4, position: 'relative' }}>
                <Typography
                  variant="body2"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    px: 2,
                    backgroundColor: 'background.paper',
                    color: 'text.secondary',
                  }}
                >
                  {/* Or continue with */}
                  Welcome Back!
                </Typography>
              </Divider>

              {/* Footer Link */}
              <Box
                sx={{
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: downMD ? 'row' : 'column',
                  mt: 4,
                  color: 'text.secondary',
                }}
              >
                <Copyright />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
