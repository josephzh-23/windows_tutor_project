  
import { useContext, useEffect } from "react"
import { UserContext } from "../../Reusable_React/UserContext.js"

import { getRoomChatMessages, setupPublicChatWebSocket } from "./public_chat_fxn.js"

import './public_chat.css'



// This is used alongside with public chat room 

const Home = (params) => {
	const {authUser} = useContext(UserContext)


	useEffect(()=>{

		// scrollListener()
	// We need to pass our user to it 
	setupPublicChatWebSocket(authUser)

	scrollListener()
	},[])


	const scrollListener=()=>{

				/*
		Get the next page of chat messages when scrolled to the top 
		so that's why we have the scrollTop here 
	*/
		console.log("joseph");
		var chatLog = document.getElementById("id_chat_log")
		console.log(chatLog.scrollTop);
	document.getElementById("id_chat_log").addEventListener("scroll", function(e){
		var chatLog = document.getElementById("id_chat_log")
	
		chatLog.addEventListener("scroll", function(e){
			if ((Math.abs(chatLog.scrollTop) + 2) >= (chatLog.scrollHeight - chatLog.offsetHeight)) {
				getRoomChatMessages()
			}
		});
	})
	}

    return(


		
// If debug
		// Will show the public chat and page number if in debug, otherwise hide it 

<div className = "main">
<span className="page-number"  id="id_page_number">1</span>
	<div className="card-header">
		<div className="d-flex flex-row justify-content-between">
			<h3 className="">Public Chat</h3>
			<div className="d-flex flex-row align-items-center">
				<span className="material-icons m-auto pr-1 connected-users-icon">person_outline</span>
				<span className="m-auto connected-users" id="id_connected_users"></span>
			</div>
			
		</div>
	</div>

<div className="container">

<div className="card-header">
		
	<div className="d-flex flex-column">
	<div className="card-body p-1">
	<div className="d-flex flex-row justify-content-center" id="id_chatroom_loading_spinner_container">
			<div className="spinner-border text-primary"  id="id_chatroom_loading_spinner" role="status"  style={{display: "none"}}>
				<span className="sr-only">Loading...</span>
			</div>
		</div>
		<div className="d-flex chat-log" id="id_chat_log">		
	    	</div>
		<div className="d-flex chat-message-input-container">
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
	</div>
	      )
 
	
}

export default Home