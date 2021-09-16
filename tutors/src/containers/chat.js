  
import React from 'react';
import WebSocketInstance from '../websocket';
import{ useState ,useEffect, useRef} from "react"
// import ColumnGroup from 'antd/lib/table/ColumnGroup';

import { useHistory } from 'react-router-dom'


const Chat = (props) => {

    // To listen to the url changes 
    const history = useHistory() 
    var messagesEndRef = useRef()

    var messageRef = useRef()
    // The messages page 

    // For sending the single message


    // For retrieving the messages f
    var [state, setState] = useState({message:"",
    messages: []});

    const [name, setName] = useState("josephzh")
    /* Check if a new url is navigated to chatID changed 
     If changed, disconnect socket and move to new chat
     */

     useEffect(()=>{

        initializeChat();
     },[])
    useEffect(() => {
        // this.state = {message: ''}
        
           console.log("joseph")
           console.log(props.match.params.chatID)
     
    
        // if(props.match.params.chatID!== newProps.match.params.chatID){
        //     WebSocketInstance.disconnect()
        // }


        scrollToBottom();
        return () => {
            
            WebSocketInstance.disconnect();
            waitForSocketConnection(() => {
                WebSocketInstance.fetchMessages(
                  name,
                  props.match.params.chatID
                );
              });
              WebSocketInstance.connect(props.match.params.chatID);
        }
    },[props.match.params.chatID]);


 // Working principle
        // This is so to make sure connection = steady 
        // Before sending things, this works using recursion
        // so waitForSocketConnection() is continuously called with setTimeout()

    const initializeChat=()=> {

        
    
        // A 3 step process added to callbacks 
        // setMessages.bind(this)       we are setting the message
        // addMessage.bind(this)        add the message 
        // Fetch the user messages
        waitForSocketConnection(() => {
            WebSocketInstance.addCallbacks(setMessages.bind(this), addMessage.bind(this))
            
            // Need to be changed later 
             //Note props.username need to be hardcoded for now 
          WebSocketInstance.fetchMessages(
              name,
              props.match.params.chatID
          )
          });

       
  
          WebSocketInstance.connect(props.match.params.chatID)
        //   console.log()
    }
    const waitForSocketConnection= (callback=>{
        const component = this;
        setTimeout(
            function () {

                //Check ths state of socket 
            if (WebSocketInstance.state() === 1) {
                console.log("Connection is made");
                callback();
                return;
            } else {
                console.log("wait for connection...");
                waitForSocketConnection(callback);
            }
        }, 100);
    })
    

    // ComponentWillReceiveProps() 

    const addMessage= (message)=> {
        console.log("the value is ",state.messages);
        setState({messages: [...state.messages, message]})

    }
    
    const setMessages=(messages) =>{
        console.log("first value is "+state.messages);
        setState({messages:messages.reverse()})
    
    }

    const messageChangeHandler = (event) =>  {
           setState({message:event.target.value})
    }

    const sendMessageHandler = (e) => {
        e.preventDefault();
        const messageObject = {
            from: "josephzh",
            content: state.message,
            chatId: props.match.params.chatID
        };
        WebSocketInstance.newChatMessage(messageObject);
        messageRef.current.value = ""
        setState({ message: '' });
    }
      
    
    const renderTimestamp = timestamp => {
        let prefix = ''; 
        const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000);
        if (timeDiff < 1) { // less than one minute ago
            prefix = 'just now...';
        } else if (timeDiff < 60 && timeDiff > 1) { // less than sixty minutes ago
            prefix = `${timeDiff} minutes ago`;
        } else if (timeDiff < 24*60 && timeDiff > 60) { // less than 24 hours ago
            prefix = `${Math.round(timeDiff/60)} hours ago`;
        } else if (timeDiff < 31*24*60 && timeDiff > 24*60) { // less than 7 days ago
            prefix = `${Math.round(timeDiff/(60*24))} days ago`;
        } else {
            prefix = `${new Date(timestamp)}`;
        }
        return prefix
    }
    

    const scrollToBottom = () => {
        messagesEndRef.scrollIntoView({ behavior: "smooth" });
    }


    
    
    const renderMessages = (messages) => {
        
        const currentUser ='admin';
        return messages.map((message, i, arr) => (
            <li 
                key={message.id} 
                style={{marginBottom: arr.length - 1 === i ? '300px' : '15px'}}
                className={message.author === currentUser ? 'sent' : 'replies'}>
                <img src="http://emilcarlsson.se/assets/mikeross.png" />
                <p>{message.content}
                    <br />
                    <small>
                        {renderTimestamp(message.timestamp)}
                    </small>
                </p>
            </li>
        ));
    }


    const messages = state.messages
    return (
            
                    <div    style={{overflow: "scroll"}}>
                  <div className="messages">
                        <ul id="chat-log">
                        { 
                            messages && 
                           renderMessages(messages) 
                        }
                         <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { messagesEndRef= el; }}>
                    </div>
                        </ul>
                    </div>
                    <div className="message-input">
                        <form onSubmit={sendMessageHandler}>
                            <div className="wrap">
                                <input 
                                    onChange={messageChangeHandler}
                                    // value={message}
                                    required 
                                    id="chat-message-input" 
                                    type="text" 
                                    ref = {messageRef}
                                    placeholder="Write your message..." />
                                <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                                <button id="chat-message-submit" className="submit">
                                    <i className="fa fa-paper-plane" aria-hidden="true"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                    </div>
        );
    };

  
export default Chat;