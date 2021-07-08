
import logo from './logo.svg';
import './App.css';

// export default App;
import React, { useContext, useState } from "react";
import { BrowserRouter, Switch, Route , Link,NavLink} from "react-router-dom";
import DashboardPage from "./Pages/DashboardPage";
import IndexPage from "./Pages/IndexPage";
import ChatroomPage from "./Pages/ChatroomPage";
import makeToast from "./Toaster";
import { useHistory } from "react-router-dom";


// import SidePanel from "./containers/SidePanel.js";
import Profile  from "./containers/Profile/Profile.js";
import Chat from "./containers/chat.js";

import FriendList from "./containers/FriendList.js"
import SearchFriends from "./containers/SearchFriends.js"
import RegisterPage from './containers/Login/RegisterPage.js';
import LoginPage from './containers/Login/LoginPage.js';
import UpdateAccount from './containers/UpdateAccount/UpdateAccount.js'
import { UserContext, UserContextProvider } from './Reusable/UserContext';
import { FriendRequests } from './containers/FriendRequests.js';
import { getCookie } from './Reusable/Utilities/Util';
import Home from './containers/Public_chat/Home.js';
import Private_Chat from './containers/Private_Chat/Private_Chat';
import Header from './containers/Header/Header';



 // Wrap components with loginStateContext.
 // So user can be shared between all components 
    // value: all state we want to share between components
    // export const UserContext = React.createContext()

function App() {


  var csrfToken =getCookie('csrftoken')

  // const [user, setUser] = useState(
  //   {csrfToken : csrfToken})
  const {authUser} = useContext(UserContext)

  console.log(authUser.csrfToken);
  const top_section = ()=>{
    
    return(    
 
    <header style={{ marginBottom:"20px"}}>

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
    <br/>
    <br/>
    <li><NavLink to="/login">Logging In</NavLink></li>
    </div>
   {/* } */}
   </header>
    )}

  React.useEffect(()=>{
    console.log("the changed value is ", authUser.isAuthenticated);
    authUser.userId =  sessionStorage.getItem("auth_userId")
  },[authUser])
  
/*
		Build a <p> for messages using markdown
		https://github.com/markdown-it/markdown-it
  */

	

  // Switch makes sure only 1 component shown at any time. 
  return (
    <div >
  
  <div>
      <top_section/>
      </div>

      <div>
      <Header/>
      </div>
    <BrowserRouter>
 
      <div>
            

            <Switch>
                    <Route path ="/search/" >
                      <SearchFriends/>
                    </Route>
                    <Route path ="/private_chat/" >
                      <Private_Chat/>
                    </Route>
                    <Route path ="/register/" >
                      <RegisterPage/>
                    </Route>


                <Route path="/profile" render={() => <Profile user={authUser} />} exact />
                <Route path="/updateAccount" component={UpdateAccount} exact />
                <Route path="/login" component={LoginPage} exact />
                <Route path="/account/friendRequests" component={FriendRequests} exact />
                

                <Route path="/public_chat" component ={Home} exact/>
                <Route path="/account/friend_list_view" 
                render= {()=><FriendList user={authUser} />}exact />
                
                    </Switch> 
                    </div>
                    </BrowserRouter>
                 
                    </div>
  );

  
}

export default App;