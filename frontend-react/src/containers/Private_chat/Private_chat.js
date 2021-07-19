import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { backend_url } from "../../Contants.js";
import { preloadImage } from "../../Reusable/Async_image_loader.js";
import { displayChatroomLoadingSpinner } from "../../Reusable/display_chatroom_loading_spinner.js";
import { UserContext } from "../../Reusable/UserContext.js";

import { appendChatMessage, closeWebSocket, enableChatLogScrollListener, getUserInfo, handleMessagesPayload, retrieve_user_info_payload, setupWebSocket } from "./Private_Chat_fxn.js"

import { errorToast, successToast } from "../../Toaster.js";
import { deleteCookie, delete_private_chat_Cookie, getCookie, set_cookie, set_cookie_private_chat } from "../../Reusable/Cookie.js";
import { getRoomChatMessages } from "../Public_chat/public_chat_fxn.js";
const Private_Chat = (params) => {
	var $ = function( id ) { return document.getElementById( id ); };
	var chatSocket;
	var roomId ;
	const { authUser } = useContext(UserContext)

	const [data, setData] = useState([])



	const display_private_page = (userId) => {

		// Make a get request instead
		axios.get(`http://127.0.0.1:8000/private_chat`, {
			headers: {
				Authorization: `Token ${sessionStorage.getItem('token')}`
			}
		}, { data: { userId: userId } }).then(
			res => {

				console.log(res);
				console.log(res.data.m_and_f);


				setData(res.data.m_and_f)

				onStart()
				console.log(data)



				// Call this fxn here 



				// setupChatDropdownHeader()
			}).catch(err => {
				console.log(err)
			})

	}

/*
		Retrieve the user information of the user other in the chat.
		- userd to retrive user using user id
	*/
	function getUserInfo(){
		chatSocket.send(JSON.stringify({
			"command": "get_user_info",
			"room_id": roomId,
		}));
	}


	function getRoomChatMessages(){
	var pageNumber = document.getElementById("id_page_number").innerHTML
	if(pageNumber != "-1"){
		setPageNumber("-1") // loading in progress
		chatSocket.send(JSON.stringify({
			"command": "get_room_chat_messages",
			"room_id": roomId,
			"page_number": pageNumber,
		}));
	}
}


function setPageNumber(pageNumber){
	$("id_page_number").innerHTML = pageNumber
}

	function onSelectFriend(e,userId) {
		e.preventDefault()
		createOrReturnPrivateChat(userId)

		clearHighlightedFriend()
		highlightFriend(userId)
	}

	// Using the user 2's id to fetch the data 
	const createOrReturnPrivateChat = (id) => {


		const payload = {
			"csrfmiddlewaretoken": authUser.csrfToken,
			"user2_id": id,
		}

		axios({
			method: 'POST',
			url: `${backend_url}/private_chat/create_or_get_private_chat/`,
			data: payload,
			headers: {
				Authorization: "Token " + sessionStorage.getItem("token"),
				'Content-type': 'application/json',
				'X-CSRFToken': authUser.csrfToken
			}
		}).then((res) => {

			console.log(res)
			if (res.data['response'].includes("Successfully got the chat")) {

				// successToast(res.data['response'])
				setupWebSocket(res.data['chatroom_id'])
			} else if (res.data['response'] != null) {
				errorToast(res.data['response'])
			}
		}).catch(err => {

			console.log(err);
		})
	}
	useEffect(() => {
		console.log("prviate chat now fired");
		display_private_page()

	}, [])

	const Found_Friends = data.map((x, id) => {

		console.log(x.friend);
		if (x.friend.id != authUser.userId) {
			return (



				<div key={id} className="d-flex flex-row p-2 friend-container flex-grow-1"

					onClick={(e) => onSelectFriend(e, x.friend.id)}
					id={`id_friend_container_${x.friend.id}`}
				>
					<img className="profile-image rounded-circle img-fluid" id={`id_friend_img_${x.friend.id}`} src="http://localhost:8000/media/dummy_image.jpeg" />
					<div className="d-flex flex-column">
						<span className="username-span">{x.friend.username}</span>
						<span className="friend-message-span">{x.message}</span>
					</div>
				</div>

			)
		}
	})


	// Wil set up the web socket here 
	function setupWebSocket(room_id) {

		console.log("setupWebSocket: " + room_id)

		roomId = room_id

		// close previous socket if one is open
		closeWebSocket()	

		// Correctly decide between ws:// and wss://
		var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
		// {% if debug_mode %}


		// Is the path right?
		var ws_path = ws_scheme + '://' + window.location.host + "/private_chat/" + roomId + "/"; // development

		var ws_path = ws_scheme + '://' + "localhost:8000" + "/private_chat/" + roomId + "/"; // development

		// {% else %}
		// var ws_path = ws_scheme + '://' + window.location.host + ":8001/chat/" + roomId + "/"; // production
		// {% endif %}

		console.log(ws_path);

		
		// Need this line to remove existing authorization cookie
		var cookie_found = getCookie("authorization");
		if (cookie_found !== undefined) {
			delete_private_chat_Cookie("authorization")
			console.log("cookie deleted");
		}


		var user_token = sessionStorage.getItem("token")
		document.cookie = set_cookie("authorization", "private_chat", user_token, 1)
		console.log("the cookie set is ", document.cookie);

		// console.log("Connecting to " + ws_path);
		chatSocket = new WebSocket(ws_path);


		// Handle incoming messages
		chatSocket.onmessage = function (message) {
			// Decode the JSON



			// document.cookie = "authorization= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
			console.log("Got chat websocket message " + message.data);
			console.log("Got websocket message.");
			var data = JSON.parse(message.data);

			// display the progress bar?
			displayChatroomLoadingSpinner(data.display_progress_bar)

			// Handle errors (ClientError)
			if (data.error) {
				console.error(data.error + ": " + data.message)
				return;
			}
			// Handle joining (Client perspective)
			if (data.join) {
				successToast("Joining room " + data.join);
				console.log("Joining room " + data.join);


				// When user joins get the user info
				getUserInfo()

				getRoomChatMessages()
				enableChatLogScrollListener()
			}
			// Handle leaving (client perspective)
			if (data.leave) {
				// do nothing
				console.log("Leaving room " + data.leave);

			}

			if (data.user_info) {
				console.log("user information retrieved");
				console.log(data.user_info);
				retrieve_user_info_payload(data.user_info)
			}

			// SO if a a standard new message, 
			// true: is for maintaining position (so you don't go to the bottom)
			if (data.msg_type == 0 || data.msg_type == 1 || data.msg_type == 2) {
				appendChatMessage(data, false, true)
			}

			// THis is for handling when there is new messages coming in 

			if (data.messages_payload) {
				handleMessagesPayload(data.messages, data.new_page_number)
			}
		};

		chatSocket.addEventListener("open", function (e) {
			console.log("ChatSocket OPEN")

			console.log('is singleton auth?', authUser.isAuthenticated);
			// join chat room
			// if(authUser.isAuthenticated){
			chatSocket.send(JSON.stringify({
				"command": "join",
				"room": roomId
			}));
			// }
		})

		chatSocket.onclose = function (e) {
			console.log('Chat socket closed.');
		};

		chatSocket.onOpen = function (e) {
			console.log("ChatSocket onOpen", e)
		}

		chatSocket.onerror = function (e) {
			console.log('ChatSocket error', e)
		}

		if (chatSocket.readyState == WebSocket.OPEN) {
			console.log("ChatSocket OPEN")
		} else if (chatSocket.readyState == WebSocket.CONNECTING) {
			console.log("ChatSocket connecting..")
		}


		/*sd
		For handling the user input when submitting and all that 
		*/

		document.getElementById('id_chat_message_input').focus();
		document.getElementById('id_chat_message_input').onkeyup = function (e) {
			if (e.keyCode === 13 && e.shiftKey) {  // enter + return
				// Handled automatically by textarea
			}
			else if (e.keyCode === 13 && !e.shiftKey) { // enter + !return
				document.getElementById('id_chat_message_submit').click();
			}
		};

		document.getElementById('id_chat_message_submit').onclick = function (e) {
			const messageInputDom = document.getElementById('id_chat_message_input');
			const message = messageInputDom.value;
			chatSocket.send(JSON.stringify({
				"command": "send",
				"message": message,
				"room": roomId
			}));
			messageInputDom.value = '';
		};
	}


	

	// Will load the actual user profile image once they are retrieved 
	function onStart() {

		// id_friend_img_{{unique_id}}
		// Each image will have a unique id 
		data.forEach(x => {

			
			// preloadImage("{{x.friend.profile_image.url|safe}}", "id_friend_img_{{x.friend.id}}")
			// console.log(`${x.friend}`);

			console.log(`${x.friend.profile_image}`);

			preloadImage(`${x.friend.profile_image}`, `id_friend_img_${x.friend.id}`)
		})
	}


	function highlightFriend(userId){
		// select new friend
		document.getElementById("id_friend_container_" + userId).style.background = "#f2f2f2"
	}


		/*
		Get the next page of chat messages when scrolls to bottom
	*/
	function chatLogScrollListener(e) {
		var chatLog = document.getElementById("id_chat_log")
		if ((Math.abs(chatLog.scrollTop) + 2) >= (chatLog.scrollHeight - chatLog.offsetHeight)) {
			getRoomChatMessages()
		}
	}
	
	function clearChatLog(){
		$('id_chat_log').innerHTML = ""
	}
	function closeWebSocket(){
		if(chatSocket != null){
			chatSocket.close()
			chatSocket = null
			clearChatLog()
			setPageNumber("1")
	
			disableChatLogScrollListener()
		}
	}
// When clicking on the new user, disable chat log
	//scroll listener

	function disableChatLogScrollListener(){

		$("id_chat_log").removeEventListener("scroll", chatLogScrollListener)
	}
	function enableChatLogScrollListener(){

		$("id_chat_log").addEventListener("scroll", chatLogScrollListener)
	}
	function getRoomChatMessages(){
		var pageNumber = document.getElementById("id_page_number").innerHTML
		if(pageNumber != "-1"){
			setPageNumber("-1") // loading in progress
			chatSocket.send(JSON.stringify({
				"command": "get_room_chat_messages",
				"room_id": roomId,
				"page_number": pageNumber,
			}));
		}}
	

	function clearHighlightedFriend(){

		console.log("does this exist ", data)
		if (data){
			data.forEach(x =>{

						console.log(x.friend.id)
				document.getElementById(`id_friend_container_${x.friend.id}`).style.background = ""
			})

		}
		// clear the profile image and username of current chat
		document.getElementById("id_other_user_profile_image").classList.add("d-none")
		document.getElementById("id_other_user_profile_image").src = "http://localhost:8000/media/dummy_image.jpeg"
		document.getElementById("id_other_username").innerHTML = ""
	}



	return (

		<div className="container">
			<div className="row">
				<div className="col-sm-9 m-0 p-2">
					<div className="card" id="id_chatroom_card">

						<div className="d-flex flex-row align-items-center card-header" id="id_room_title">
							<a className="d-flex flex-row" target="_blank" id="id_user_info_container">
								<img className="profile-image rounded-circle img-fluid" id="id_other_user_profile_image"
									src="http://localhost:8000/media/dummy_image.jpeg" />
								<h3 className="ml-2" id="id_other_username"></h3>
							</a>

						</div>
						<div className="card-body p-1">
							<div className="d-flex flex-column" id="id_chat_log_container">

								<div className="d-flex flex-row justify-content-center" id="id_chatroom_loading_spinner_container">
									<div className="spinner-border text-primary" id="id_chatroom_loading_spinner" role="status"
										style={{ display: "none" }}
									>
										<span className="sr-only">Loading...</span>
									</div>
								</div>
								<div className="d-flex chat-log" id="id_chat_log">

								</div>
								<span className="{% if not debug %}d-none{% endif %} page-number" id="id_page_number">1</span>

								<div className="d-flex flex-row chat-message-input-container">
									<textarea className="flex-grow-1 chat-message-input" id="id_chat_message_input"></textarea>
									<button className="btn btn-primary chat-message-submit-button">
										<span id="id_chat_message_submit" className="material-icons">send
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="col-sm-3 m-0 p-2">
					<div className="card">
						<div className="d-flex flex-row align-items-center card-header">
							<h3 >Friends</h3>
						</div>
						<div className="card-body p-1">
							<div className="d-flex flex-column friends-list-container ">


								{Found_Friends}

							</div>

						</div>
					</div>
				</div>
			</div>
		</div>

	)

}



export default Private_Chat