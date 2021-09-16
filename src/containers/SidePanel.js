import React, { useContext } from 'react';
// import { Spin} from 'antd';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import axios from 'axios';
import { Spinner} from 'react-bootstrap';
import * as navActions from "../store/actions/nav";
// import { Icon} from '@ant-design/compatible';
import Contact from '../Components/Contact.js';
import { UserContext } from '../Context/userContext.js';




//
const SidePanel = (props)=> {


    var isAuthenticated= false;
    //INheriting the context from the parent
   const {context, openAddChatPopup}= useContext(UserContext)
    
    var token = context.token
    var username = context.username 

    //Fetch chat of user based on usernsme

    // The local state containing the login form
    const [state, setState] = React.useState({loginForm: true,
    chats: [],
    });

    isAuthenticated = context.token;
    var loading = context.loading;
    // state = { 
    //     loginForm: true,
    // }

    // When the url changes this needs to change 
    React.useEffect(() => {
        
        
        console.log("the name value is" ,context.auth.username);
        context.name = "Maththew"
        setTimeout(function(){  
             console.log("the name value is" ,context.name); }, 3000);
        // Pass in a fake dummy data

        // use a manual token for now
        username = "josephzh"
        token = "0c57311ea6590142e62b89e3ca789315cbc91d83"
        // if(token!==null && username!==null){
            getUserChats(token, username)
        // }
      },[]);
    
    // All fxns for handling stuff
    const getUserChats = (token, username) => {
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        };

        axios.get(`http://127.0.0.1:8000/admin/chat/?name=${username}`)
        .then(res => {
            console.log(res.data);
            setState({
                chats: res.data
            });
        });
    }

   const changeForm = () => {
       setState({ loginForm: !state.loginForm });
    }
   
    const authenticate = (e) => {
        e.preventDefault();
        if (state.loginForm) {

            actions.authLogin(
                e.target.username.value, 
                e.target.password.value
            );
        } else {
            actions.authSignup(
                e.target.username.value, 
                e.target.email.value, 
                e.target.password.value, 
                e.target.password2.value
            );
        }
    }

    // The active chats based on what's passed in 
    const activeChats = state.chats.map(c => {
        return (
            <Contact 
                key={c.id}
                name="Harvey Specter" 
                picURL="http://emilcarlsson.se/assets/louislitt.png"
                status="busy"
                chatURL={`/${c.id}`} />
        )
    })
        return (


            
            
            <div id="sidepanel">
            <div id="profile">
                <div className="wrap">
                <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
                <p>Mike Ross</p>
                <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
                <div id="status-options">
                    <ul>
                    <li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
                    <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
                    <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
                    <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
                    </ul>
                </div>
                <div id="expanded">
                    {
                        loading ?

                        <Spinner  /> :

                        isAuthenticated ? 
                    
                        <button onClick={() => actions.logout()} className="authBtn"><span>Logout</span></button>
                        :
                        <div>
                            <form method="POST" onSubmit={authenticate}>
                                
                                {
                                   state.loginForm ?

                                    <div>
                                        <input name="username" type="text" placeholder="username" />
                                        <input name="password" type="password" placeholder="password" />
                                    </div>

                                    :

                                    <div>
                                        <input name="username" type="text" placeholder="username" />
                                        <input name="email" type="email" placeholder="email" />
                                        <input name="password" type="password" placeholder="password" />
                                        <input name="password2" type="password" placeholder="password confirm" />
                                    </div>
                                }
                                
                                <button type="submit">Authenticate</button>

                            </form>

                            <button onClick={changeForm}>Switch</button>
                        </div>
                    }
                </div>
                </div>
            </div>
            <div id="search">
                <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                <input type="text" placeholder="Search contacts..." />
            </div>
            <div id="contacts">
                <ul>

                    {activeChats}
                 
                </ul>
            </div>
            <div id="bottom-bar" onClick = {props.openModal}>
                <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add contact</span></button>
                <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button>
            </div>
            </div>
        );
    };

// Using mapstatetoprops:
//The component gets its info from the state
// const mapStateToProps = state => {
//     return {
//         isAuthenticated: state.token !== null,
//         loading: state.loading
//     }
// }



// let container pass function to component using wrapped component


export default SidePanel;