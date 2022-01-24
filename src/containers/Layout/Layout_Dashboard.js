// export default App;
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import '../../App.css'
import { UserContext, UserContextProvider } from '../../Reusable_React/UserContext';
import { getCookie } from '../../Reusable_Vanilla/Utilities/Util';
import Header from '../Header/Header';
import ClientErrorModal from '../Public_chat/clientErrorModal';
import useComponentVisible from '../../Reusable_React/Custom_hook/useComponentVisible';

// Wrap components with loginStateContext.
// So user can be shared between all components 
// value: all state we want to share between components
// export const UserContext = React.createContext()

const Layout_Dashboard = ({children}) => {
  var csrfToken = getCookie('csrftoken')

  // const [user, setUser] = useState(
  //   {csrfToken : csrfToken})
  const { authUser } = useContext(UserContext)
  
  console.log(authUser.csrfToken);



  const DesktopNavMenu = () => {
    return (
      <div className="desktop-nav-menu-container d-none d-lg-flex flex-column justify-content-between">
        <div className="branding p-3"><NavLink to="/" className="link-unstyled">LOGO</NavLink></div>
        <div className="desktop-nav-menu p-3">
          {display_user()}
          <Top_section />
        </div>
      </div>
    )
  }

  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  const MobileNavMenu = () => {
    return (
      <div className="mobile-nav-menu-container d-flex d-lg-none" ref={ ref }>
        {display_user()}
        { !isComponentVisible ? 
          <div className="mobile-menu-btn" onClick={ () => setIsComponentVisible(true) }>
            <i className="fa fa-bars p-3 d-flex justify-content-center align-items-center"></i>
          </div> :
          <div className="mobile-menu-btn" onClick={ () => setIsComponentVisible(false) }>
            <i className="fa fa-times p-3 d-flex justify-content-center align-items-center"></i>
          </div>
        }
        { isComponentVisible && 
          <div className="mobile-nav-menu">
            <Top_section />
          </div>
        }
      </div>
    )
  }

  const Top_section = () => {

    return (
      <ul className="menu-list p-0">
        {/* // Only show the following if authenticated is true  */}
        {/* {(sessionStorage.getItem('token')!=null)&& */}

        <li><NavLink to="/admin/search" onClick={ () => setIsComponentVisible(false) }>Search the user here</NavLink></li>
        <li><NavLink to={`/admin/profile?userId=${authUser.userId}`} onClick={ () => setIsComponentVisible(false) }>Check out my own profile </NavLink></li>
        <li><NavLink to="/admin/public_chat" onClick={ () => setIsComponentVisible(false) }>Public Chat Page </NavLink></li>
        <li><NavLink to="/admin/UpdateAccount" onClick={ () => setIsComponentVisible(false) }>Update the account (Only testing with user id 1)</NavLink></li>
        <li><NavLink to="/admin/private_chat/" onClick={ () => setIsComponentVisible(false) }>Private Chat</NavLink></li>
        <li><NavLink to="/admin/create_posting/" onClick={ () => setIsComponentVisible(false) }>Create Tutor Posting</NavLink></li>
        <li><NavLink to="/admin/create_edit_schedule/" onClick={ () => setIsComponentVisible(false) }>Create or Edit Tutor Schedule</NavLink></li>
        <li><NavLink to="/admin/searchFilter/" onClick={ () => setIsComponentVisible(false) }>Search Tutor postings</NavLink></li>
        <li><NavLink to="/admin/payment/" onClick={ () => setIsComponentVisible(false) }>Create Payment</NavLink></li>
        <li><NavLink to="/admin/create_appointment/" onClick={ () => setIsComponentVisible(false) }>Create Tutor Appointment</NavLink></li>
        
        {/* } */}
      </ul>
    )
  }

  React.useEffect(() => {

    const scriptTag = document.createElement('script');


    scriptTag.src = "../collections-master/collections.min.js";
    scriptTag.async = true;


    document.body.appendChild(scriptTag);
    console.log("the changed value is ", authUser.isAuthenticated);

    // The id stored when signed in 
    authUser.userId = sessionStorage.getItem("auth_userId")



    return () => {
      document.body.removeChild(scriptTag);
    }
  }, [authUser])



  /*
      Build a <p> for messages using markdown
      https://github.com/markdown-it/markdown-it
    */


  //Should change when there is a refresh
  const display_user = () => {

    return (
      <div className="user-name welcome-text">Welcome back, {authUser.username}</div>
    )
  }

  return (
    <div className="page">
      <div className="page-cover"></div>
      <div className="page-header">
        <Header />
      </div>
      <div className="left-sidebar">
        <ClientErrorModal />
        <DesktopNavMenu />
        <MobileNavMenu />
      </div>
      <div className="content bg-white">
        <div className="content-cover"></div>
        {children}
      </div>
    </div>
  );

}

export default Layout_Dashboard;