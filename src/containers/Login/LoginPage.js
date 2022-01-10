import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import { useHistory, withRouter } from "react-router-dom";


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
     
          
        history.push(`/profile?userId=${res.data.userId}`, {from: "LoginPage"})

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

  const resetPassword = (e) => {
    e.preventDefault();
    alert('should send a email to user.');
  }
  const {isLostPassword, setIsLostPassword} = useState(false);

  return (
    <div className="login-container py-3 m-auto">
      <h3>{ !isLostPassword ? "Log in" : "Reset my password" }</h3>
      { !isLostPassword ? 
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
      :
      <form onSubmit = {resetPassword}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email address"
            className="form-control"
          />
        </div>
        <input id="submit" className="btn btn-primary btn-block" type="submit" name="Add" value="Send" />
      </form> }
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
