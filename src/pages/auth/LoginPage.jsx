import React, { useEffect, useState } from "react";
import "../../assets/scss/login.scss";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { LOGIN } from "../../services/graphql/auth";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  Snackbar,
  TextField,
  ThemeProvider,
  Typography,
  styled,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const LoginPage = () => {
  const navigate = useNavigate();
  const [vertical, setVertical] = useState("top");
  const [horizontal, setHorizontal] = useState("right");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMsg, setErrMsg] = useState(false);

  const handleClick = () => {
    setSnackbarOpen(true);
  };

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  const [authorize, { data, loading, error }] = useMutation(LOGIN);

  const login = async (e) => {
    try {
      const { data } = await authorize({
        variables: {
          input: {
            email: email,
            password: password,
          },
        },
      });
      console.log(data);
      const newToken = data["staffRequestAuthorize"]["accessToken"];
      const decoded = jwtDecode(newToken);

      if (decoded.provider_id) {
        localStorage.setItem("providerId", decoded.provider_id);
      } else {
        localStorage.setItem("staffId", decoded.id);
      }

      if (
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] === "ADMIN"
      ) {
        setErrMsg("Lỗi: Sai email đăng nhập hoặc mật khẩu");
        handleClick();
        localStorage.removeItem("errorMsg");

        return;
      }

      localStorage.setItem(
        "role",
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      );
      localStorage.setItem(
        "staffToken",
        data["staffRequestAuthorize"]["accessToken"]
      );
      localStorage.setItem(
        "refreshToken",
        data["staffRequestAuthorize"]["refreshToken"]
      );
      localStorage.setItem("checkIsUserCall", "no");

      navigate("/");
      navigate(0);
    } catch (error) {
      console.log(error);
      const msg = localStorage.getItem("errorMsg");
      setErrMsg(msg);
      handleClick();
      localStorage.removeItem("errorMsg");
    }
  };

  return (
    <div className="login">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#2c3d50" }}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h3" style={{ marginTop: 10 }}>
            BTSS Provider
          </Typography>
          <Typography component="h1" variant="h5" style={{ marginTop: 10 }}>
            Đăng nhập
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Địa chỉ email"
              name="email"
              autoComplete="email"
              autoFocus
              sx={{
                "& label.Mui-focused": {
                  color: "black",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "black",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "black",
                  },
                  "&:hover fieldset": {
                    borderColor: "black",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "black",
                  },
                },
              }}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              sx={{
                "& label.Mui-focused": {
                  color: "black",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "black",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "black",
                  },
                  "&:hover fieldset": {
                    borderColor: "black",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "black",
                  },
                },
              }}
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  login();
                }
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={login}
              style={{ backgroundColor: "#2c3d50" }}
            >
              Đăng nhập
            </Button>
          </Box>
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackbarOpen}
        onClose={handleClose}
        autoHideDuration={2000}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
