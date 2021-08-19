
import logo from './logo.svg';
// import './App.css';

// export default App;
import React, { useContext, useState } from "react";
import { BrowserRouter, Switch, Route, Link, NavLink,useLocation } from "react-router-dom";
import DashboardPage from "./Pages/DashboardPage";
import IndexPage from "./Pages/IndexPage";
import ChatroomPage from "./Pages/ChatroomPage";
import makeToast from "./Toaster";
import { useHistory } from "react-router-dom";

// import SidePanel from "./containers/SidePanel.js";
import Profile from "./containers/Profile/Profile.js";
import Chat from "./containers/chat.js";

import FriendList from "./containers/FriendList.js"
import SearchFriends from "./containers/SearchFriends.js"
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
import PaymentForm from './containers/Payment/PaymentForm.js';
import StripeContainer from './containers/Payment/StripeContainer';
import Layout from './containers/Payment/Layout';






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
  const Top_section = () => {

    return (

      <header style={{ marginBottom: "20px" }}>

        {/* // Only show the following if authenticated is true  */}
        {/* {(sessionStorage.getItem('token')!=null)&& */}


        <div>

          <li><NavLink to="/">Home Page
          </NavLink>
          </li>

          <li><NavLink to="/search">Search the user here</NavLink></li>


          <li><NavLink to={`/profile?userId=${authUser.userId}`}>Check out my own profile </NavLink></li>
          <li><NavLink to="/register">Register the user </NavLink></li>

          <li><NavLink to="/public_chat">Public Chat Page </NavLink></li>

          <li><NavLink to="/UpdateAccount">Update the account (Only testing with
            user id 1)</NavLink></li>

          <li><NavLink to="/private_chat/">Private Chat</NavLink></li>
          <li><NavLink to="/create_posting/">Create Tutor Posting</NavLink></li>
          <li><NavLink to="/create_edit_schedule/">Create or Edit Tutor Schedule</NavLink></li>

          <li><NavLink to="/searchFilter/">Search Filtering</NavLink></li>

          <br />
          
          <li><NavLink to="/payment/">Create Payment</NavLink></li>


          <br />
          <br />
          <li><NavLink to="/login">Logging In</NavLink></li>
        </div>
        {/* } */}
      </header>
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
      <div className="user-name" style={{ color: "green" }}>
        <p className="mr-5"><b>LOGGED IN USER</b>: {authUser.username}</p>
      </div>
    )
  }


  // Switch makes sure only 1 component shown at any time. 
  return (
    <div >


      <div>
        <Header />
        {display_user()}

      </div>
      <BrowserRouter>

      var location = useLocation()
        <div>
          <ClientErrorModal />
          <Top_section />
        </div>
        <div>

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
            <Route path="/payment" component={Layout} title="Tutoring page" exact />

            <Route path="/create_edit_schedule" component={Create_Schedule}  exact />

            <Route path="/public_chat" component={Public_Chat} exact />
            <Route path="/account/friend_list_view"
              render={() => <FriendList user={authUser} />} exact />

          </Switch>
        </div>
      </BrowserRouter>

    </div>
  );


}

export default App;