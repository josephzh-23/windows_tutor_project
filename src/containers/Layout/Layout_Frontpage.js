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
      <footer className="text-center text-lg-start bg-dark text-white mt-5">
        <section className="">
          <div className="container text-center text-lg-start mt-5 py-4">
            <div className="row">
              <div className="col-lg-4 col-xl-3 col-xxl-3 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                <i class="fas fa-graduation-cap me-3"></i>Company name
                </h6>
                <p>
                  Here you can use rows and columns to organize your footer content. Lorem ipsum
                  dolor sit amet, consectetur adipisicing elit.
                </p>
              </div>

              <div className="col-lg-2 col-xl-1 col-xxl-1 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  Links
                </h6>
                <p>
                  <NavLink className="text-reset" to="/about">About</NavLink>
                </p>
                <p>
                  <NavLink className="text-reset" to="/searchFilter">Search</NavLink>
                </p>
              </div>

              <div className="col-lg-2 col-xl-2 col-xxl-1 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  Help
                </h6>
                <p>
                  <NavLink className="text-reset" to="/help-centre">Help Centre</NavLink>
                </p>
                <p>
                  <NavLink className="text-reset" to="/contact">Contact</NavLink>
                </p>
              </div>

              <div className="col-lg-2 col-xl-2 col-xxl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  Follow Us
                </h6>
                <p>
                  <a href="#" className="me-4 text-reset">
                    <i className="fab fa-facebook-f fa-lg"></i>
                  </a>
                  <a href="#" className="me-4 text-reset">
                    <i className="fab fa-instagram fa-lg"></i>
                  </a>
                  <a href="https://github.com/josephzh-23/windows_tutor_project/tree/mac" target="_blank" className="text-reset">
                    <i className="fab fa-github fa-lg"></i>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}>
          © 2022 Copyright: <NavLink className="text-reset fw-bold" to="/">Company Name</NavLink>
        </div>
      </footer>
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