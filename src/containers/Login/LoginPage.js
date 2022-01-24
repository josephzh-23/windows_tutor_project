import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import { Link, useHistory, withRouter } from "react-router-dom";


import { UserContext } from "../../Reusable_React/UserContext";
import { errorToast, makeToast } from "../../Toaster";
import { getCookie } from "../../Reusable_Vanilla/Utilities/Util";

const LoginPage = (props) => {

  const {authUser, setUser} = useContext(UserContext)
  let history = useHistory()
  // Create a react context here 
  const emailRef = React.createRef();
  const passwordRef = React.createRef();


  useEffect(()=>{

    console.log(authUser);
  },[])
  const loginUser = (e) => {



    e.preventDefault()
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    var csrfToken = getCookie('csrftoken')
    axios({
    method: 'POST',
      url: "http://127.0.0.1:8000/accounts/login/",
      data:{
        email,
        password
      },
        headers: {
          'Content-type':'application/json',
          'X-CSRFToken': csrfToken
        }
       })
      .then((res) => {

        console.log(res);
        //In case of error
        if (res.data.password) {
          console.log(res.data.password[0])
          // makeToast("error", res.data.password[0])
          errorToast(res.data.password[0])
        } else {
        
        
    
        makeToast("success", "Logged in successfully")

        setUser({...authUser, isAuthenticated:true})
        setUser({...authUser, userId: res.data.userId})
        
        setUser({...authUser, username: res.data.username })
        console.log('the username is ',authUser.username);



          init_auth_user(res)
     
          
        history.push(`/admin/profile?userId=${res.data.userId}`, {from: "LoginPage"})

        // setTimeout(()=>{
        // window.location.reload();
        // },2000)
        }
      })
      .catch((err) => {
        // console.log(err);
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      });
  };

  return (
    <div className="login-container py-5 m-auto">
      <h3 className="mb-4">Log in</h3>
      <form onSubmit = {loginUser}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email address"
            className="form-control"
            ref={emailRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="form-control"
            ref={passwordRef}
          />
        </div>
        <input id="submit" className="btn btn-primary btn-block" type="submit" name="Add" value="Log in" />
      </form>
      <div className="mt-4 d-flex flex-column">
        <span>Don't have an account?</span>
        <Link to="/register" className="link-primary text-decoration-none">Sign up</Link>
      </div>
      <div className="mt-2"><Link to="/reset_password" className="link-unstyled">Forgot password?</Link></div>
    </div>
  );

  function init_auth_user(res){
    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("username", res.data.username);
    sessionStorage.setItem("isAuthenticated", true);

    sessionStorage.setItem("auth_userId",res.data.userId )

  }
};

export default withRouter(LoginPage);
