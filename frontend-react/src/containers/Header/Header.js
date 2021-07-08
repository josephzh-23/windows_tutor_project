
import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../Reusable/UserContext.js';
import Form from '../Form.js';
import { handleGeneralNotificationsData ,setupGeneralNotificationsMenu,
getFirstGeneralNotificationsPage} from './general_notification_fxn.js';


// Used to set up the notificatino websocket 
export const Header =()=> {
	const { auth_user } = useContext(UserContext)
	var setup_notification_socket = function(){
		// Correctly decide between ws:// and wss://
		var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
	// var ws_path = ws_scheme + '://' + window.location.host + ":8001/"; // PRODUCTION
	var ws_path = ws_scheme + '://' + window.location.host + "/";
	// console.log("Connecting to " + ws_path);
	var notificationSocket = new WebSocket(ws_path);


	// Handle incoming messages
	notificationSocket.onmessage = function (message) {
		console.log("Got notification websocket message.");
		var data = JSON.parse(message.data);

			/*
			GENERAL NOTIFICATIONS
		*/
		// new 'general' notifications data payload
		if(data.general_msg_type == 0){
			handleGeneralNotificationsData(data['notifications'], data['new_page_number'])
		}
	}

	notificationSocket.onclose = function (e) {
		console.error('Notification Socket closed unexpectedly');
	};

	notificationSocket.onopen = function (e) {
		console.log("Notification Socket on open: " + e)
	}

	notificationSocket.onerror = function (e) {
		console.log('Notification Socket error', e)
	}

	if (notificationSocket.readyState == WebSocket.OPEN) {
		console.log("Notification Socket OPEN complete.")

		setupGeneralNotificationsMenu()
		getFirstGeneralNotificationsPage()
	}
	else if (notificationSocket.readyState == WebSocket.CONNECTING) {
		console.log("Notification Socket connecting..")
	}

}


useEffect(() => {
	
	setup_notification_socket()
})
return (

	// Conditinoal rendering here 
	// <!-- Header -->
	<div class="d-flex flex-column flex-lg-row p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">

		{/* <!-- MEDIUM+ SCREENS --> */}
		<div class="d-none d-md-flex flex-row my-auto flex-grow-1 align-items-center">
			<h5 class="mr-3 font-weight-normal justify-content-start">
				<a class="p-2 text-dark" href="{% url 'home' %}">Home</a>
			</h5>
			<form class="search-bar justify-content-start" onsubmit="return executeQuery();">
				<input type="text" class="form-control" name="q" id="id_q_large" placeholder="Search..." />
			</form>

			<div class="d-flex flex-row-reverse flex-grow-1">
				<nav class="">


					{/* Conditinoal rendering here  */}
					{(auth_user.isAuthenticated) ?
						<div class="dropdown dropleft show p-2">
							<div class="d-flex flex-row">

								<div class="btn-group dropleft">
									<div class="d-flex notifications-icon-container rounded-circle align-items-center mr-3" id="id_chat_notification_dropdown_toggle" data-toggle="dropdown">
										<span id="id_chat_notifications_count" class="notify-badge"></span>
										<span class="d-flex material-icons notifications-material-icon m-auto align-items-center">chat</span>
										<div class="dropdown-menu scrollable-menu" aria-labelledby="id_chat_notification_dropdown_toggle" id="id_chat_notifications_container">
										</div>
									</div>
								</div>

								<div class="btn-group dropleft">
									<div class="d-flex notifications-icon-container rounded-circle align-items-center mr-3" id="id_notification_dropdown_toggle" data-toggle="dropdown" onclick="setGeneralNotificationsAsRead()">
										<span id="id_general_notifications_count" class="notify-badge"></span>
										<span class="d-flex material-icons notifications-material-icon m-auto align-items-center">notifications</span>
										<div class="dropdown-menu scrollable-menu" aria-labelledby="id_notification_dropdown_toggle" id="id_general_notifications_container">
										</div>
									</div>
								</div>

								<div class="btn-group dropleft">
									<img class="account-image rounded-circle m-auto d-block dropdown-toggle" id="id_profile_links" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" src="{{request.user.profile_image.url}}"
										alt="codingwithmitch logo" width="40" height="40" />
									<div class="dropdown-menu" aria-labelledby="id_profile_links">
										<a class="dropdown-item" href="{% url 'account:view' user_id=request.user.id %}">Account</a>
										<a class="dropdown-item" href="{% url 'logout' %}">Logout</a>
									</div>
								</div>
							</div>

						</div>
						: <div>
							<a class="p-2 text-dark" href="{% url 'login' %}">Login</a>
							<a class="btn btn-outline-primary" href="{% url 'register' %}">Register</a>
						</div>
					}
				</nav>
			</div>
		</div>
		{/* // <!-- END MEDIUM+ SCREENS --> */}

		{/* // <!-- SMALL SCREENS --> */}
		<div class="d-flex d-md-none flex-column my-auto align-items-center">
			<h5 class="font-weight-normal">
				<a class="p-2 text-dark" href="{% url 'home' %}">Home</a>
			</h5>
			<form class="search-bar justify-content-start" onsubmit="return executeQuery();">
				<input type="text" class="form-control" name="q" id="id_q_small" placeholder="Search..." />
			</form>
			<div class="d-flex flex-row-reverse flex-grow-1">
				<nav class="">
					{(auth_user.isAuthenticated) ?
						<div class="dropdown dropleft p-2 mt-2">
							<div class="d-flex flex-row">
								<div class="btn-group dropleft">
									<img class="account-image rounded-circle m-auto d-block dropdown-toggle" id="id_profile_links" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
										src="{{request.user.profile_image.url}}" alt="codingwithmitch logo" width="40" height="40" />
									<div class="dropdown-menu" aria-labelledby="id_profile_links">
										<a class="dropdown-item" href="{% url 'account:view' user_id=request.user.id %}">Account</a>
									</div>
								</div>
							</div>
						</div>
						:
						<div>
							<a class="p-2 text-dark" href="{% url 'login' %}">Login</a>
							<a class="btn btn-outline-primary m-2" href="{% url 'register' %}">Register</a>
						</div>}
				</nav>
			</div>
		</div>
		{/* <!-- END SMALL SCREENS --> */}
	</div>

)
};

export default Header;