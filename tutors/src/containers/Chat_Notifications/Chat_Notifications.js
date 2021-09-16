//import default 

import { createConnectedDisconnectedElement } from './../Private_chat/Private_Chat_fxn';
import { notificationSocket } from './../Header/Header';
// var List = require("collections/list");

console.log("Chat notifications");




var notificationContainer 

var chatNotificationContainer
var card

var newestTimestamp
var element
var current 

var divs 
var span1 
var span2

var chatCachedNotifList
var span 
var img 



	/*
		Retrieve the number of unread chat notifications. (This is the red dot in the notifications icon)
		Called every CHAT_NOTIFICATION_INTERVAL
	*/
	function getUnreadChatNotificationsCount(){
		if("{{request.user.is_authenticated}}"){
			// var notificationSocket = notificationSocket
			notificationSocket.send(JSON.stringify({
				"command": "get_unread_chat_notifications_count",
			}));
		}
	}
setOnChatNotificationScrollListener()
/*
		Search for the notification in the list using it's id. Then update its properties.
		I do not update the image_url since that makes the notifications "flicker".
	*/
	function refreshChatNotificationsList(notification){
		notificationContainer = document.getElementById("id_chat_notifications_container")

		if(notificationContainer != null){
			divs = notificationContainer.childNodes

			divs.forEach(function(card){
				// card
				if(card.id == ("id_notification_" + notification['notification_id'])){
					
					if(notification['notification_type'] == "UnreadChatRoomMessages"){
						refreshUnreadChatRoomMessagesCard(card, notification)
					}
				}
			})
		}
	}
/*
key fxn: handleNewChatNotificaitonsData (for handling the new data)
handleChatNotificationData ( for handling pagination)
*/

const CHAT_NOTIFICATION_INTERVAL = 4000

// Keep track of what notifications are currently visible to the user.
// var chatCachedNotifList = h.chatCachedNotifList



