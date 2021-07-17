
//Contain all the function for handling user input
// in public chat page 

import { preloadImage } from "../../Reusable/Async_image_loader.js"
import auth_user from "../../Reusable/auth_user.js"
import { delete_public_chat_Cookie, getCookie, set_cookie } from "../../Reusable/Cookie.js";


	function $(element) {
	return document.getElementById(element);
	}
	var authUser = auth_user.getInstance()
	var logged_in_user
	//The needed var for the socket
	var ws_scheme = ""
	var ws_path = ""
    var message = ""
    var uName =""
    var user_id = ""
    var profile_image= ""

	var public_chat_socket
	var msg_id = 0
    var room_id = 1
	var timestamp
	
	export function setupPublicChatWebSocket(user){

		console.log(user);

		// The currently logged in user 
		authUser.user_id= sessionStorage.getItem("auth_userId")
		console.log("auth id " +authUser.user_id);
		// Correctly decide between ws:// and wss://
		// ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";

		ws_scheme = "ws"
		// {% if debug_mode %}
		ws_path = ws_scheme + '://' + window.location.host + `/public_chat/${room_id}/`; 
            // development
		// {% else %}

        // Notice here 8001 is the production url 
			// var ws_path = ws_scheme + '://' + window.location.host + ":8001/public_chat/{{room_id}}/"; 
            // production
		// {% endif %}

    	 ws_path = ws_scheme + '://' + "localhost:8000" + `/public_chat/${room_id}/`; 
	
		 // Try configuring the web socket this way
		public_chat_socket = new WebSocket(ws_path);

		setup_cookie_in_socket()
	
		// Handle incoming messages
		public_chat_socket.onmessage = function(message) {
			console.log("Got chat websocket message " + message.data);
			var data = JSON.parse(message.data);
			
			displayChatroomLoadingSpinner(data.display_progress_bar)
            // Handle errors (ClientError)
			if (data.error) {
				console.error(data.error + ": " + data.message)
				showClientErrorModal(data.message)
				return;
			}
			// Handle joining (Client perspective)
			// WHen user joins here 
			if (data.join) {
				getRoomChatMessages()
				console.log("Joining public room " + data.join);
				// TODO: Query previous chatroom messages
			}


			// Case 1 
			// When user enters a message into chat box 
			// Handle getting a message

			// Want to maintain position
			if (data.msg_type == 0) {
				
				appendChatMessage(data, true, true)
			}

			else if (data.msg_type ==1){

				set_num_connected_users(data.connected_user_count)
			}

			//Used to query next page of data
			if(data.messages_payload){
				console.log(data);
				handleMessagesPayload(data.messages, data.new_page_number)
			}
		};


		// Listen for user scroll to the bottom of the page  
		// 
		public_chat_socket.addEventListener("open", function(e){
			console.log("Public ChatSocket OPEN")

			
            if(user.isAuthenticated){	
                public_chat_socket.send(JSON.stringify({
                    "command": "join",
					"room": room_id,
					 "token": sessionStorage.getItem("token"),
                }))
            }
		})

		public_chat_socket.onclose = function(e) {
			console.error('Public ChatSocket closed.');
		};

		public_chat_socket.onOpen = function(e){
			console.log("Public ChatSocket onOpen", e)
		}

		public_chat_socket.onerror = function(e){
	        console.log('Public ChatSocket error', e)
			
	    }

	    if (public_chat_socket.readyState == WebSocket.OPEN) {
	    	console.log("Public ChatSocket OPEN")
	    } else if (public_chat_socket.readyState == WebSocket.CONNECTING){
	        console.log("Public ChatSocket connecting..")
	    }

		document.getElementById('id_chat_message_input').focus();
		document.getElementById('id_chat_message_input').onkeyup = function(e) {
			if (e.keyCode === 13 && e.shiftKey) {  // enter + return
				// Handled automatically by textarea
			}
			else if(e.keyCode === 13 && !e.shiftKey){ // enter + !return
				document.getElementById('id_chat_message_submit').click();
			}
		};

	    document.getElementById('id_chat_message_submit').onclick = function(e) {
			const messageInputDom = document.getElementById('id_chat_message_input');
			const message = messageInputDom.value;

			// console.log(room_id);
			public_chat_socket.send(JSON.stringify({

				//  For when first sending the message
				"command": "send",
				"message": message,
				"X-CSRFToken": user.csrfToken,
				// "token": sessionStorage.getItem("token"),
				"room_id":room_id,
				"user_id": user_id
			}));
			messageInputDom.value = '';
		};
	}

	
	function appendChatMessage(data , maintainPosition, isNewMessage ){
		message = data['message']
		uName = data['username']
		user_id = data['user_id']
		profile_image = data['profile_image']

		timestamp = data['natural_timestamp']
		console.log('username is', uName);
		//Used to identify each individual message in the chat 
		// every msg has a unique primary key 
		 msg_id = data['msg_id']
		var msg = message + '\n';
		var username = uName + ": "
		createChatMessageElement(msg, msg_id,  username, profile_image, user_id, timestamp,
			maintainPosition, isNewMessage)

			/*
		Get the next page of chat messages when scrolled to the top 
		so that's why we have the scrollTop here 
	*/

	}

	function showClientErrorModal(message){
		document.getElementById("id_client_error_modal_body").innerHTML = message
		document.getElementById("id_trigger_client_error_modal").click()
	}
    // Internal
	function createChatMessageElement(msg,msg_id, username, profile_image, user_id,
		/*
		MaintainPosition: whether the scroll bar should keep its position
		
		*/
		timestamp,maintainPosition, isNewMessage){
			

			
		authUser = auth_user.getInstance()

	var chatLog = document.getElementById("id_chat_log")

		var newMessageDiv = document.createElement("div")
		newMessageDiv.classList.add("d-flex")
		newMessageDiv.classList.add("flex-row")
		newMessageDiv.classList.add("message-container")

		var profileImage = document.createElement("img")
		profileImage.addEventListener("click", function(e){
			selectUser(user_id)
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
		usernameSpan.addEventListener("click", function(e){
			selectUser(user_id)
		})
		usernameSpan.classList.add("username-span")
		usernameSpan.innerHTML = username
		div2.appendChild(usernameSpan)

		var timestampSpan = document.createElement("span")
		timestampSpan.innerHTML = timestamp
		timestampSpan.classList.add("timestamp-span")
		timestampSpan.classList.add("d-flex")
		timestampSpan.classList.add("align-items-center")
		timestampSpan.addEventListener("click", function(e){
			selectUser(user_id)
		})
		div2.appendChild(timestampSpan)

		div1.appendChild(div2)

		var msgP = document.createElement("p")
		msgP.innerHTML = msg
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

			// THis makes the vertical bar scroll all the way to the bottom

			chatLog.scrollTop = chatLog.scrollHeight
				
		// console.log(chatLog.scrollTop,"", chatLog.scrollHeight);
			// window.scrollTo(0,document.body.scrollHeight);
		}else{

			// window.scrollTo(0,document.body.scrollHeight);
		}

		// now that a default image is showing, load the actual image.
		preloadImage(profile_image, profile_image_id) // called from base_js.html
	}


	function setPageNumber(pageNumber){

		document.getElementById("id_page_number").innerHTML = pageNumber
	}

	function setPaginationExhausted(){

		// THis prevents the user from searching for more pages 
		setPageNumber("-1")
	}


	
	/*
		Retrieve the chat room messages given the page number.
	*/
	export function getRoomChatMessages(){
		var pageNumber = document.getElementById("id_page_number").innerHTML
		
	
		// Prevent from querying same page again 
		if(pageNumber != "-1"){

		//This mesans a query is in pgress
			// We don't want the query to keep hitting the page again

			//Query is in progress here, disable query from getting executed
			//again and again
			setPageNumber("-1") // Do not allow any other queries while one is in progress
			public_chat_socket.send(JSON.stringify({
				"command": "get_room_chat_messages",
				"room_id": room_id,
				"page_number": pageNumber,
			}));
		}
	}
	// /*
	
	 // THis included in the home.js 

	// 	Get the next page of chat messages when scrolls to bottom
	// */
	// document.getElementById("id_chat_log").addEventListener("scroll", function(e){
	// 	var chatLog = document.getElementById("id_chat_log")
	// 	chatLog.addEventListener("scroll", function(e){
	// 		if ((Math.abs(chatLog.scrollTop) + 2) >= (chatLog.scrollHeight - chatLog.offsetHeight)) {
	// 			getRoomChatMessages()
	// 		}
	// 	});
	// })

	//This is triggered when page first loads and 
	// Also when user scrolls to the top using the listener function

	function handleMessagesPayload(messages, new_page_number){

		
		if(messages != null && messages != "undefined" && messages != "None"){
			setPageNumber(new_page_number)
			messages.forEach(function(message){

				//want to maintain position
				appendChatMessage(message, true, false)
			})
		}
		else{
			setPaginationExhausted() // no more messages
		}
	}


	

	// // TO handle hiding and displaying the spinner 
	function displayChatroomLoadingSpinner(isDisplayed){
		var spinner = document.getElementById("id_chatroom_loading_spinner")
		if(isDisplayed){
			spinner.style.display = "block"
		}
		else{
			spinner.style.display = "none"
		}
	}


	 // Used to open up the user profile page 
	function selectUser(user_id){

		var url = `http://localhost:3000/profile?userId=${user_id}`

		var win = window.open(url, "blank")
		win.focus()
	}



	// SHowing the number of conencted users 
	function set_num_connected_users(count){
		

		$('id_connected_users').innerHTML = count
	
	}

	function setup_cookie_in_socket(){

	// Need this line to authenticate the user
	document.cookie = ""

	// Expire the previous authorization cookie
	// Need this line to remove existing authorization cookie
	var cookie_found = getCookie("authorization");
	if (cookie_found !== undefined) {
		delete_public_chat_Cookie("authorization")
		console.log("public cookie deleted");
	}
	var user_token = sessionStorage.getItem("token")
	console.log("the user token is ", user_token);

	// document.cookie = set_cookie("authorization","public_chat", user_token, 1)
	
	}
	
