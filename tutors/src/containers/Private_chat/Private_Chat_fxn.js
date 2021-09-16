/*
		Build a new ChatMessage element and append to the list
	*/

	import axios from "axios"
import { backend_url } from "../../Contants.js"
import { preloadImage } from "../../Reusable_Vanilla/Async_image_loader.js"
	import auth_user from "../../Reusable_React/auth_user.js"
import { delete_private_chat_Cookie, getCookie, set_cookie } from "../../Reusable_Vanilla/Cookie.js"
import { displayChatroomLoadingSpinner } from "../../Reusable_Vanilla/display_chatroom_loading_spinner.js"
import { errorToast, successToast } from "../../Toaster.js"


function $(element) {
	return document.getElementById(element);
	}
	var msg_id 
	var roomId;
	var chatSocket;
	var authUser = auth_user.getInstance()
	export function createChatMessageElement(msg, msg_id, username, profile_image, user_id, timestamp, maintainPosition, isNewMessage){
		var chatLog = document.getElementById("id_chat_log")

		var newMessageDiv = document.createElement("div")
		newMessageDiv.classList.add("d-flex", "flex-row", "message-container")

		var profileImage = document.createElement("img")
		profileImage.addEventListener("click", function(e){
			// selectUser(user_id)
		})
		profileImage.classList.add("profile-image")
		profileImage.classList.add("rounded-circle")
		profileImage.classList.add("img-fluid")


		profileImage.src = ""
		var profile_image_id = "id_profile_image_" + msg_id
		profileImage.id = profile_image_id
		newMessageDiv.appendChild(profileImage)

		var div1 = document.createElement("div")
		div1.classList.add("d-flex")
		div1.classList.add("flex-column")

		var div2 = document.createElement("div")
		div2.classList.add("d-flex")
		div2.classList.add("flex-row")

		var usernameSpan = document.createElement("span")
		usernameSpan.innerHTML = username
		usernameSpan.classList.add("username-span")
		usernameSpan.addEventListener("click", function(e){
			// selectUser(user_id)
		})
		div2.appendChild(usernameSpan)

		var timestampSpan = document.createElement("span")
		timestampSpan.innerHTML = timestamp

		timestampSpan.classList.add("timestamp-span")
		timestampSpan.classList.add("d-flex")
		timestampSpan.classList.add("align-items-center")
		timestampSpan.addEventListener("click", function(e){
			// selectUser(user_id)
		})
		div2.appendChild(timestampSpan)

		div1.appendChild(div2)

		var msgP = document.createElement("p")
		msgP.innerHTML = window.validateText(msg)
		msgP.classList.add("msg-p")
		div1.appendChild(msgP)

		newMessageDiv.appendChild(div1)

		if(isNewMessage){
			chatLog.insertBefore(newMessageDiv, chatLog.firstChild)
		}
		else{
			chatLog.appendChild(newMessageDiv)
		}
		
		if(!maintainPosition){
			chatLog.scrollTop = chatLog.scrollHeight
		}

		preloadImage(profile_image, profile_image_id)
    }
    

    export function appendChatMessage(data, maintainPosition, isNewMessage){
		var messageType = data['msg_type']
		  msg_id = data['msg_id']
		var message = data['message']
		var uName = data['username']
		var user_id = data['user_id']
		var profile_image = data['profile_image']
		var timestamp = data['natural_timestamp']
		console.log("append chat message: " + messageType)
		
		var username = uName + ": "
		var msg = message + '\n'

		// Determine type of msg
		
		// determine what type of msg it is
		switch (messageType) {
			case 0:
				// new chatroom msg
				username = uName + ": "
				msg = message + '\n'
				createChatMessageElement(msg, msg_id, username, profile_image, user_id, timestamp, maintainPosition, isNewMessage)
				break;
			case 1:
				// User joined room
				createConnectedDisconnectedElement(message, msg_id, profile_image, user_id)
				break;
			case 2:
				// User left room
				createConnectedDisconnectedElement(message, msg_id, profile_image, user_id)
				break;
			default:
				console.log("Unsupported message type!");
				return;
		}
	}
    

	export function createConnectedDisconnectedElement(msg, msd_id, profile_image, user_id){
		var chatLog = document.getElementById("id_chat_log")

		var newMessageDiv = document.createElement("div")
		newMessageDiv.classList.add("d-flex")
		newMessageDiv.classList.add("flex-row")
		newMessageDiv.classList.add("message-container")

		var profileImage = document.createElement("img")
		profileImage.addEventListener("click", function(e){
			// selectUser(user_id)
		})
		profileImage.classList.add("profile-image", "rounded-circle", "img-fluid")
		// profileImage.classList.add("rounded-circle")
		// profileImage.classList.add("img-fluid")
		profileImage.src = ""
		var profile_image_id = "id_profile_image_" + msg_id
		profileImage.id = profile_image_id
		newMessageDiv.appendChild(profileImage)

		var usernameSpan = document.createElement("span")
		usernameSpan.innerHTML = msg
		usernameSpan.classList.add("username-span")
		usernameSpan.addEventListener("click", function(e){
			// selectUser(user_id)
		})
		newMessageDiv.appendChild(usernameSpan)

		chatLog.insertBefore(newMessageDiv, chatLog.firstChild)

		preloadImage(profile_image, profile_image_id)
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
	Add a header to the dropdown so users can visit /chat/
*/


// Take the user to the private chat room page 
function setupChatDropdownHeader() {

	var span1
	var span2
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


function setPageNumber(pageNumber){
	$("id_page_number").innerHTML = pageNumber
}

function setPaginationExhausted(){
	setPageNumber("-1")
}




function chatRedirect(url) {
	window.location.href = url
}



function selectUser(user_id){
	// Weird work-around for passing arg to url
	var url = "{% url 'account:view' user_id=53252623623632623 %}".replace("53252623623632623", user_id)
	var win = window.open(url, "_blank")
	win.focus()
}


export function handleMessagesPayload(messages, new_page_number){
	if(messages != null && messages != "undefined" && messages != "None"){
		setPageNumber(new_page_number)
		messages.forEach(function(message){
			appendChatMessage(message, true, false)
		})
	}
	else{
		setPaginationExhausted() // no more messages
	}
}





// This will retrive the user information
// And display it on the left 
	export function retrieve_user_info_payload(user){


	$("id_other_username").innerHTML = user.username
	$("id_other_user_profile_image").classList.remove("d-none")
	$("id_user_info_container").href= `http://localhost:3000/account/accountView/userId=${user.id}`
	
	
	preloadImage(user['profile_image'], "id_other_user_profile_image")
	}



	function showClientErrorModal(message){
		document.getElementById("id_client_error_modal_body").innerHTML = message
		document.getElementById("id_trigger_client_error_modal").click()
	}

