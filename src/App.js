
import logo from './logo.svg';

// export default App;
import React, { useContext, useState } from "react";
import { BrowserRouter, Switch, Route, Link, NavLink,useLocation } from "react-router-dom";

import { useHistory } from "react-router-dom";

// import SidePanel from "./containers/SidePanel.js";
import Profile from "./containers/Profile/Profile.js";
import Chat from "./containers/chat.js";
import './App.css'
import FriendList from "./containers/FriendList.js"
import SearchFriends from "./containers/Search_Friends/SearchFriends.js"
import RegisterPage from './containers/Login/RegisterPage.js';
import LoginPage from './containers/Login/LoginPage.js';
import UpdateAccount from './containers/UpdateAccount/UpdateAccount.js'
import { UserContext, UserContextProvider } from './Reusable_React/UserContext';
import { FriendRequests } from './containers/FriendRequests.js';
import { getCookie } from './Reusable_Vanilla/Utilities/Util';
import Public_Chat from './containers/Public_chat/Public_Chat.js';
import Private_Chat from './containers/Private_chat/Private_chat';
import Header from './containers/Header/Header';
import ClientErrorModal from './containers/Public_chat/clientErrorModal';
import Search_Posting from './containers/Search_Posting/Search_Posting.js';
import Create_Posting from './containers/CreatePosting/Create_Posting.js';
import Create_Schedule from './containers/CreateSchedule/Create_Schedule';

import { Create_Appointment } from './containers/Create_Appointment';
import CreatePayment from './containers/Payment/Create_Payment';
import useComponentVisible from './Reusable_React/Custom_hook/useComponentVisible';






// Wrap components with loginStateContext.
// So user can be shared between all components 
// value: all state we want to share between components
// export const UserContext = React.createContext()

function App() {
  var csrfToken = getCookie('csrftoken')

  // const [user, setUser] = useState(
  //   {csrfToken : csrfToken})
  const { authUser } = useContext(UserContext)
  
  console.log(authUser.csrfToken);



  const DesktopNavMenu = () => {
    return (
      <div className="desktop-nav-menu-container d-none d-lg-flex flex-column justify-content-between">
        <div className="branding p-3">LOGO</div>
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

        <li><NavLink to="/" onClick={ () => setIsComponentVisible(false) }>Home Page</NavLink></li>
        <li><NavLink to="/search" onClick={ () => setIsComponentVisible(false) }>Search the user here</NavLink></li>
        <li><NavLink to={`/profile?userId=${authUser.userId}`} onClick={ () => setIsComponentVisible(false) }>Check out my own profile </NavLink></li>
        <li><NavLink to="/register" onClick={ () => setIsComponentVisible(false) }>Register the user </NavLink></li>
        <li><NavLink to="/public_chat" onClick={ () => setIsComponentVisible(false) }>Public Chat Page </NavLink></li>
        <li><NavLink to="/UpdateAccount" onClick={ () => setIsComponentVisible(false) }>Update the account (Only testing with user id 1)</NavLink></li>
        <li><NavLink to="/private_chat/" onClick={ () => setIsComponentVisible(false) }>Private Chat</NavLink></li>
        <li><NavLink to="/create_posting/" onClick={ () => setIsComponentVisible(false) }>Create Tutor Posting</NavLink></li>
        <li><NavLink to="/create_edit_schedule/" onClick={ () => setIsComponentVisible(false) }>Create or Edit Tutor Schedule</NavLink></li>
        <li><NavLink to="/searchFilter/" onClick={ () => setIsComponentVisible(false) }>Search Tutor postings</NavLink></li>
        <li><NavLink to="/payment/" onClick={ () => setIsComponentVisible(false) }>Create Payment</NavLink></li>
        <li><NavLink to="/create_appointment/" onClick={ () => setIsComponentVisible(false) }>Create Tutor Appointment</NavLink></li>
        <li><NavLink to="/login" onClick={ () => setIsComponentVisible(false) }>Logging In</NavLink></li>
        
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


  // Switch makes sure only 1 component shown at any time. 
  return (
    <div className="page">
      <div className="page-cover"></div>
      <div className="page-header">
        <Header />
      </div>
      <BrowserRouter>
        <div className="left-sidebar">
          <ClientErrorModal />
          <DesktopNavMenu />
          <MobileNavMenu />
        </div>
        <div className="content bg-white">
          <div className="content-cover"></div>
          <Switch>
            <Route path="/search/" >
              <SearchFriends />
            </Route>
            <Route path="/searchFilter/" >
              <Search_Posting />
            </Route>

            <Route path="/private_chat/" >
              <Private_Chat />
            </Route>
            <Route path="/register/" >
              <RegisterPage />
            </Route>

            <Route path="/profile" render={() => <Profile user={authUser} />} exact />
            <Route path="/updateAccount" component={UpdateAccount} exact />
            <Route path="/login" component={LoginPage} exact />
            <Route path="/account/friendRequests" component={FriendRequests} exact />

            <Route path="/create_posting" component={Create_Posting} exact />
            <Route path="/payment" component={CreatePayment} title="Tutoring page" exact />

            <Route path="/create_edit_schedule" component={Create_Schedule}  exact />
            <Route path="/create_appointment" component={Create_Appointment} exact />

            <Route path="/public_chat" component={Public_Chat} exact />
            <Route path="/account/friend_list_view" render={() => <FriendList user={authUser} />} exact />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );


}

export default App;