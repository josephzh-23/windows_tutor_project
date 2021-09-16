/*

This class follows the single instance pattern

1. callback: containing all the fxns to be called 

- will contain a list of commaands for either a "message" or
"newMessage"

2. Look at addCallbacks()
- can be used in all classes 
*/
class WebSocketService {

    static instance = null;
    callbacks = {};
  
    static getInstance() {
      if (!WebSocketService.instance) {
        WebSocketService.instance = new WebSocketService();
      }
      return WebSocketService.instance;
    }
  
    // Make sure emtpy
    constructor() {
      this.socketRef = null;
    }
  
    disconnect(){

      this.socketRef.close()
    }
    //This needs to be called in index.js class
    connect(chatUrl) {
      console.log("the value is" +chatUrl);
      const path = `ws://127.0.0.1:8000/ws/chat/${chatUrl}/`;
      this.socketRef = new WebSocket(path);
      this.socketRef.onopen = () => {
        console.log('WebSocket open');
      };
      this.socketNewMessage(JSON.stringify({
        command: 'fetch_messages'
      }));
      this.socketRef.onmessage = e => {
        this.socketNewMessage(e.data);
      };
      this.socketRef.onerror = e => {
        console.log(e.message);
      };
      this.socketRef.onclose = () => {
        console.log("WebSocket closed let's reopen");
        this.connect();
      };
    }
  
    // Make a new socket message 
    socketNewMessage(data) {
      const parsedData = JSON.parse(data);
      const command = parsedData.command;
      if (Object.keys(this.callbacks).length === 0) {
        return;
      }
      if (command === 'messages') {
        this.callbacks[command](parsedData.messages);
      }
      if (command === 'new_message') {
        this.callbacks[command](parsedData.message);
      }
    }
  
    // Use username and chatId both 
    fetchMessages(username, chatId) {
      this.sendMessage({ command: 'fetch_messages', name: username ,
    chatId: chatId});
    }
  
    //Constructing new chat message here 
    //Below are all things needed for new message 
    newChatMessage(message) {
      this.sendMessage({ command: 'new_message', from: message.from, message:
       message.content,
       chatId: message.chatId}); 
    }
  
    //msgCallbacks : name of callbacks 
    // 
    // Here the 2 callbacks are setMessages and addMessages as well
    addCallbacks(messagesCallback, newMessageCallback) {
      this.callbacks['messages'] = messagesCallback;
      this.callbacks['new_message'] = newMessageCallback;
    }
    
    sendMessage(data) {
      try {
        this.socketRef.send(JSON.stringify({ ...data })).then(res=>{
           console.log(res.data)
        })
      }
      catch(err) {
        console.log(err.message);
      }  
    }
  
    state() {
      return this.socketRef.readyState;
    }
  
  }
  
  const WebSocketInstance = WebSocketService.getInstance();
  
  export default WebSocketInstance;