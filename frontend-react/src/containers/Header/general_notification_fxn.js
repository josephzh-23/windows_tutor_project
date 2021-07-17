
// If no notification, need to call clearNoGeneralNotificationCard()

import { notificationSocket } from "./Header"


var oldestTimestamp
var newestTimestamp
var element
var current

var updatedDiv
var card
var span
var img
var div2
var pos_action
var neg_action
var notificationContainer
var divs


/* This file is broken into part 1 and 2, 
part 1 for the basic notifications and part 2 for the real time notifications. 
*/
const GENERAL_NOTIFICATION_INTERVAL = 4000
const GENERAL_NOTIFICATION_TIMEOUT = 5000

// Keep track of what notifications are currently visible to the user.

// Will govern what we have as well 
// Here we will use the list from the collections library 
// var generalCachedNotifList = new List([])

 var generalCachedNotifList= window.generalCachedNotifList



 	/*
		Sets the pagination page number.
	*/
	function setGeneralPageNumber(pageNumber){
		document.getElementById("id_general_page_number").innerHTML = pageNumber
	}
/*
		Refresh the notifications that are currently visible
		called by refreshGeneralnotificationsData
	*/
	function refreshGeneralNotifications(){
		oldestTimestamp = document.getElementById("id_general_oldest_timestamp").innerHTML
		newestTimestamp = document.getElementById("id_general_newest_timestamp").innerHTML
		if("{{request.user.is_authenticated}}"){
			notificationSocket.send(JSON.stringify({
				"command": "refresh_general_notifications",
				"oldest_timestamp": oldestTimestamp,
				"newest_timestamp": newestTimestamp,
			}));
		}
	}

	/*
		Received a payload from socket containing notifications currently in view.
		Called every GENERAL_NOTIFICATION_INTERVAL
	*/
	function refreshGeneralNotificationsData(notifications){
		console.log(notifications)
		if(notifications.length > 0){
			clearNoGeneralNotificationsCard()
			notifications.forEach(notification => {

				submitGeneralNotificationToCache(notification)

				setGeneralOldestTimestamp(notification['timestamp'])
				setGeneralNewestTimestamp(notification['timestamp'])
			})
		}
	}

		/*
		If a newer timestamp comes in 
		Keep track of the 'general' newest notification in view. 
		When 'getNewGeneralNotifications' is called, it retrieves all the notifications newer than this date.
	*/
	function setGeneralNewestTimestamp(timestamp){
		element = document.getElementById("id_general_newest_timestamp")
		current = element.innerHTML
		if(Date.parse(timestamp) > Date.parse(current)){
			element.innerHTML = timestamp
		}
		else if(current == ""){
			element.innerHTML = timestamp
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
function submitGeneralNotificationToCache(notification){
	var result = generalCachedNotifList.filter(function(n){ 
		return n['notification_id'] === notification['notification_id']
	})
	// This notification does not already exist in the list
	if(result.length == 0){
		generalCachedNotifList.push(notification)

		// append to bottom of list
		appendBottomGeneralNotification(notification)
	}
	// This notification already exists in the list
	else{
		// find the div and update it.
		refreshGeneralNotificationsList(notification)
	}
}

/*
		Start the functions that will be executed constantly
	*/
	function startGeneralNotificationService(){
		if("{{request.user.is_authenticated}}" == "True"){
			setInterval(refreshGeneralNotifications, GENERAL_NOTIFICATION_INTERVAL)
		}
	}

	startGeneralNotificationService()


	// Below is part 1 of notification before the real time functions 
  /*
		Build general notification
	*/
	function createGeneralNotificationCard(cardId){
		var card = document.createElement("div")
		if(cardId != "undefined"){
			card.id = cardId
		}
		card.classList.add("d-flex", "flex-column", "align-items-start", "general-card", "p-4")
		return card
	}
	export function createFriendListElement(notification){
		card = createGeneralNotificationCard()
		card.id = assignGeneralCardId(notification)
		card.addEventListener("click", function(){
			generalRedirect(notification['actions']['redirect_url'])
		})

		var div1 = document.createElement("div")
		div1.classList.add("d-flex", "flex-row", "align-items-start")
		div1.id = assignGeneralDiv1Id(notification)

		img = createGeneralProfileImageThumbnail(notification)
		div1.appendChild(img)

		span = document.createElement("span")
		span.classList.add("align-items-start", "pt-1", "m-auto")
		if(notification['verb'].length > 50){
			span.innerHTML = notification['verb'].slice(0, 50) + "..."
		}
		else{
			span.innerHTML = notification['verb']
		}
		span.id = assignGeneralVerbId(notification)
		div1.appendChild(span)
		card.appendChild(div1)
		card.appendChild(createGeneralTimestampElement(notification))

		return card
	}



	



    /*
        Circular image icon that can be in a notification card
        
        based on the notification passed in 
	*/
	export function createGeneralProfileImageThumbnail(notification){

		var img = document.createElement("img")
		img.classList.add("notification-thumbnail-image", "img-fluid", "rounded-circle", "mr-2")
		img.src="http://localhost:8000/media/dummy_image.jpeg" 
    
        img.id = assignGeneralImgId(notification)
		return img
	}





	/*
		Update a div with new notification data.


		Called when the session user accepts/declines a friend request.
	*/
	export function updateGeneralNotificationDiv(notification){
		notificationContainer = document.getElementById("id_general_notifications_container")

		if(notificationContainer != null){
			divs = notificationContainer.childNodes


			// This allows us to find that notification that needs to be udpated 
			divs.forEach(function(element){
				if(element.id == ("id_notification_" + notification['notification_id'])){
					
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
	export function handleGeneralNotificationsData(notifications, new_page_number){
		if(notifications.length > 0){
			clearNoGeneralNotificationsCard()
			notifications.forEach(notification => {

				submitGeneralNotificationToCache(notification)

				setGeneralOldestTimestamp(notification['timestamp'])
				setGeneralNewestTimestamp(notification['timestamp'])
			})
			setGeneralPageNumber(new_page_number)
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
	window.preloadImage(notification['from']['image_url'], assignGeneralImgId(notification))
}



	/*
		Remove the element that says "There are no notifications".
	*/
	export function clearNoGeneralNotificationsCard(){
		var element = document.getElementById("id_no_general_notifications")
		if(element != null && element != "undefined"){
			document.getElementById("id_general_notifications_container").removeChild(element)
		}
	}

	



/*
If an older time stamp comes in 
		Keep track of the 'general' oldest notification in view. 
		When 'refreshGeneralNotifications' is called, it refreshes all the notifications newer than this date but newer than 'id_general_newest_timestamp.
	*/
	function setGeneralOldestTimestamp(timestamp){
		element = document.getElementById("id_general_oldest_timestamp")
		current = element.innerHTML

		// Replace the most current oldest timestamp
		if(Date.parse(timestamp) < Date.parse(current)){
			element.innerHTML = timestamp
		}
	}



	/*
		Search for the notification in the list using it's id. Then update its properties.
		I do not update the image_url since that makes the notifications "flicker".

		- send sth to the backend 
		- also handle incoming message as well 
	*/
	function refreshGeneralNotificationsList(notification){
		notificationContainer = document.getElementById("id_general_notifications_container")

		if(notificationContainer != null){


			divs = notificationContainer.childNodes

			divs.forEach(function(card){
				// card
				if(card.id == ("id_notification_" + notification['notification_id'])){
					
					switch(notification['notification_type']) {

						case "FriendRequest":
							refreshFriendRequestCard(card, notification)
							break;

						case "FriendList":
							refreshFriendListCard(card, notification)
							break;

						default:
							// code block
					}
				}
			})
		}
	}

/*
		Refresh a FriendRequest card with current data
	*/
	function refreshFriendRequestCard(card, notification){
		card.childNodes.forEach(function(element){

			// DIV1
			if(element.id == ("id_general_div1_" + notification['notification_id'])){
				element.childNodes.forEach(function(child){
					if(child.id == ("id_general_verb_" + notification['notification_id'])){
						// found verb
						child.innerHTML = notification['verb']
					}
				})
			}
				
			// DIV2

			// Remove the element that's no longer active 
			if (element.id == ("id_general_div2_" + notification['notification_id'])){
				if(notification['is_active'] == "True"){
						// do nothing
				}
				else{
					// remove buttons b/c it has been answered
					card.removeChild(element)
				}
			}

			// TIMESTAMP
			if (element.id == ("id_timestamp_" + notification['notification_id'])){
				element.innerHTML = notification['natural_timestamp']
			}
		})
	}

	/*
		Refresha a FriendList card with current data
		- we only change the verb here not anything else 
	*/
	function refreshFriendListCard(card, notification){
		card.childNodes.forEach(function(element){

			// DIV1
			if(element.id == ("id_general_div1_" + notification['notification_id'])){
				element.childNodes.forEach(function(child){
					if(child.id == ("id_general_verb_" + notification['notification_id'])){
						// found verb
						child.innerHTML = notification['verb']
					}
				})
			}

			// TIMESTAMP
			if (element.id == ("id_timestamp_" + notification['notification_id'])){
				element.innerHTML = notification['natural_timestamp']
			}
		})
	}
/*
// 		Set the inital timestamp value for id_general_oldest_timestamp.
// 		This timestamp is used to determine what constitutes a "NEW" notification or an "OLD" notification.
// 	*/
// 	function setInitialTimestamp(){
// 		// ('%Y-%m-%d %H:%M:%S.%f')
// 		var today = new Date();
// 		var month = today.getMonth()+1
// 		if(month.toString().length == 1){
// 			month = "0" + month
// 		}
// 		var day = today.getDate()
// 		if(day.toString().length == 1){
// 			day = "0" + day
// 		}
// 		var hours = today.getHours()
// 		if(hours.toString().length == 1){
// 			hours = "0" + hours
// 		}
// 		var minutes = today.getMinutes()
// 		if(minutes.toString().length == 1){
// 			minutes = "0" + minutes
// 		}
// 		var seconds = today.getSeconds()
// 		if(seconds.toString().length == 1){
// 			seconds = "0" + seconds
// 		}
// 		var ms = "000000"
// 		var date = today.getFullYear()+'-'+month+'-'+day + " " + hours + ":" + minutes + ":" + seconds + "." + ms
// 		document.getElementById("id_general_oldest_timestamp").innerHTML = date
// 	}


		/* // Part of the pagination 
		Retrieve the next page of notifications
		Called when the user scrolls to the bottom of the popup menu.
	*/
	export function getNextGeneralNotificationsPage(){
		var pageNumber = document.getElementById("id_general_page_number").innerHTML
		// -1 means exhausted or a query is currently in progress
		if("{{request.user.is_authenticated}}" && pageNumber != "-1"){
			notificationSocket.send(JSON.stringify({
				"command": "get_general_notifications",
				"page_number": pageNumber,
			}));
		}
	}
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
	

	export function generalRedirect(url){
		window.location.href = url
	}


	// Helper fxn for making IDs
	export function assignGeneralDiv1Id(notification){
		return "id_general_div1_" + notification['notification_id']
	}

	export function assignGeneralImgId(notification){
		return "id_general_img_" + notification['notification_id']
	}

	export function assignGeneralVerbId(notification){
		return "id_general_verb_" + notification['notification_id']
	}

	export function assignGeneralDiv2Id(notification){
		return "id_general_div2_" + notification['notification_id']
	}

	export function assignGeneralPosActionId(notification){
		return "id_general_pos_action_" + notification['notification_id']
	}

	export function assignGeneralNegActionId(notification){
		return "id_general_neg_action_" + notification['notification_id']
	}

	export function assignGeneralTimestampId(notification){
		return "id_timestamp_" + notification['notification_id']
	}

	export function assignGeneralCardId(notification){
		return "id_notification_" + notification['notification_id']
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