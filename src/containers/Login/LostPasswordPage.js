import React, { useState } from "react";
import { Link } from "react-router-dom";

const LostPasswordPage = () => {
  const resetPassword = (e) => {
    e.preventDefault();
    alert('should send a email to this address: ' + email);
  }
  const [email, setEmail] = useState('');
  return (
    <div className="login-container py-5 m-auto">
      <h3 className="mb-4">Reset my password</h3>
      <p className="mb-5">To retrieve your password, please enter the e-mail address associated with your account below.</p>
      <form onSubmit = {resetPassword}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email address"
            className="form-control"
            onChange={ (e) => setEmail(e.target.value) }
          />
        </div>
        <input id="submit" className="btn btn-primary btn-block" type="submit" name="Add" value="Send" />
      </form>
      <div className="mt-4">
        <Link to="/login" className="link-unstyled d-flex align-items-center justify-content-center">
          <span className="material-icons">chevron_left</span>
          Return to Log in
        </Link>
      </div>
    </div>
  )
};

export default LostPasswordPage;
