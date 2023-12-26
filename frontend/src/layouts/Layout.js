import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MedicationIcon from "@mui/icons-material/Medication";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Swal from "sweetalert2";
import bpjsLogo from "../assets/images/bpjs_logo.svg";
import AccountCircle from "@mui/icons-material/AccountCircle";

import { logout } from "../actions/authActions";

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({ children }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [auth, setAuth] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const location = useLocation();

  const isAuthenticated = useSelector((state) => state.mapauth.isAuthenticated);
  const user = useSelector((state) => state.mapauth.user);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    Swal.fire({
      title: "Konfirmasi",
      text: "Yakin akan keluar dari Atlas-SIG?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate("/login");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User clicked "No, cancel!" or closed the modal
        return;
      }
    });
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
      text: "FKTP",
      icon: <MedicationIcon />,
      path: "/mapfktp",
      onClick: () => navigate("/mapfktp"),
    },
    {
      text: "FKRTL",
      icon: <LocalHospitalIcon />,
      path: "/mapfkrtl",
      onClick: () => navigate("/mapfkrtl"),
    },
    {
      text: "Statistik",
      icon: <AnalyticsIcon />,
      path: "/statistic",
      onClick: () => navigate("/statistic"),
    },
  ];

  const isActive = (path) => location.pathname === path;

  const HeaderAppBar = styled(AppBar)(({ theme }) => ({
    background: "linear-gradient(to right, #0F816F, #274C8B)",
  }));

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <HeaderAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
              setOpen(!open);
            }}
            edge="start"
          >
            <MenuIcon />
          </IconButton>

          <img src={bpjsLogo} alt="BPJS Logo" style={{ height: 24 }} />
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated && (
      <Typography size={12} noWrap sx={{ display: { xs: 'none', sm: 'block' }, color: 'white', marginLeft: 1}}>
        {user.data.nama}
      </Typography>
    )}
          {isAuthenticated && (
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
        {/* <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu> */}
      </div>
    )}

    {/* Display user's name next to the person icon */}

        </Toolbar>
      </HeaderAppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {itemsList.map((item, index) => {
            const { text, icon, path, onClick } = item;
            return (
              <ListItem
                button
                key={text}
                onClick={onClick}
                selected={isActive(path)}
                sx={{
                  "&.Mui-selected": {
                    background:
                      "linear-gradient(to right, rgba(15, 129, 111, 0.5), rgba(39, 76, 139, 0.7))", // Set your transparent linear gradient here
                  },
                }}
              >
                {icon && (
                  <ListItemIcon
                    sx={{ color: isActive(path) ? "white" : "inherit" }}
                  >
                    {icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={text}
                  sx={{ color: isActive(path) ? "white" : "inherit" }}
                />
              </ListItem>
            );
          })}
        </List>

        {/* Bottom Logout button */}
        <List sx={{ position: "absolute", bottom: 0, width: "100%" }}>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
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
