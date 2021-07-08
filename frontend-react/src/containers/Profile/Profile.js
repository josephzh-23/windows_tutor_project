
import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
// Will work on this page for now 
import axios from 'axios';
import "./Profile.css"
import { getQueryStrings } from '../../Reusable/Utilities/getQueryStrings.js';

import { makeToast } from "../../Toaster"
// import { makeToast } from "../../Toaster"
import {getCookie} from "../../getCookie"

import { backend_url_friend,frontend_url_account } from '../../Contants.js';
import { UserContext } from '../../Reusable/UserContext.js';
import { errorToast, successToast } from '../../Toaster.js';
// import { readURL } from '../../scripts/croppingEditor.js';

//Based on what's here 
const Profile = (props) => {

  // here id :is the id of the friend clicked on 
  var userId = getQueryStrings("userId")

  const [showFriendPanel, setShowFriendPanel] = useState(false)

  // Get the window query string

  //   const userId = match.params.id;

  const [data, setData] = React.useState({
    account: {
    },
    friendRequests: {},
    friends:{},
    isFriend: false,
    isSelf: true,
    friendRequestSent: -1,
  })

  React.useEffect(()=>{

    var userId = getQueryStrings("userId")
    console.log(sessionStorage.getItem("token"));
    // console.log('userid ' , userId);
    fetchUserProfile(userId)

  },[])





  // Get user id from the search params 
  const fetchUserProfile = (userId) => {

    // Make a get request instead
    axios.get(`http://127.0.0.1:8000/accounts/accountView?userId=${userId}`,{
      headers: {Authorization: `Token ${sessionStorage.getItem('token')}`
    }},{ data: {userId: userId }} ).then(
        res => {
        
          console.log(res);
         setShowFriendPanel(true)
         
          setData({ ...data, account: res.data.account,
             friendRequests: res.data.friendRequests ,
             isFriend: res.data.isFriend,
            isSelf: res.data.isSelf,
            friendRequestSent: res.data.requestSent,
          friends: res.data.friends})

         
    

        }).catch(err => {
          console.log(err)
        })

  }

  const removeFriend= (e,id) => {
    e.preventDefault()
    axios({
      method: 'POST',
      url: `${backend_url_friend}/removeFriend/`,
    data:{receiverUserId: userId},
    
    headers: {
      Authorization: "Token " + sessionStorage.getItem("token"),
       'Content-type':'application/json',
       'X-CSRFToken': props.user.csrfToken
    }
  })
    .then((res)=>{

        if(res.data.res){
          successToast(res.data.res)
  
        }else{
          errorToast(res.data.err)
        }
        console.log(res)
    })
  }




  // Friends section
  var showFriendSection = () => {

      // console.log(data)

    // if ((!data.isSelf) && (!data.isFriend)) {
  
      return(
      <div className="joseph">
     
     {/* A request has already been sent  */}
      {(data.friendRequestSent == 1) &&
        <div className="d-flex flex-column pt-4">
          <button className="btn btn-danger" id="id_cancel_friend_request_btn"
          onClick = {e=>{
            e.preventDefault()
            cancel_friend_request()
          }}>
            Cancel Friend Request
							</button>
        </div>}
          {console.log(data.friendRequestSent)}
         {/* WHen a request has not been sent  */}
      {(data.friendRequestSent == -1 && data.isSelf==false
      &&data.isFriend==false) &&
        <div className="d-flex flex-column  pt-4">
          <button className="btn btn-primary" id="id_send_friend_request_btn"
          onClick={(e)=>{sendFriendRequest(e, getQueryStrings('userId'))}}>
            Send Friend Request
							</button>
        </div>}


        {/* If this user is already a friend */}
     { (data.isFriend&&!data.isSelf) &&
        <div className="dropdown pt-4 m-auto">
          <button className="btn btn-secondary dropdown-toggle friends-btn" type="button" id="id_friends_toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Friends
						</button>
          <div className="dropdown-menu" aria-labelledby="id_friends_toggle">
            <a className="dropdown-item" href="#" 
            // id should be id of the person u r looking at 
            onClick = {e=>{removeFriend(e,userId)}}>Unfriend</a>
          </div>
        </div>
      }

{/* 
    // The list of friends */}
      <div className="d-flex">
        <a href="#" className="ee">
          <div className="d-flex">
            <span className="material-icons">contact page</span>
          </div>
        </a>
      </div>



      {/* // If sb is your friend, then you can message */}

        {(!data.isFriend&&!data.isSelf)&& 
        <div className="d-flex flex-row align-items-center btn btn-primary m-2 px-4" >
          <span className="material-icons m-auto">
            message
					</span>
          <span className="message-btn-text m-auto pl-2">Message</span>
        </div>
  }

      </div>
        
      )}
       






    // }

  

  var cancel_friend_request=()=>{

    axios({
      method: 'POST',
      url: `http://127.0.0.1:8000/friend/cancel_friend_request/`,
      data:{
        receiver_user_id: userId
      },
      headers: {
          Authorization: "Token " + sessionStorage.getItem("token"),
         'Content-type':'application/json',
         'X-CSRFToken': props.user.csrfToken
      }
       }).then((res)=>{

          console.log(res);
          if(res.data.res){


              //update ui
              successToast(res.data.res)    
              setData({...data,friendRequestSent:-1})
      
          }	
          else if(res.data.err !=null){
              errorToast(res.data.err)
              
          }
      }).catch((err) => {

          console.log(err);
          // alert('something went wrong ' + err)
      })
  }
// SHow the user profile based on user id
var showUserProfile = (data) => {

    sessionStorage.setItem('fRequests', JSON.stringify(data.friendRequests))

  return (

    <div className="container">
      
    
    <div className="row">
        <div className="col-sm-4 ">
          <div className="card">
            {/* Don't change this to profile-image for now */}
            <img className="profile-image" 
            src={`http://localhost:8000${data.account.profile_image}`}
              alt="Avatar" />
            <p className="mt-4 mb-1 field-heading thick">Username</p>

            <div>{data.account.username}</div>
            <p className="mt-4 mb-1 field-heading thick">User Email</p>
            <div>{data.account.email}</div>

          </div>
        </div>

        <div className="col-sm-4">

      {/* When you click friends  */}
          <div className="card d-flex flex-column pt-4">
            {/* If you clicked on stella */}
            <a href={`${frontend_url_account}/friend_list_view?userId=${userId}`}>
              <div className="d-flex flex-row align-items-center justify-content-center icon-container">
                <span className="material-icons mr-2 friends-icon">contact_page</span><span 
                className="friend-text">Friends ({data.friends.length})</span>
              </div>
            </a>
          </div>
      

      {/* // Show the # of friend requests if looking at your own profile //*/}
       {(data.friendRequests&&data.isSelf) &&
           <div className="card m-2 px-4 pb-4">
          <div className="d-flex flex-column pt-4">
            <a href={`${frontend_url_account}/friendRequests`}>
              <div className="d-flex flex-row align-items-center justify-content-center icon-container">
                <span className="material-icons mr-2 person-add-icon">person_add</span>
  
                <span className="friend-text">Friend Requests ({data.friendRequests.length})</span>
              </div>
            </a>
          </div>
          </div>
      }
      </div>
    
  
        
        <div className="col-sm-4">
            
          {(showFriendPanel)&&
          showFriendSection()
        } 

        </div>
      </div>
      </div>
  )
}


const sendFriendRequest =(e, receiverId, uiUpdateFunction)=>{

  e.preventDefault()
  var csrfToken = getCookie('csrftoken')


  console.log(csrfToken);
  axios({
      method: 'POST',
      url: "http://127.0.0.1:8000/friend/friendRequest/",
      data: receiverId,
      headers: {
          Authorization: "Token " + sessionStorage.getItem("token"),
         'Content-type':'application/json',
         'X-CSRFToken': csrfToken
      }
       }).then((res)=>{

          console.log(res);
          if(res.data.response == "Friend request sent."){

              //update ui 
              makeToast("success" , res.data.response)    
              setData({...data, friendRequestSent:1})
          }	
          else if(res.data.response !=null){
              alert(res.data.response)
              
          }
      }).catch((err) => {

          console.log(err);
          // alert('something went wrong ' + err)
      })
  
    
}
return (
  <div>

    <div className="joseph"></div>
    {showUserProfile(data)}

    </div>

)
}





export default Profile