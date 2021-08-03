import 'bootstrap/dist/js/bootstrap.bundle';
import React, { useContext, useEffect } from 'react';
import { set_cookie } from '../../Reusable_Vanilla/Cookie.js';
import { UserContext } from '../../Reusable_React/UserContext.js';
import Form from '../Form.js';

import $ from '../../Reusable_Vanilla/Utilities/Util.js'
import {
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
	assignGeneralTimestampId,
	getNextGeneralNotificationsPage,
	refreshGeneralNotifications,
	setInitialTimestamp,
	setGeneralOldestTimestamp,
	submitGeneralNotificationToCache,
	refreshGeneralNotificationsList,
	setGeneralNotificationsAsRead
} from './general_notification_fxn.js';
import './Header.css';

import { preloadImage } from '../../Reusable_Vanilla/Async_image_loader.js';
import ImportScript from '../../Reusable_React/ImportScript.js';
import {  handleChatNotificationsData,  handleNewChatNotificationsData,  setChatInitialTimestamp,  setChatNotificationsCount,  setChatPaginationExhausted,  setupChatNotificationsMenu } from '../Chat_Notifications/Chat_Notifications.js';
import { submitNewChatNotificationToCache, setChatNewestTimestamp} from './../Chat_Notifications/Chat_Notifications';

var List = require("collections/list");


