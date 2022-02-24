// export default App;
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import '../../App.css'
import { UserContext, UserContextProvider } from '../../Reusable_React/UserContext';
import { getCookie } from '../../Reusable_Vanilla/Utilities/Util';
import Header from '../Header/Header';
import ClientErrorModal from '../Public_chat/clientErrorModal';
import useComponentVisible from '../../Reusable_React/Custom_hook/useComponentVisible';

const Layout_Frontpage = ({children}) => {

  const Header = () => {
    return (
      <nav className="navbar navbar-expand-lg navbar-light border-bottom">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">LOGO</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">LOGO</h5>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body align-items-center">
              <ul className="navbar-nav justify-content-end flex-grow-1">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/about">About</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/searchFilter">Search</NavLink>
                </li>
              </ul>
              <NavLink className="btn btn-sm btn-primary mt-2 mx-lg-2 mt-lg-0" to="/register">Sign up</NavLink>
              <NavLink className="btn btn-sm btn-outline-primary mt-3 ml-lg-2 mt-lg-0" to="/login">Log in</NavLink>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  const Footer = () => {
    return (
      <div className="">Footer</div>
    )
  }

  return (
    <div className="front-page d-flex flex-column">
      <Header />
      <main className="mb-auto">
        {children}
      </main>
      <Footer />
    </div>
  );

}

export default Layout_Frontpage;