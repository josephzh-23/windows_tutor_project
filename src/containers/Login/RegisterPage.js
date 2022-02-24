import React from "react";
import axios from "axios";



import {useHistory, Link} from 'react-router-dom'


import { makeToast } from "../../Toaster";
import { getCookie } from "../../Reusable_Vanilla/Utilities/Util";
const RegisterPage = (props) => {
  const history = useHistory();
  const nameRef = React.createRef();
  const emailRef = React.createRef();
  const passwordRef = React.createRef();
  const password2Ref = React.createRef();
  const roleRef = React.createRef();



  const registerUser = (e) => {


  
    // axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    // axios.defaults.xsrfCookieName = "csrftoken";

    e.preventDefault()
    var csrfToken = getCookie('csrftoken')
    
    const username = nameRef.current.value;
    const password2 = password2Ref.current.value;
    const email = emailRef.current.value;
    const password1 = passwordRef.current.value;
    const role  = roleRef.current.value;

    console.log('the role value is ', role)
    axios(
       {
        method: 'POST',
      url: "http://127.0.0.1:8000/accounts/signup/",
      data:{
        username,
        email,
        password1,
        password2,
        role
      },
        headers: {
          'Content-type':'application/json',
          'X-CSRFToken': csrfToken
        }
       })
      .then(res => {
        if(res.data.error){
          makeToast("error", res.data.error)
        }else{
        makeToast("success", res.data.message);
        console.log(res.data);
        console.log(res.data.email);
        sessionStorage.setItem("token", res.data.token)
        
        // THen direct user right here
        history.push(`/profile?userId=${res.data.userId}`, { from: "RegisterPage" })
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
    <div className="login-container p-5 rounded mx-auto my-5">
      <h3 className="mb-4">Sign up</h3>
      <form onSubmit = {registerUser}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="username"
            id="name"
            placeholder="John Doe"
            className="form-control"
            ref={nameRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="abc@example.com"
            className="form-control"
            ref={emailRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password1"
            id="password"
            placeholder="Your Password"
            className="form-control"
            ref={passwordRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password2</label>
          <input
            type="password"
            name="password2"
            id="password2"
            placeholder="Confirm Password"
            className="form-control"
            ref={password2Ref}
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Are you a student or tutor </label>
          <select  ref={roleRef} id="role" className="form-select">
            <option value="tutor">Tutor</option>
            <option value="student">Student</option>
          </select> 
        </div>
        <input id="submit" className="btn btn-primary btn-block" type="submit" name="Add" value="Sign up" />
      </form>
      <div className="mt-4">
        <span>You already have an account? </span>
        <Link to="/login" className="link-primary text-decoration-none">Log in</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