// Id of the notification span: id_general_notifications_container
// Used to set up the notificatino websocket 
const Header =() => {
	const GENERAL_NOTIFICATION_INTERVAL = 10000
	const GENERAL_NOTIFICATION_TIMEOUT = 5000

	var card, span, notificationContainer
	var span1, span2

	var element
	var current
	var updatedDiv
	var card
	var span
	var img
	var div2
	var pos_action
	var neg_action
	var divs




	var notificationSocket



	var props = {
		"chatCachedNotifList": chatCachedNotifList,
		"card": card
	}
	// Will govern what we have as well 
	// Here we will use the list from the collections library 
	var generalCachedNotifList = new List([])

	var chatCachedNotifList = new List([])



	var $ = function (id) { return document.getElementById(id); };
	var oldestTimestamp

	// This alwasy comes from the newest time notification
	var newestTimestamp

	const { authUser } = useContext(UserContext)
	

	function setInitialTimestamp() {
		// ('%Y-%m-%d %H:%M:%S.%f')
		var today = new Date();
		var month = today.getMonth() + 1
		if (month.toString().length == 1) {
			month = "0" + month
		}
		var day = today.getDate()
		if (day.toString().length == 1) {
			day = "0" + day
		}
		var hours = today.getHours()

		if (hours.toString().length == 1) {
			hours = "0" + hours
		}
		var minutes = today.getMinutes()
		console.log('hours is ', minutes)
		if (minutes.toString().length == 1) {
			minutes = "0" + minutes
		}
		var seconds = today.getSeconds()
		if (seconds.toString().length == 1) {
			seconds = "0" + seconds
		}
		var ms = "000000"
		var date = today.getFullYear() + '-' + month + '-' + day + " " + hours + ":" + minutes + ":" + seconds + "." + ms
		document.getElementById("id_general_oldest_timestamp").innerHTML = date

	
	document.getElementById("id_general_newest_timestamp").innerHTML = date
		console.log(document.getElementById("id_general_oldest_timestamp").innerHTML)
	}

	useEffect(() => {

		// const script = document.createElement('script');
	
		// script.src = '../Chat_Notifications/Chat_Notifications.js';
		// script.async = true;
		// document.body.appendChild(script);	
		setOnGeneralNotificationScrollListener()
		// startGeneralNotificationService()
	
		setInitialTimestamp()
		// console.log("notify list is ", this.generalCachedNotifList);
		setupChatDropdownHeader()

	
		setup_notification_socket()
		document.addEventListener("DOMContentLoaded", function(event) { 
			setChatInitialTimestamp()
		   });

	
		console.log("the list is", generalCachedNotifList)


		console.log("user is logged?", authUser.isAuthenticated);
		// return () => {
		// 	document.body.removeChild(script);
		//   }

	}, [authUser])



	return (

		// We can include the js as a module here 
	

		// Conditinoal rendering here 
		// <!-- Header -->
		<div className="d-flex flex-column flex-lg-row p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
			<p className="d-none" id="id_chat_newest_timestamp"></p>
	
<p className="d-none" id="id_chat_page_number">1</p>
			{/* Used for settting the page number  */}
			<p className="d-none" id="id_general_page_number">1</p>
			<p className="d-none" id="id_general_oldest_timestamp"></p>
			<p className="d-none" id="id_general_newest_timestamp"></p>
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
						{/* {(authUser.isAuthenticated) ? */}
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
									 onClick={setGeneralNotificationsAsRead}
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
						{/* } */}
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

	/*
			Called when pagination is exhausted and there is no more notifications.
		*/
	function setGeneralPaginationExhausted() {
		console.log("general pagination exhausted.")
		setGeneralPageNumber("-1")
	}

	/*
		Sets the pagination page number.
	*/
	function setGeneralPageNumber(pageNumber) {
		document.getElementById("id_general_page_number").innerHTML = pageNumber
	}


	/*
		Sets the scroll listener for when user scrolls to bottom of notification menu.
		It will retrieve the next page of results.
	*/
	function setOnGeneralNotificationScrollListener() {
		var menu = document.getElementById("id_general_notifications_container")
		if (menu != null) {
			menu.addEventListener("scroll", function (e) {

				if ((menu.scrollTop) >= (menu.scrollHeight - menu.offsetHeight)) {
					getNextGeneralNotificationsPage()
				}
			});
		}

	}
	function executeQuery() {
		var query = ""
		query = document.getElementById('id_q_small').value;
		if (query == "") {
			query = document.getElementById('id_q_large').value;
		}
		window.location.replace("{% url 'search' %}?q=" + query)
		return false
	}



	/*

	/*
		Add a header to the dropdown so users can visit /chat/
	*/
	function setupChatDropdownHeader() {
		var notificationContainer = document.getElementById("id_chat_notifications_container")

		if (notificationContainer != null) {

			var div = document.createElement("div")
			div.classList.add("chat-dropdown-header", "d-flex", "flex-row", "justify-content-end", "m-auto", "align-items-end")
			div.addEventListener("click", function (e) {
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

	function chatRedirect(url) {
		window.location.href = url
	}


	/*
			Retrieve the number of unread notifications. (This is the red dot in the notifications icon)
			Called every GENERAL_NOTIFICATION_INTERVAL
		*/
	function getUnreadGeneralNotificationsCount() {
		if ("{{request.user.is_authenticated}}") {
			notificationSocket.send(JSON.stringify({
				"command": "get_unread_general_notifications_count",
			}));
		}
	}



	function setup_notification_socket() {
		// Correctly decide between ws:// and wss://
		var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
		// var ws_path = ws_scheme + '://' + window.location.host + ":8001/"; // PRODUCTION


		var ws_path = ws_scheme + '://' + window.location.host + "/";
		// console.log("Connecting to " + ws_path);


		var ws_path = ws_scheme + '://' + "localhost:8000/"
		console.log("notification path is ", ws_path);
		notificationSocket = new WebSocket(ws_path);




		setup_cookie_in_socket()



		// Handle incoming messages
		notificationSocket.onmessage = function (message) {



			//This need to be declared here 
			// Otherwise not defined within scope as socket continnue
			// to be passed around

			console.log("this is ", window);
	
			var data = JSON.parse(message.data);
			console.log("Got notification websocket message."+ data.general_msg_type);
			console.log("Got notification websocket message."+ data.chat_msg_type);

			console.log("received socket message is", data);
			/*
			GENERAL NOTIFICATIONS
		*/
			// new 'general' notifications data payload
			if (data.general_msg_type == 0) {


				// Put in a safe guard here 
				// if(generalCachedNotifList!==undefined){
				handleGeneralNotificationsData(data['notifications'], data['new_page_number']
				)
				// }
			}


			// "General" Pagination exhausted. No more results.
			if (data.general_msg_type == 1) {
				setGeneralPaginationExhausted()
			}


			// Refresh [newest_timestamp >= NOTIFICATIONS >= oldest_timestamp]
			if (data.general_msg_type == 2) {
				// if(generalCachedNotifList!==undefined){
				// THis also needs the notificationCacheList 
				refreshGeneralNotificationsData(data['notifications'])
				// }
			}


			if (data.general_msg_type == 3) {
				handleNewGeneralNotificationsData(data['notifications'])
			}

			if (data.general_msg_type == 4) {
				setUnreadGeneralNotificationsCount(data['count'])
			}
			// THis allows you to update the notification based on what's coming in 

			if (data.general_msg_type == 5) {
				updateGeneralNotificationDiv(data['notification'])
			}

			/*
			Part 2
			CHAT NOTIFICATIONS
		*/
			// new 'chat' notifications data payload
			if (data.chat_msg_type == 10) {
				handleChatNotificationsData(data['notifications'], data['new_page_number'])
			}

			// "Chat" Pagination exhausted. No more results.
		if(data.chat_msg_type == 11){
			setChatPaginationExhausted()
		}
			// refreshed chat notifications
			if (data.chat_msg_type == 13) {
				handleNewChatNotificationsData(data['notifications'])
			}

			if(data.chat_msg_type == 14){
				setChatNotificationsCount(data.count)
			}
		}

		notificationSocket.onclose = function (e) {
			console.error('Notification Socket closed unexpectedly');
		};

		notificationSocket.onopen = function (e) {
			console.log("Notification Socket on open: " + e)

			setupGeneralNotificationsMenu()
			getFirstGeneralNotificationsPage()

			getUnreadGeneralNotificationsCount()

			setupChatNotificationsMenu()
			getFirstChatNotificationsPage()
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
		Received a payload from socket containing NEW notifications
		Called every GENERAL_NOTIFICATION_INTERVAL
	*/
	function handleNewGeneralNotificationsData(notifications){
    	if(notifications.length > 0){
    		clearNoGeneralNotificationsCard()
    		notifications.forEach(notification => {

    			submitNewGeneralNotificationToCache(notification)

				setGeneralOldestTimestamp(notification['timestamp'])
				setGeneralNewestTimestamp(notification['timestamp'])
			})
	    }
	}

	/*
	Update a div with new notification data.


	Called when the session user accepts/declines a friend request.
*/
	function updateGeneralNotificationDiv(notification) {
		notificationContainer = document.getElementById("id_general_notifications_container")

		if (notificationContainer != null) {
			divs = notificationContainer.childNodes


			// This allows us to find that notification that needs to be udpated 
			divs.forEach(function (element) {
				if (element.id == ("id_notification_" + notification['notification_id'])) {

					// Replace current div with updated one
					updatedDiv = createFriendRequestElement(notification)
					element.replaceWith(updatedDiv)
				}
			})
		}
	}
	/*
	Received a payload from socket containing notifications.
	Called:
		1. When page loads
		2. pagination

		3. THe whole package. 
*/
	function handleGeneralNotificationsData(notifications, new_page_number) {

		// THis will find the newest timestamp of each notification coming in
		// THe newest one will be the newest_time stamp

		if (notifications.length > 0) {
			clearNoGeneralNotificationsCard()
			notifications.forEach(notification => {


				console.log("incoming time stamp", notification['timestamp'])
				submitGeneralNotificationToCache(notification)

				setGeneralOldestTimestamp(notification['timestamp'])
				setGeneralNewestTimestamp(notification['timestamp'])
			})
			setGeneralPageNumber(new_page_number)
		}
	}



	/*
	If a newer timestamp comes in 
	Keep track of the 'general' newest notification in view. 
	When 'getNewGeneralNotifications' is called, it retrieves all the notifications newer than this date.
*/
	function setGeneralNewestTimestamp(timestamp) {
		element = document.getElementById("id_general_newest_timestamp")
		current = element.innerHTML
		if (Date.parse(timestamp) > Date.parse(current)) {
			element.innerHTML = timestamp
		}
		else if (current == "") {
			element.innerHTML = timestamp
		}
	}


	/*
	Msg -type 2 data 
	/*
			Received a payload from socket containing notifications currently in view.
			Called every GENERAL_NOTIFICATION_INTERVAL
		*/
	function refreshGeneralNotificationsData(notifications) {
		console.log(notifications)
		if (notifications.length > 0) {
			clearNoGeneralNotificationsCard()
			notifications.forEach(notification => {

				submitGeneralNotificationToCache(notification)

				setGeneralOldestTimestamp(notification['timestamp'])
				setGeneralNewestTimestamp(notification['timestamp'])
			})
		}
	}

	/*
		Refresh the notifications that are currently visible
		called by refreshGeneralnotificationsData
	*/
	function refreshGeneralNotifications() {
		oldestTimestamp = document.getElementById("id_general_oldest_timestamp").innerHTML
		newestTimestamp = document.getElementById("id_general_newest_timestamp").innerHTML


		if (authUser.isAuthenticated) {
			notificationSocket.send(JSON.stringify({
				"command": "refresh_general_notifications",
				"oldest_timestamp": oldestTimestamp,
				"newest_timestamp": newestTimestamp,
			}));


			console.log("command sent", oldestTimestamp, newestTimestamp);
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
			notificationContainer.childNodes.forEach(e => {
				if (e.innerHTML == "you have no notifications") {
					no_notify_card_exists = false
					console.log("no-notify-card found");
				}
			})
			if (no_notify_card_exists) {
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
		Append a general notification to the TOP of the list.
	*/
	function appendTopGeneralNotification(notification) {

		switch (notification['notification_type']) {

			case "FriendRequest":
				notificationContainer = document.getElementById("id_general_notifications_container")
				card = createFriendRequestElement(notification)
				notificationContainer.insertBefore(card, notificationContainer.childNodes[0]);
				break;

			case "FriendList":
				notificationContainer = document.getElementById("id_general_notifications_container")
				card = createFriendListElement(notification)
				notificationContainer.insertBefore(card, notificationContainer.childNodes[0]);
				break;

			default:
			// code block
		}

		preloadImage(notification['from']['image_url'], assignGeneralImgId(notification))
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
			, "joseph-no-notifycard")
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
		// We will only set 1 authorization here in the cookie
		document.cookie = set_cookie("authorization", "", user_token, 1)

	}




	/*
		Append to top OR update a div that already exists.
		Called by 'handleNewGeneralNotificationsData'
	*/
	function submitNewGeneralNotificationToCache(notification) {

		// Check if this notififcation already exists or not 

		var result = generalCachedNotifList.filter(function (n) {
			return n['notification_id'] === notification['notification_id']
		})
		// This notification does not already exist in the list
		// A brand new one
		if (result.length == 0) {
			generalCachedNotifList.push(notification)

			// append to top of list
			appendTopGeneralNotification(notification)
		}
		// This notification already exists in the list
		else {
			// find the div and update it.
			refreshGeneralNotificationsList(notification)
		}
	}

	/*
		Append to bottom. 
		Used for
			1. Page load
			2. pagination
			3. Refresh
		Called by 'handleGeneralNotificationsData' &  'refreshGeneralNotificationsData'
	*/



	function submitGeneralNotificationToCache(notification) {

		console.log("the window ", this);
		// Use this to make sure the notification does not already exist in the list 
		var result = generalCachedNotifList.filter(function (n) {
			return n['notification_id'] === notification['notification_id']
		})
		// This notification does not already exist in the list
		if (result.length == 0) {
			generalCachedNotifList.push(notification)

			// append to bottom of list
			appendBottomGeneralNotification(notification)
		}
		// This notification already exists in the list
		else {
			// find the div and update it.
			refreshGeneralNotificationsList(notification)
		}
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

	/* // Part of the pagination 
		Retrieve the next page of notifications
		Called when the user scrolls to the bottom of the popup menu.
	*/
	function getNextGeneralNotificationsPage() {
		var pageNumber = document.getElementById("id_general_page_number").innerHTML
		// -1 means exhausted or a query is currently in progress
		if ("{{request.user.is_authenticated}}" && pageNumber != "-1") {
			notificationSocket.send(JSON.stringify({
				"command": "get_general_notifications",
				"page_number": pageNumber,
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
	function createFriendRequestElement(notification) {
		card = createGeneralNotificationCard()

		// assign id b/c we need to find this div if they accept/decline the friend request
		card.id = assignGeneralCardId(notification)
		card.addEventListener("click", function () {
			generalRedirect(notification['actions']['redirect_url'])
		})

		// Is the friend request PENDING? (not answered yet)
		if (notification['is_active'] == "True") {

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
			pos_action.addEventListener("click", function (e) {
				e.stopPropagation();
				sendAcceptFriendRequestToSocket(notification['notification_id'])
			})
			pos_action.id = assignGeneralPosActionId(notification)
			div2.appendChild(pos_action)

			neg_action = document.createElement("a")
			neg_action.classList.add("btn", "btn-secondary")
			neg_action.href = "#"
			neg_action.innerHTML = "Decline"
			neg_action.addEventListener("click", function (e) {
				e.stopPropagation();
				sendDeclineFriendRequestToSocket(notification['notification_id'])
			})
			neg_action.id = assignGeneralNegActionId(notification)
			div2.appendChild(neg_action)
			card.appendChild(div2)
		}
		// The friend request has been answered (Declined or accepted)
		else {
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
	function createGeneralTimestampElement(notification) {
		var timestamp = document.createElement("p")
		timestamp.classList.add("small", "pt-2", "timestamp-text")
		timestamp.innerHTML = notification['natural_timestamp']
		timestamp.id = assignGeneralTimestampId(notification)
		return timestamp
	}






/*
		Retrieve the number of unread chat notifications. (This is the red dot in the notifications icon)
		Called every CHAT_NOTIFICATION_INTERVAL
	*/
	function getFirstChatNotificationsPage(){
		if("{{request.user.is_authenticated}}"){
			notificationSocket.send(JSON.stringify({
				"command": "get_chat_notifications",
				"page_number": "1",
			}));
		}
	}
	function preloadCallback(src, elementId) {
		var img = document.getElementById(elementId)

		var replaced_url = src.replace("3000", "8000")
		// console.log(replaced_url);
		img.src = replaced_url


	}

	/*
		Received a payload from socket containing NEW chat notifications
		Called every CHAT_NOTIFICATION_INTERVAL
	*/
	function handleNewChatNotificationsData(notifications){
		if(notifications.length > 0){
			clearNoChatNotificationsCard()
			notifications.forEach(notification => {

				submitNewChatNotificationToCache(notification)

				setChatNewestTimestamp(notification['timestamp'])
			})
		}
	}


	
/*
		Remove the element that says "There are no notifications".
	*/
	function clearNoChatNotificationsCard(){
		var element = document.getElementById("id_no_chat_notifications")
		if(element != null && element != "undefined"){
			document.getElementById("id_chat_notifications_container").removeChild(element)
		}
	}

	/*
		Start the functions that will be executed constantly
		should only start if there is notifications
	*/
	function startGeneralNotificationService() {
		if (authUser.isAuthenticated === true) {
			setInterval(refreshGeneralNotifications, GENERAL_NOTIFICATION_INTERVAL)

			setInterval(getNewGeneralNotifications, GENERAL_NOTIFICATION_INTERVAL)
			setInterval(getUnreadGeneralNotificationsCount, GENERAL_NOTIFICATION_INTERVAL)

		}
	}


	/*
		Retrieve any new notifications
		Called every GENERAL_NOTIFICATION_INTERVAL seconds
	*/
	function getNewGeneralNotifications(){
		newestTimestamp = document.getElementById("id_general_newest_timestamp").innerHTML
		if("{{request.user.is_authenticated}}"){
			notificationSocket.send(JSON.stringify({
				"command": "get_new_general_notifications",
				"newest_timestamp": newestTimestamp,
			}));
		}
	}

	/*
		Set the number of unread notifications.
	*/
	function setUnreadGeneralNotificationsCount(count) {
		var countElement = document.getElementById("id_general_notifications_count")
		if (count > 0) {
			countElement.style.background = "red"
			countElement.style.display = "block"
			countElement.innerHTML = count
		}
		else {
			countElement.style.background = "transparent"
			countElement.style.display = "none"
		}
	}


	/*
		Sets all the notifications currently visible as "read"
	*/
	function setGeneralNotificationsAsRead(){
		if("{{request.user.is_authenticated}}"){
			oldestTimestamp = document.getElementById("id_general_oldest_timestamp").innerHTML
			notificationSocket.send(JSON.stringify({
				"command": "mark_notifications_read",
			}));
			getUnreadGeneralNotificationsCount()
		}
	}


	/*
	This will always fire first. 
		Retrieve the first page of notifications.
		Called when page loads.
	*/
	function getFirstGeneralNotificationsPage() {
		// console.log("the notification sent");
		if (authUser.isAuthenticated) {
			notificationSocket.send(JSON.stringify({
				"command": "get_general_notifications",
				"page_number": "1",
			}));
		}


	}


};
export var notificationSocket

export default Header