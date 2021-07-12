
// The main 3 fxns
// 3 key fxns to look at 
//createFriendListElement
//createFriendRequestElement

import { preloadImage } from "../../Reusable/Async_image_loader"


// If no notification, need to call clearNoGeneralNotificationCard()

var updatedDiv
var card
var span
var img
var div2
var pos_action
var neg_action
var notificationContainer
var divs

    /*
		Initialize the general notification menu
		Called when page loads.
	*/
	export function setupGeneralNotificationsMenu(){
		var notificationContainer = document.getElementById("id_general_notifications_container")


		if(notificationContainer != null){
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
	
	function createFriendListElement(notification){
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
		Timestamp at the bottom of each notification card
	*/
	function createGeneralTimestampElement(notification){
		var timestamp = document.createElement("p")
		timestamp.classList.add("small", "pt-2", "timestamp-text")
		timestamp.innerHTML = notification['natural_timestamp']
		timestamp.id = assignGeneralTimestampId(notification)
		return timestamp
	}


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


    /*
        Circular image icon that can be in a notification card
        
        based on the notification passed in 
	*/
	function createGeneralProfileImageThumbnail(notification){

		var img = document.createElement("img")
		img.classList.add("notification-thumbnail-image", "img-fluid", "rounded-circle", "mr-2")
		img.src="http://localhost:8000/media/dummy_image.jpeg" 
    
        img.id = assignGeneralImgId(notification)
		return img
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
				window.sendAcceptFriendRequestToSocket(notification['notification_id'])
			})
			pos_action.id = assignGeneralPosActionId(notification)
			div2.appendChild(pos_action)

			neg_action = document.createElement("a")
			neg_action.classList.add("btn", "btn-secondary")
			neg_action.href = "#"
			neg_action.innerHTML = "Decline"
			neg_action.addEventListener("click", function(e){
				e.stopPropagation();
				window.sendDeclineFriendRequestToSocket(notification['notification_id'])
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
	*/
	export function handleGeneralNotificationsData(notifications, new_page_number){
		if(notifications.length > 0){
			clearNoGeneralNotificationsCard()
			notifications.forEach(notification => {

				appendBottomGeneralNotification(notification)

			})
		}
	}



	/*
		Remove the element that says "There are no notifications".
	*/
	function clearNoGeneralNotificationsCard(){
		var element = document.getElementById("id_no_general_notifications")
		if(element != null && element != "undefined"){
			document.getElementById("id_general_notifications_container").removeChild(element)
		}
	}

	/*
	- Based on diff type of notification then add the notification
		Append a general notification to the BOTTOM of the list.
	*/
	function appendBottomGeneralNotification(notification){

		switch(notification['notification_type']) {

			case "FriendRequest":
				notificationContainer = document.getElementById("id_general_notifications_container")
				card = createFriendRequestElement(notification)
				notificationContainer.appendChild(card)
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



	




	function generalRedirect(url){
		window.location.href = url
	}


	// Helper fxn for making IDs
	function assignGeneralDiv1Id(notification){
		return "id_general_div1_" + notification['notification_id']
	}

	function assignGeneralImgId(notification){
		return "id_general_img_" + notification['notification_id']
	}

	function assignGeneralVerbId(notification){
		return "id_general_verb_" + notification['notification_id']
	}

	function assignGeneralDiv2Id(notification){
		return "id_general_div2_" + notification['notification_id']
	}

	function assignGeneralPosActionId(notification){
		return "id_general_pos_action_" + notification['notification_id']
	}

	function assignGeneralNegActionId(notification){
		return "id_general_neg_action_" + notification['notification_id']
	}

	function assignGeneralTimestampId(notification){
		return "id_timestamp_" + notification['notification_id']
	}

	function assignGeneralCardId(notification){
		return "id_notification_" + notification['notification_id']
	}