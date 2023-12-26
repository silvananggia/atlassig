import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Checkbox, FormControlLabel } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import bpjsLogo from "../assets/images/bpjs-logo-color.svg";
import { fetchLogin, checkAuth } from "../actions/authActions";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { setLoading } from "../actions/loadingActions";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://bpjs-kesehatan.go.id/">
        BPJS Kesehatan
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

const Login = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const error = useSelector((state) => state.mapauth.error);

  const isAuthenticated = useSelector((state) => state.mapauth.isAuthenticated);
  const user = useSelector((state) => state.mapauth.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    dispatch(fetchLogin(email, password));
  };

  useEffect(() => {
    dispatch(checkAuth(email, password));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/mapfktp"); // Redirect to the home page or another appropriate page
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // If the user becomes authenticated after login, redirect to another page
    if (user && isAuthenticated) {
      if (user && user.data && user.data.token) {
        localStorage.setItem(
          "user",
          JSON.parse(JSON.stringify(user.data.email))
        );
        localStorage.setItem(
          "token",
          JSON.parse(JSON.stringify(user.data.token))
        );
      }

      navigate("/mapfktp");
    }
  }, [user, isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(setLoading(false));
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={bpjsLogo} alt="BPJS Logo" style={{ height: 32 }} />
          <br />
          <Typography component="h1" variant="h5">
            Masuk Ke Atlas-SIG
          </Typography>
          {error && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            </Stack>
          )}
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email" // Change from 'email' to 'username'
              name="email"
              autoComplete="email" // Change from 'email' to 'username'
              autoFocus
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="button" // Change from 'submit' to 'button'
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Masuk
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Login;
