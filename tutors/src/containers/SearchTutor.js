// import { useEffect , useState} from "react"
// import React from "react";
// import axios from "axios";
// import 'whatwg-fetch'
// import '../assets/common.css'
// // Right now focused on buidling the user search page 

// const SearchTutor = (props)=> {
 
//   const getCookie= (name)=> {
//     var cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         var cookies = document.cookie.split(';');
//         for (var i = 0; i < cookies.length; i++) {
//             var cookie = cookies[i].trim();
//             // Does this cookie string begin with the name we want?
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
//   }
//     const usernameRef = React.createRef();
//     const [loading, setLoading] = useState(false);

//     const [filteredUsers, setFilteredUsers] = useState([])
//     var csrfToken = getCookie('csrftoken')
//     useEffect(() => {
//         setLoading(true);
//       }, []);
    


//       if (loading) {
//         // return <p>Loading countries...</p>;
//       }
   
  
//       const searchUser = (e) => {
//         e.preventDefault()
//        var username = usernameRef.current.value
     
//        axios.defaults.headers = {
//         "Content-Type": "application/json",
//         Authorization: `Token ${token}`
//     };

//         // Make a get request instead
//         axios.get(`http://127.0.0.1:8000/accounts/search/?q=${username}`).then(
//           res=>{
//             console.log(res);
//             setFilteredUsers(res.data)
//           }).catch(err=>{
//             console.log(err)
//           })

//         console.log(csrfToken);
//         var csrftoken = getCookie('csrftoken')
//         var url = `http://127.0.0.1:8000/accounts/search`

//         }


//         const foundUsers = filteredUsers.map((user, index) => {
    
//           return (
          
//               <div className= "userBox" key={index}>
//                 <div>
//                   <p><b>User Email:   </b>
//                    {user.email}</p>

                          
//                 <p> <b>My name is </b>
//                  {user.username}</p>
                  
//                   <img className="img-fluid profile-image" src=
//                   {`http://localhost:8000${user.imageUrl}`} alt=""/>

      
//                   <a href={`http://localhost:3000/profile/?userId=${user.id}`}>Click on user</a>
//                   </div>

 
      
//             </div>
//           )
//           }
//       )
//       return (
    
//         <div>
        	
   
//         <form onSubmit = {searchUser} id="form">
//             <div className="inputGroup">
//               <label htmlFor="username">Please enter user name</label>
//               <input
//                 type="text"
//                 name="username"
//                 id="username"
//                 placeholder="abc@example.com"
//                 ref={usernameRef}
//               />
//             </div>
       
//             <div style={{flex: 1}}>
//                             <input id="submit" className="btn btn-warning" type="submit" name="Add" />
//                           </div>
//             </form>
//             {foundUsers}
//             </div>
           
//       )

  
// }


// export default SearchTutor