/*

		Append a chat notification to the TOP of the list.
	*/
	function appendTopChatNotification(notification){
		switch(notification['notification_type']) {

			case "UnreadChatRoomMessages":
				chatNotificationContainer = document.getElementById("id_chat_notifications_container")
				card = createUnreadChatRoomMessagesElement(notification)

                // In the case of existing notif
                // Here we want to make sure we are inserting before the 2nd index here

				if(chatNotificationContainer.childNodes.length > 2){
					// Append as the SECOND child. First child is the "go to chatroom" button
					var index = 2
					chatNotificationContainer.insertBefore(card, chatNotificationContainer.childNodes[index]);
                }
                
                // In the case no notify
				else {
					chatNotificationContainer.appendChild(card)
				}
				
				break;

			default:
				// code block
		}
	}
	/*
		Append to top OR update a div that already exists.
		Called by 'handleNewChatNotificationsData'
	*/
	export function submitNewChatNotificationToCache(notification){
		var result = chatCachedNotifList.filter(function(n){ 
			return n['notification_id'] === notification['notification_id']
		})
		// This notification does not already exist in the list
		if(result.length == 0){
			chatCachedNotifList.push(notification)

			// append to top of list
			appendTopChatNotification(notification)
		}
		// This notification already exists in the list
		else{
			// find the div and update it.
			refreshChatNotificationsList(notification)
		}
	}


    

	/*
		Refresh a refreshUnreadChatRoomMessagesCard card with current data
		- we want to update the div 2
		- update the timestamp and the stamp as well 
	*/
	function refreshUnreadChatRoomMessagesCard(card, notification){

		card.childNodes.forEach(function(element){

			// DIV1
			if(element.id == ("id_chat_div1_" + notification['notification_id'])){
				element.childNodes.forEach(function(child){

					// DIV2
					if(child.id == ("id_chat_div2_" + notification['notification_id'])){
						child.childNodes.forEach(function(nextChild){
							if(nextChild.id == ("id_chat_title_" + notification['notification_id'])){
								// found title
								nextChild.innerHTML = notification['from']['title']
							}
							if(nextChild.id == ("id_chat_message_" + notification['notification_id'])){
								// found chat message
								if(notification['verb'].length > 50){
									nextChild.innerHTML = notification['verb'].slice(0, 50) + "..."
								}
								else{
									nextChild.innerHTML = notification['verb']
								}
							}
						})
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
		Sets the scroll listener for when user scrolls to bottom of notification menu.
		It will retrieve the next page of results.
	*/
	function setOnChatNotificationScrollListener(){
		var menu = document.getElementById("id_chat_notifications_container")
		if(menu != null ){
			menu.addEventListener("scroll", function(e){

				// When scrolled to the bottom 
				if ((menu.scrollTop) >= (menu.scrollHeight - menu.offsetHeight)) {
					getNextChatNotificationsPage()
				}
			});
		}
		
	}

	/*
		Retrieve the next page of chat notifications
		Called when the user scrolls to the bottom of the popup menu.
	*/
	function getNextChatNotificationsPage(){
		var pageNumber = document.getElementById("id_chat_page_number").innerHTML
		// -1 means exhausted or a query is currently in progress

		if("{{request.user.is_authenticated}}" && pageNumber != "-1"){
			notificationSocket.send(JSON.stringify({
				"command": "get_chat_notifications",
				"page_number": pageNumber,
			}));

			getUnreadChatNotificationsCount()
		}
	}


	/*
		Retrieve any new chat notifications
		Called every CHAT_NOTIFICATION_INTERVAL seconds
	*/
	function getNewChatNotifications(){
		newestTimestamp = document.getElementById("id_chat_newest_timestamp").innerHTML
		
		
		if("{{request.user.is_authenticated}}"){
			notificationSocket.send(JSON.stringify({
				"command": "get_new_chat_notifications",
				"newest_timestamp": newestTimestamp,
			}));
		}
	}




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




	/*
		Start the functions that will be executed constantly
	*/
	function startChatNotificationService(){
		if("{{request.user.is_authenticated}}" == "True"){
			setInterval(getNewChatNotifications, CHAT_NOTIFICATION_INTERVAL)
			setInterval(getUnreadChatNotificationsCount, CHAT_NOTIFICATION_INTERVAL)
		}
	}

	startChatNotificationService()

	
	
	/*
		The card that each notification sits in
	*/
	function createChatNotificationCard(cardId){
		var card = document.createElement("div")
		if(cardId != "undefined"){
			card.id = cardId
		}
		card.classList.add("d-flex", "flex-column", "align-items-start", "chat-card","p-4")
		return card
	}

	/*
		Circular image icon that can be in a notification card
	*/
	function createChatProfileImageThumbnail(notification){
		img = document.createElement("img")
		img.classList.add("notification-thumbnail-image", "img-fluid", "rounded-circle", "mr-2")
		img.src = notification['from']['image_url']
		img.id = assignChatImgId(notification['notification_id'])
		return img
	}

	/*
		Timestamp at the bottom of each notification card
	*/
	function createChatTimestampElement(notification){
		var timestamp = document.createElement("p")
		timestamp.classList.add("small", "pt-2", "timestamp-text")
		timestamp.innerHTML = notification['natural_timestamp']
		timestamp.id = assignChatTimestampId(notification)
		return timestamp
	}

	/*
		Ex: "Hey what's up?"
		Ex: "This is a message from John. How are you..."
	*/
	function createUnreadChatRoomMessagesElement(notification){
		card = createChatNotificationCard()
		card.id = assignChatCardId(notification)
		card.addEventListener("click", function(){

            // THis iwll take the user to the chat room here
			chatRedirect(notification['actions']['redirect_url'])
		})

		var div1 = document.createElement("div")
		div1.classList.add("d-flex", "flex-row", "align-items-start")
		div1.id = assignChatDiv1Id(notification)

		img = createChatProfileImageThumbnail(notification)
		img.id = assignChatImgId(notification)
		div1.appendChild(img)

		var div2 = document.createElement("div")
		div2.classList.add("d-flex", "flex-column")
		div2.id = assignChatDiv2Id(notification)
		
		var title = document.createElement("span")
		title.classList.add("align-items-start")
		title.innerHTML = notification['from']['title']
		title.id = assignChatTitleId(notification)
		div2.appendChild(title)

		var chatRoomMessage = document.createElement("span")
		chatRoomMessage.id = assignChatroomMessageId(notification)
		chatRoomMessage.classList.add("align-items-start", "pt-1", "small", "notification-chatroom-msg")
		if(notification['verb'].length > 50){
			chatRoomMessage.innerHTML = notification['verb'].slice(0, 50) + "..."
		}
		else{
			chatRoomMessage.innerHTML = notification['verb']
		}
		div2.appendChild(chatRoomMessage)
		div1.appendChild(div2)
		card.appendChild(div1)
		card.appendChild(createChatTimestampElement(notification))
		return card
	}

    /*
    For paginated data coming in 
        Append a chat notification to the BOTTOM of the list.
       This is not for the new notif Remember the new one gets appended to the top 
	*/
	function appendBottomChatNotification(notification){

		switch(notification['notification_type']) {

			case "UnreadChatRoomMessages":
				chatNotificationContainer = document.getElementById("id_chat_notifications_container")
				card = createUnreadChatRoomMessagesElement(notification)
				chatNotificationContainer.appendChild(card)
				break;

			default:
				// code block
		}
	}

    

   

{/* </script> */}





	function assignChatDiv1Id(notification){
		return "id_chat_div1_" + notification['notification_id']
	}

	function assignChatImgId(notification){
		return "id_chat_img_" + notification['notification_id']
	}

	function assignChatTitleId(notification){
		return "id_chat_title_" + notification['notification_id']
	}

	function assignChatroomMessageId(notification){
		return "id_chat_message_" + notification['notification_id']
	}

	function assignChatDiv2Id(notification){
		return "id_chat_div2_" + notification['notification_id']
	}

	function assignChatTimestampId(notification){
		return "id_timestamp_" + notification['notification_id']
	}

	function assignChatCardId(notification){
		return "id_notification_" + notification['notification_id']
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
		Received a payload from socket containing chat notifications.
		Called:
			1. When page loads
			2. pagination
	*/
    export function handleChatNotificationsData(notifications, new_page_number){
    	if(notifications.length > 0){
    		clearNoChatNotificationsCard()
    		
    		notifications.forEach(notification => {

				submitChatNotificationToCache(notification)

				setChatNewestTimestamp(notification['timestamp'])
			})

			setChatPageNumber(new_page_number)
	    }
	}

/*
		Retrieve the number of unread chat notifications. (This is the red dot in the notifications icon)
		Called every CHAT_NOTIFICATION_INTERVAL
	*/
	export function getFirstChatNotificationsPage(){
		if("{{request.user.is_authenticated}}"){
			notificationSocket.send(JSON.stringify({
				"command": "get_chat_notifications",
				"page_number": "1",
			}));
		}
	}
	/*
		Display a card that says "You have no notifications"
	*/
	export function setupChatNotificationsMenu(){
		var notificationContainer = document.getElementById("id_chat_notifications_container")

		if(notificationContainer != null){
			setupChatDropdownHeader()

			card = createChatNotificationCard("id_no_chat_notifications")

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

/*
		Called when pagination is exhausted and there is no more notifications.
	*/
	export function setChatPaginationExhausted(){
		setChatPageNumber("-1")
	}

	export function setChatNotificationsCount(count){
		var countElement = document.getElementById("id_chat_notifications_count")
		if(count > 0){
			countElement.style.background = "red"
			countElement.style.display = "block"
			countElement.innerHTML = count
		}
		else{
			countElement.style.background = "transparent"
			countElement.style.display = "none"
		}
	}
	
	/*
		Keep track of the 'chat' newest notification in view. 
		When 'getNewChatNotifications' is called, it retrieves all the notifications newer than this date.
	*/
	export function setChatNewestTimestamp(timestamp){
		element = document.getElementById("id_chat_newest_timestamp")
		current = element.innerHTML
		if(Date.parse(timestamp) > Date.parse(current)){
			element.innerHTML = timestamp
		}
		else if(current == "" || current == null || current == "undefined"){
			element.innerHTML = timestamp
		}
	}
	export function setChatInitialTimestamp(){
		// ('%Y-%m-%d %H:%M:%S.%f')
		var today = new Date();
		var date = today.getFullYear() + "-01-01 01:00:00.000000"
		document.getElementById("id_chat_newest_timestamp").innerHTML = date
	}

	// setChatInitialTimestamp()

/*
		Sets the pagination page number.
	*/
	function setChatPageNumber(pageNumber){
		document.getElementById("id_chat_page_number").innerHTML = pageNumber
	}
/*
	/*
		Append to bottom. 
		Used for
			1. Page load
			2. pagination
			3. Refresh
		Called by 'handleChatNotificationsData' &  'refreshChatNotificationsData'
	*/
	export function submitChatNotificationToCache(notification){
		var result = chatCachedNotifList.filter(function(n){ 
			return n['notification_id'] === notification['notification_id']
		})
		// This notification does not already exist in the list
		if(result.length == 0){
			chatCachedNotifList.push(notification)

			// append to bottom of list
			appendBottomChatNotification(notification)
		}
		// This notification already exists in the list
		else{
			// find the div and update it.
			refreshChatNotificationsList(notification)
		}
	}
