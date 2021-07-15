import 'bootstrap/dist/js/bootstrap.bundle';
import React, { useContext, useEffect } from 'react';
import { set_cookie } from '../../Reusable/Cookie.js';
import { UserContext } from '../../Reusable/UserContext.js';
import Form from '../Form.js';

import $ from '../../Reusable/Utilities/Util.js'
import { handleGeneralNotificationsData ,setupGeneralNotificationsMenu,
getFirstGeneralNotificationsPage,
updateGeneralNotificationDiv,
assignGeneralCardId,
createFriendListElement,
assignGeneralImgId,
assignGeneralNegActionId,
generalRedirect,
assignGeneralDiv1Id,
createGeneralProfileImageThumbnail,
assignGeneralVerbId,
assignGeneralDiv2Id,
assignGeneralPosActionId,
assignGeneralTimestampId} from './general_notification_fxn.js';
import './Header.css';
import { build_promise } from './../../Reusable/Async_await/Promise';
import { preloadImage } from '../../Reusable/Async_image_loader.js';

// Id of the notification span: id_general_notifications_container
// Used to set up the notificatino websocket 
export const Header =()=> {


	var $ = function( id ) { return document.getElementById( id ); };

	var notificationSocket
	const { authUser } = useContext(UserContext)

	var card, span, notificationContainer
var span1,span2

var updatedDiv
var card
var span
var img
var div2
var pos_action
var neg_action
var divs



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
									width="40" height="40" />
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
										src="{{request.user.profile_image.url}}" width="40" height="40" />
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



	

	async function setup_notification_socket() {
		// Correctly decide between ws:// and wss://
		var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
		// var ws_path = ws_scheme + '://' + window.location.host + ":8001/"; // PRODUCTION


		var ws_path = ws_scheme + '://' + window.location.host + "/";
		// console.log("Connecting to " + ws_path);


		var ws_path = ws_scheme + '://' + "localhost:8000/"
		console.log("notification path is ", ws_path);
		notificationSocket = new WebSocket(ws_path);

		await setup_cookie_in_socket()



		// Handle incoming messages
		notificationSocket.onmessage = function (message) {
			console.log("Got notification websocket message.");
			var data = JSON.parse(message.data);

			console.log("received socket message is",data);
			/*
			GENERAL NOTIFICATIONS
		*/
			// new 'general' notifications data payload
			if (data.general_msg_type == 0) {
				handleGeneralNotificationsData(data['notifications'], data['new_page_number'])
			}


			// THis allows you to update the notification based on what's coming in 

			if (data.general_msg_type == 5) {
				updateGeneralNotificationDiv(data['notification'])
			}
		}

		notificationSocket.onclose = function (e) {
			console.error('Notification Socket closed unexpectedly');
		};

		notificationSocket.onopen = function (e) {
			console.log("Notification Socket on open: " + e)

			setupGeneralNotificationsMenu()
			getFirstGeneralNotificationsPage()
		}

		notificationSocket.onerror = function (e) {
			console.log('Notification Socket error', e)
		}

		if (notificationSocket.readyState == WebSocket.OPEN) {
			console.log("Notification Socket OPEN complete.")

		}
		else if (notificationSocket.readyState == WebSocket.CONNECTING) {
			console.log("Notification Socket connecting..")
		}

	}



	/*
		Received a payload from socket containing notifications.
		Called:
			1. When page loads
			2. pagination
	*/
	function handleGeneralNotificationsData(notifications, new_page_number) {
		if (notifications.length > 0) {
			clearNoGeneralNotificationsCard()
			notifications.forEach(notification => {

 				appendBottomGeneralNotification(notification)

			})
		}
	}



	/*
		  Initialize the general notification menu
		  Called when page loads.
	  */
	function setupGeneralNotificationsMenu() {
		var notificationContainer = document.getElementById("id_general_notifications_container")


		if (notificationContainer != null) {

			// Ensure that only 1 card exists 
			// with innerhtml = "you have no notifications"

			var no_notify_card_exists = true
			notificationContainer.childNodes.forEach(e=>{
				if(e.innerHTML == "you have no notifications"){
					no_notify_card_exists= false
					console.log("no-notify-card found");
				}
			})
			if(no_notify_card_exists){
			card = createGeneralNotificationCard("id_no_general_notifications")


			var div = document.createElement("div")
			div.classList.add("d-flex", "flex-row", "align-items-start")

			span = document.createElement("span")
			span.classList.add("align-items-start", "pt-1", "m-auto")
			span.innerHTML = "You have no notifications."
			div.appendChild(span)
			card.appendChild(div)
			notificationContainer.appendChild(card)

			}
		}
	}

	/*
		Build general notification
	*/
	function createGeneralNotificationCard(cardId) {
		var card = document.createElement("div")
		if (cardId != "undefined") {
			card.id = cardId
		}
		// Modified
		card.classList.add("d-flex", "flex-column", "align-items-start", "general-card", "p-4"
		,"joseph-no-notifycard")
		return card
	}


	function setup_cookie_in_socket() {
		// Need this line to authenticate the user
		document.cookie = ""

		// Expire the previous authorization cookie
		document.cookie = "authorization= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
		var user_token = sessionStorage.getItem("token")
		console.log("the user token is ", user_token);

		// private_path is the path of the cookie
		document.cookie =set_cookie("authorization", "", user_token, 1)



	}

	


	/*
	Use this function here and notification_socket can be set here
	When user clicks on accepting a friend request 	
	Accept a Friend request
	*/
	function sendAcceptFriendRequestToSocket(notification_id) {
		notificationSocket.send(JSON.stringify({
			"command": "accept_friend_request",
			"notification_id": notification_id,
		}));
	}

	/*
		Decline a friend request
	*/
	function sendDeclineFriendRequestToSocket(notification_id) {
		notificationSocket.send(JSON.stringify({
			"command": "decline_friend_request",
			"notification_id": notification_id,
		}));
	}


	/*
	This will always fire first. 
		Retrieve the first page of notifications.
		Called when page loads.
	*/
	function getFirstGeneralNotificationsPage() {
		// console.log("the notification sent");
		if ("{{request.user.is_authenticated}}") {
			notificationSocket.send(JSON.stringify({
				"command": "get_general_notifications",
				"page_number": "1",
			}));
		}
	}
	/*
		Remove the element that says "There are no notifications".
	*/
	function clearNoGeneralNotificationsCard() {
		var element = document.getElementById("id_no_general_notifications")
		if (element != null && element != "undefined") {
			document.getElementById("id_general_notifications_container").removeChild(element)
		}
	}


	/*
- Based on diff type of notification then add the notification
	Append a general notification to the BOTTOM of the list.
*/
	function appendBottomGeneralNotification(notification) {

		switch (notification['notification_type']) {

			case "FriendRequest":
				notificationContainer = document.getElementById("id_general_notifications_container")
				card = createFriendRequestElement(notification)
				notificationContainer.appendChild(card)

				console.log("friend request is found")
				break;

			case "FriendList":
				notificationContainer = document.getElementById("id_general_notifications_container")
				card = createFriendListElement(notification)
				notificationContainer.appendChild(card)
				break;

			default:
			// code block
		}
		preloadImage(notification['from']['image_url'], assignGeneralImgId(notification))
	}


		/*
	Create a Notification Card for a FriendRequest payload
	Ex: "John sent you a friend request."
	Ex: "You declined John's friend request."
	Ex: "You accepted John's friend request."
	Ex: "You cancelled the friend request to Kiba."
	Ex: "Maizy accepted your friend request."
	Ex: "Maizy declined your friend request."
	Params:
		1. redirect_url
			- Will redirect to the other users profile
*/
function createFriendRequestElement(notification){
	card = createGeneralNotificationCard()

	// assign id b/c we need to find this div if they accept/decline the friend request
	card.id = assignGeneralCardId(notification)
	card.addEventListener("click", function(){
		generalRedirect(notification['actions']['redirect_url'])
	})

	// Is the friend request PENDING? (not answered yet)
	if(notification['is_active'] == "True"){

		//console.log("found an active friend request")
		div1 = document.createElement("div")
		div1.classList.add("d-flex", "flex-row", "align-items-start")
		div1.id = assignGeneralDiv1Id(notification)
		
		img = createGeneralProfileImageThumbnail(notification)
		div1.appendChild(img)

		span = document.createElement("span")
		span.classList.add("m-auto")
		span.innerHTML = notification['verb']
		span.id = assignGeneralVerbId(notification)
		div1.appendChild(span)
		card.appendChild(div1)

		div2 = document.createElement("div")
		div2.classList.add("d-flex", "flex-row", "mt-2")
		div2.id = assignGeneralDiv2Id(notification)

		pos_action = document.createElement("a")
		pos_action.classList.add("btn", "btn-primary", "mr-2")
		pos_action.href = "#"
		pos_action.innerHTML = "Accept"

		// Here sending that id 
		pos_action.addEventListener("click", function(e){
			e.stopPropagation();
			sendAcceptFriendRequestToSocket(notification['notification_id'])
		})
		pos_action.id = assignGeneralPosActionId(notification)
		div2.appendChild(pos_action)

		neg_action = document.createElement("a")
		neg_action.classList.add("btn", "btn-secondary")
		neg_action.href = "#"
		neg_action.innerHTML = "Decline"
		neg_action.addEventListener("click", function(e){
			e.stopPropagation();
			sendDeclineFriendRequestToSocket(notification['notification_id'])
		})
		neg_action.id = assignGeneralNegActionId(notification)
		div2.appendChild(neg_action)
		card.appendChild(div2)
	}
	// The friend request has been answered (Declined or accepted)
	else{
		var div1 = document.createElement("div")
		div1.classList.add("d-flex", "flex-row", "align-items-start")
		div1.id = assignGeneralDiv1Id(notification)

		img = createGeneralProfileImageThumbnail(notification)
		img.id = assignGeneralImgId(notification)
		div1.appendChild(img)

		span = document.createElement("span")
		span.classList.add("m-auto")
		span.innerHTML = notification['verb']
		span.id = assignGeneralVerbId(notification)
		div1.appendChild(span)
		card.appendChild(div1)
	}
	card.appendChild(createGeneralTimestampElement(notification))

	return card
}


	/*
		Timestamp at the bottom of each notification card
	*/
	function createGeneralTimestampElement(notification){
		var timestamp = document.createElement("p")
		timestamp.classList.add("small", "pt-2", "timestamp-text")
		timestamp.innerHTML = notification['natural_timestamp']
		timestamp.id = assignGeneralTimestampId(notification)
		return timestamp
	}
};
function preloadCallback(src, elementId){
	var img = document.getElementById(elementId)
	
	var replaced_url = src.replace("3000", "8000")
// console.log(replaced_url);
	img.src = replaced_url
	
}
export var notificationSocket
export default Header;