import 'bootstrap/dist/js/bootstrap.bundle';
import React, { useContext, useEffect } from 'react';
import { set_cookie } from '../../Reusable/Cookie.js';
import { UserContext } from '../../Reusable/UserContext.js';
import Form from '../Form.js';
import { handleGeneralNotificationsData ,setupGeneralNotificationsMenu,
getFirstGeneralNotificationsPage,
updateGeneralNotificationDiv} from './general_notification_fxn.js';
import './Header.css';
import { build_promise } from './../../Reusable/Async_await/Promise';

// Id of the notification span: id_general_notifications_container
// Used to set up the notificatino websocket 
export const Header =()=> {

	var notificationSocket
	const { authUser } = useContext(UserContext)

var span1,span2




	/*
	This will always fire first. 
		Retrieve the first page of notifications.
		Called when page loads.
	*/
	function getFirstGeneralNotificationsPage(){
		// console.log("the notification sent");
		if("{{request.user.is_authenticated}}"){
			notificationSocket.send(JSON.stringify({
				"command": "get_general_notifications",
				"page_number": "1",
			}));
		}
	}


useEffect(() => {
	setupChatDropdownHeader()
	console.log(authUser.isAuthenticated);
	setup_notification_socket()
})
return (

	// Conditinoal rendering here 
	// <!-- Header -->
	<div className="d-flex flex-column flex-lg-row p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">

		{/* <!-- MEDIUM+ SCREENS --> */}
		<div className="d-none d-sm-flex flex-row my-auto flex-grow-1 align-items-center">
			<h5 className="mr-3 font-weight-normal justify-content-start">
				<a className="p-2 text-dark" href="{% url 'home' %}">Home</a>
			</h5>
			<form className="search-bar justify-content-start" onSubmit={executeQuery}>
				<input type="text" className="form-control" name="q" id="id_q_large" placeholder="Search..." />
			</form>

			<div className="d-flex flex-row-reverse flex-grow-1">
				<nav className="">


					{/* Conditinoal rendering here  */}
					{(authUser.isAuthenticated) ?
						<div className="dropdown dropleft show p-2">
						<div className="d-flex flex-row">

								<div className="btn-group dropleft">
									<div className="d-flex notifications-icon-container rounded-circle align-items-center mr-3" id="id_chat_notification_dropdown_toggle" data-toggle="dropdown">
										<span id="id_chat_notifications_count" className="notify-badge"></span>
										<span className="d-flex material-icons notifications-material-icon m-auto align-items-center">chat</span>
										<div className="dropdown-menu scrollable-menu" aria-labelledby="id_chat_notification_dropdown_toggle" id="id_chat_notifications_container">
										</div>
									</div>
								</div>

								<div className="btn-group dropleft">
									<div className="d-flex notifications-icon-container rounded-circle align-items-center mr-3" id="id_notification_dropdown_toggle" data-toggle="dropdown"
									//  onClick={setGeneralNotificationsAsRead}
									 >
										<span id="id_general_notifications_count" className="notify-badge"></span>
										<span className="d-flex material-icons notifications-material-icon m-auto align-items-center">notifications</span>
										<div className="dropdown-menu scrollable-menu" aria-labelledby="id_notification_dropdown_toggle" id="id_general_notifications_container">
										</div>
									</div>
								</div>

								<div className="btn-group dropleft">
									<img className="account-image rounded-circle m-auto d-block dropdown-toggle" id="id_profile_links" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" src="{{request.user.profile_image.url}}"
										alt="codingwithmitch logo" width="40" height="40" />
									<div className="dropdown-menu" aria-labelledby="id_profile_links">
										<a className="dropdown-item" href="{% url 'account:view' user_id=request.user.id %}">Account</a>
										<a className="dropdown-item" href="{% url 'logout' %}">Logout</a>
									</div>
								</div>
							</div>

						</div>
						: <div>
							<a className="p-2 text-dark" href="{% url 'login' %}">Login</a>
							<a className="btn btn-outline-primary" href="{% url 'register' %}">Register</a>
						</div>
					}
				</nav>
			</div>
		</div>
		{/* // <!-- END MEDIUM+ SCREENS --> */}

		{/* // <!-- SMALL SCREENS --> */}
		<div className="d-flex d-sm-none flex-column my-auto align-items-center">
			<h5 className="font-weight-normal">
				<a className="p-2 text-dark" href="{% url 'home' %}">Home</a>
			</h5>
			<form className="search-bar justify-content-start" onSubmit={executeQuery}>
				<input type="text" className="form-control" name="q" id="id_q_small" placeholder="Search..." />
			</form>
			<div className="d-flex flex-row-reverse flex-grow-1">
				<nav className="">
					{(authUser.isAuthenticated) ?
						<div className="dropdown dropleft p-2 mt-2">
							<div className="d-flex flex-row">
								<div className="btn-group dropleft">
									<img className="account-image rounded-circle m-auto d-block dropdown-toggle" id="id_profile_links" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
										src="{{request.user.profile_image.url}}" alt="codingwithmitch logo" width="40" height="40" />
									<div className="dropdown-menu" aria-labelledby="id_profile_links">
										<a className="dropdown-item" href="{% url 'account:view' user_id=request.user.id %}">Account</a>
									</div>
								</div>
							</div>
						</div>
						:
						<div>
							<a className="p-2 text-dark" href="{% url 'login' %}">Login</a>
							<a className="btn btn-outline-primary m-2" href="{% url 'register' %}">Register</a>
						</div>}
				</nav>
			</div>
		</div>
		{/* <!-- END SMALL SCREENS --> */}
	</div>

)
function executeQuery() {
	var query = ""
	query = document.getElementById('id_q_small').value;
	if (query == ""){
		query = document.getElementById('id_q_large').value;
	}
	window.location.replace("{% url 'search' %}?q=" + query)
	return false
}



	/*

	/*
		Add a header to the dropdown so users can visit /chat/
	*/
	function setupChatDropdownHeader(){
		var notificationContainer = document.getElementById("id_chat_notifications_container")

		if(notificationContainer != null){

			var div = document.createElement("div")
			div.classList.add("chat-dropdown-header", "d-flex", "flex-row", "justify-content-end", "m-auto", "align-items-end")
			div.addEventListener("click", function(e){
				var url = "{% url 'chat:private-chat-room' %}"
				chatRedirect(url)
			})

			span1 = document.createElement("span")
			span1.classList.add("mr-2")
			span1.innerHTML = "Go to chat"
			div.appendChild(span1)

			span2 = document.createElement("span")
			span2.classList.add("material-icons", "mr-2")
			span2.innerHTML = "open_with"
			div.appendChild(span2)
			notificationContainer.appendChild(div)
		}
	}

	function chatRedirect(url){
		window.location.href = url
	}

 function setup_cookie_in_socket() {
// Need this line to authenticate the user
document.cookie = ""
	
// Expire the previous authorization cookie
document.cookie = "authorization= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
var user_token = sessionStorage.getItem("token")
console.log("the user token is ", user_token);

// private_path is the path of the cookie
document.cookie = set_cookie("authorization", "", user_token, 1)
		

	
	}

};


// Exportting fxns and the component here 
// export {sendAcceptFriendRequestToSocket, sendDeclineFriendRequestToSocket}
export default Header;