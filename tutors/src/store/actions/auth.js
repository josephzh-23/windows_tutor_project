import axios from "axios";
import * as actionTypes from "./actionTypes";
import { HOST_URL } from "../../settings";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (username, token) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    username: username
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {

    setTimeout(() => {
      logout()
    }, expirationTime * 1000);

};

export const authLogin = (username, password) => {
  
    authStart();
    axios
      .post(`${HOST_URL}/rest-auth/login/`, {
        username: username,
        password: password
      })
      .then(res => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("expirationDate", expirationDate);
        authSuccess(username, token);
        checkAuthTimeout(3600);
      })
      .catch(err => {
        authFail(err);
      });

};

export const authSignup = (username, email, password1, password2) => {
 
    authStart();
    axios
      .post(`${HOST_URL}/rest-auth/registration/`, {
        username: username,
        email: email,
        password1: password1,
        password2: password2
      })
      .then(res => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("expirationDate", expirationDate);
       authSuccess(username, token);
        checkAuthTimeout(3600);
      })
      .catch(err => {
        authFail(err);
      });
};

export const authCheckState = () => {
 
    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("username");
    if (token === undefined) {
     logout();
    } else {
      const expirationDate = new Date(sessionStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        logout();
      } else {
        authSuccess(username, token);
        
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
        
        );
      }
    }
};
