
// export default App;
import React, { useContext } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

// import SidePanel from "./containers/SidePanel.js";
import Profile from "./containers/Profile/Profile.js";
import './App.css'
import FriendList from "./containers/FriendList.js"
import SearchFriends from "./containers/Search_Friends/SearchFriends.js"
import RegisterPage from './containers/Login/RegisterPage.js';
import LoginPage from './containers/Login/LoginPage.js';
import LostPasswordPage from './containers/Login/LostPasswordPage.js';
import UpdateAccount from './containers/UpdateAccount/UpdateAccount.js'
import { UserContext, UserContextProvider } from './Reusable_React/UserContext';
import { FriendRequests } from './containers/FriendRequests.js';
import { getCookie } from './Reusable_Vanilla/Utilities/Util';
import Public_Chat from './containers/Public_chat/Public_Chat.js';
import Private_Chat from './containers/Private_chat/Private_chat';
import Search_Posting from './containers/Search_Posting/Search_Posting.js';
import Create_Posting from './containers/CreatePosting/Create_Posting.js';
import Create_Schedule from './containers/CreateSchedule/Create_Schedule';

import { Create_Appointment } from './containers/Create_Appointment';
import CreatePayment from './containers/Payment/Create_Payment';

import Layout_Dashboard from "./containers/Layout/Layout_Dashboard.js";
import Layout_Frontpage from "./containers/Layout/Layout_Frontpage.js";

import HomePage from "./containers/FrontPages/Home.js";




// Wrap components with loginStateContext.
// So user can be shared between all components 
// value: all state we want to share between components
// export const UserContext = React.createContext()

function App() {
  var csrfToken = getCookie('csrftoken')

  // const [user, setUser] = useState(
  //   {csrfToken : csrfToken})
  const { authUser } = useContext(UserContext)

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/admin" render={({ match: { url } }) => (
          authUser.username ?
          <Layout_Dashboard>
            <Switch>
              <Route path={`${url}/search`} component={SearchFriends} />
              <Route path={`${url}/searchFilter`} component={Search_Posting} />
              <Route path={`${url}/private_chat`} component={Private_Chat} />
              <Route path={`${url}/profile`} render={() => <Profile user={authUser} />} exact />
              <Route path={`${url}/updateAccount`} component={UpdateAccount} exact />
              <Route path={`${url}/account/friendRequests`} component={FriendRequests} exact />
              <Route path={`${url}/create_posting`} component={Create_Posting} exact />
              <Route path={`${url}/payment`} component={CreatePayment} title="Tutoring page" exact />
              <Route path={`${url}/create_edit_schedule`} component={Create_Schedule}  exact />
              <Route path={`${url}/create_appointment`} component={Create_Appointment} exact />
              <Route path={`${url}/public_chat`} component={Public_Chat} exact />
              <Route path={`${url}/account/friend_list_view`} render={() => <FriendList user={authUser} />} exact />
            </Switch>
          </Layout_Dashboard>
          :
          <Redirect to="/login" />
        )} />

        <Route>
          <Layout_Frontpage>
            <Switch>
              <Route path="/" component={HomePage} exact />
              <Route path="/login" render={() => (
                authUser.username ?
                <Redirect to={`/admin/profile?userId=${authUser.userId}`} />
                :
                <LoginPage />
              )}/>
              <Route path="/register" render={() => (
                authUser.username ?
                <Redirect to={`/admin/profile?userId=${authUser.userId}`} />
                :
                <RegisterPage />
              )}/>
              <Route path="/reset_password" render={() => (
                authUser.username ?
                <Redirect to={`/admin/profile?userId=${authUser.userId}`} />
                :
                <LostPasswordPage />
              )}/>
              <Route path="/searchFilter" component={Search_Posting} />
            </Switch>
          </Layout_Frontpage>
        </Route>
      </Switch>
    </BrowserRouter>
  );


}

export default App;