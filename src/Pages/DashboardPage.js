// import React from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const DashboardPage = (props) => {
//   const [chatrooms, setChatrooms] = React.useState([]);
//   const chatroomRef = React.useRef()

//   const createChatRoom = () => {

//     console.log(chatroomRef)
    
//     axios
//       .post("http://localhost:8000/chatroom/createchatroom",
//       {roomname: chatroomRef.current.value,
//         userid:1 }
//         )
//       .then((response) => {
      
//         console.log(response.data)
//         setChatrooms(response.data);
//       })
//       .catch((err) => {
//         setTimeout(getChatrooms, 3000);
//       });

//       chatroomRef.current.value=""
//   };
//   const getChatrooms = () => {
//     axios
//       .get("http://localhost:8000/chatroom", {
//         headers: {
//           Authorization: "Bearer " + sessionStorage.getItem("CC_Token"),
//         },
//       })
//       .then((response) => {

//         console.log(response.data)
//         setChatrooms(response.data);
//       })
//       .catch((err) => {
//         setTimeout(getChatrooms, 3000);
//       });
//   };

//   React.useEffect(() => {
//     getChatrooms();
//     // eslint-disable-next-line
//   }, []);

//   return (
//     <div className="card">
//       <div className="cardHeader">Chatrooms</div>
//       <div className="cardBody">
//         <div className="inputGroup">
//           <label htmlFor="chatroomName">Chatroom Name</label>
//           <input
//             type="text"
//             name="chatroomName"
//             id="chatroomName"
//             placeholder="ChatterBox Nepal"
//             ref= {chatroomRef}
//           />
//         </div>
//       </div>
//       <button onClick={createChatRoom}>Create Chatroom</button>
//       <div className="chatrooms">
//         {chatrooms.map((chatroom) => (


//           <div key={chatroom.id} className="chatroom">
//             <div>{chatroom.name}</div>
//             <Link to={"/chatroom/" + chatroom.id}>
//               <div className="join">Join</div>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
