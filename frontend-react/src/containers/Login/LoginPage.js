import React, { useContext, useEffect } from "react";

import axios from "axios";
import { useHistory, withRouter } from "react-router-dom";


import { UserContext } from "../../Reusable/UserContext";
import { errorToast, makeToast } from "../../Toaster";
import { getCookie } from "../../Reusable/Utilities/Util";

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
        
        console.log('the value is ',authUser.isAuthenticated);
        sessionStorage.setItem("token", res.data.token);
        console.log(sessionStorage.getItem("token"));
        console.log('the user id is then ', res.data.userId);
        sessionStorage.setItem("auth_userId",res.data.userId )
        // history.push("/updateAccount")
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

    <div className="card">
      <div className="cardHeader">Login</div>
      <div className="cardBody">
        <form onSubmit = {loginUser}>
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="abc@example.com"
            ref={emailRef}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            ref={passwordRef}
          />
        </div>

        <div style={{ flex: 1 }}>
          <input id="submit" className="btn btn-warning" type="submit" name="Add" />
        </div>
        </form>
      </div>
    </div>
  );
};

export default withRouter(LoginPage);
