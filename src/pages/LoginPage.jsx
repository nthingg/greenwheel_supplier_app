import React, { useEffect, useState } from "react";
import "../assets/scss/login.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../services/mutations";
import { useMutation } from "@apollo/client";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authorize, { data, loading, error }] = useMutation(LOGIN);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!loading && !error && data && data.authorize) {
      const newToken = data.authorize.accessToken;
      const decoded = jwtDecode(newToken);
      console.log(
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      );
      localStorage.setItem(
        "role",
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      );
      localStorage.setItem("token", data.authorize.accessToken);
      localStorage.setItem("checkIsUserCall", "no");
      navigate("/");
      navigate(0);
    }
  }, [data, loading, error]);

  function login(e) {
    e.preventDefault();
    authorize({
      variables: {
        input: {
          email: email,
          password: password,
        },
      },
    });
  }
  return (
    <div className="app">
      <div className="container-fluid ps-md-0">
        <div className="row g-0">
          <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
          <div className="col-md-8 col-lg-6">
            <div className="login d-flex align-items-center py-5">
              <div className="container">
                <div className="row">
                  <div className="col-md-9 col-lg-8 mx-auto">
                    <h3 className="login-heading mb-4">Chào mừng trở lại!</h3>

                    <form>
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className={"form-control "}
                          id="floatingInput"
                          name="email"
                          placeholder="name@example.com"
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                        <label htmlFor="floatingInput">Địa chỉ email</label>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className={"form-control "}
                          id="floatingPassword"
                          name="password"
                          placeholder="Password"
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                        />
                        <label htmlFor="floatingPassword">Mật khẩu</label>
                      </div>

                      <div className="d-grid">
                        <button
                          className="btn btn-lg btn-success btn-login text-uppercase fw-bold mb-2"
                          type="button"
                          onClick={login}
                        >
                          Đăng nhập
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
