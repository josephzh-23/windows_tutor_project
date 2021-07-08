import React from "react";
import axios from "axios";



import {useHistory} from 'react-router-dom'


import { makeToast } from "../../Toaster";
import { getCookie } from "../../Reusable/Utilities/Util";
const RegisterPage = (props) => {
  const history = useHistory();
  const nameRef = React.createRef();
  const emailRef = React.createRef();
  const passwordRef = React.createRef();
  const password2Ref = React.createRef();


  const registerUser = (e) => {
    // axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    // axios.defaults.xsrfCookieName = "csrftoken";

    e.preventDefault()
    var csrfToken = getCookie('csrftoken')
    
    const username = nameRef.current.value;
    const password2 = password2Ref.current.value;
    const email = emailRef.current.value;
    const password1 = passwordRef.current.value;

    axios(
       {
        method: 'POST',
      url: "http://127.0.0.1:8000/accounts/signup/",
      data:{
        username,
        email,
        password1,
        password2
      },
        headers: {
          'Content-type':'application/json',
          'X-CSRFToken': csrfToken
        }
       })
      .then(res => {
        makeToast("success", res.data.message);
        console.log(res.data);
        console.log(res.data.email);
        sessionStorage.setItem("token", res.data.token)
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
      <div className="cardHeader">Registration</div>
      <div className="cardBody">
        <form onSubmit = {registerUser}>
        <div className="inputGroup">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="username"
            id="name"
            placeholder="John Doe"
            ref={nameRef}
          />
          </div>
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
          name="password1"
          id="password"
          placeholder="Your Password"
          ref={passwordRef}
        />
        </div>
         <div className="inputGroup">
        <label htmlFor="password">Password2</label>
        <input
          type="password"
          name="password2"
          id="password2"
          placeholder="Confirm Password"
          ref={password2Ref}
        />
      </div>
      
      <div style={{flex: 1}}>
                            <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                          </div>
    </form>
    </div>
    </div>
   
  );
};

export default RegisterPage;
