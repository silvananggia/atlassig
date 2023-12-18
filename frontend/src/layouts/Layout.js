import * as React from 'react';
import { Outlet, useNavigate , useLocation} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import bpjsLogo from '../assets/images/bpjs_logo.svg'; 
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { logout } from "../actions/authActions";

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);




export default function MiniDrawer({ children }) {
  const theme = useTheme();
  const dispatch = useDispatch();
    let navigate = useNavigate();
  const [auth, setAuth] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const location = useLocation();
  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

    const isAuthenticated = useSelector((state) => state.mapauth.isAuthenticated);

    // Redirect to login if not authenticated
    React.useEffect(() => {
      if (!isAuthenticated) {
        navigate("/login");
      }
    }, [isAuthenticated, navigate]);
  

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout =()=>{
dispatch(logout());

  navigate("/login");

  };



  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };



const itemsList = [
  {
    text: 'FKTP',
    icon: <BrandingWatermarkIcon />,
    onClick: () => navigate('/mapfktp'),
  },
  {
    text: 'FKRTL',
    icon: <BrandingWatermarkIcon />,
    onClick: () => navigate('/mapfkrtl'),
  },
  {
    text: 'Statistik',
    icon: <AnalyticsIcon />,
    onClick: () => navigate('/statistic'),
  },
  
  ];

  const isActive = (path) => location.pathname === path;

  const HeaderAppBar = styled(AppBar)(({ theme }) => ({
    background: 'linear-gradient(to right, #0F816F, #274C8B)',
  }));
  
  return (
    <Box sx={{ display: 'flex', height:'100vh' }}>
      <CssBaseline />
      <HeaderAppBar position="fixed"  >
        <Toolbar >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={()=>{setOpen(!open)}}
            edge="start"
            
          >
            <MenuIcon />
          </IconButton>

          <img src={bpjsLogo} alt="BPJS Logo" style={{ height: 24 }} />
          <Box sx={{ flexGrow: 1 }} />
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
               <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right', // Set the horizontal origin to 'right'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right', // Set the horizontal origin to 'right'
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </HeaderAppBar>


      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        {itemsList.map((item, index) => {
      const { text, icon,path, onClick } = item;
      return (
        <ListItem button key={text} onClick={onClick} selected={isActive(path)}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText primary={text} />
        </ListItem>
      );
    })}
          
        </List>
        
      </Drawer>
      <Box component="main" sx={{ flex: 1 }}>
        <DrawerHeader />
        <main>
          {children}
          <Outlet />
        </main>
      </Box>
    </Box>
  );
}