import { useContext, useEffect, useState } from "react"
import React from "react";
import axios from "axios";
import 'whatwg-fetch'
import '../assets/common.css'
import { UserContext } from "../Reusable/UserContext";
// Right now focused on buidling the user search page 

const SearchFriends= (props) => {


  var token = sessionStorage.getItem("token")
  const {authUser} = useContext(UserContext)
  const getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  const usernameRef = React.createRef();
  const [loading, setLoading] = useState(false);

  const [filteredUsers, setFilteredUsers] = useState([])
  var csrfToken = getCookie('csrftoken')
  useEffect(() => {
    setLoading(true);
  }, []);



  if (loading) {
    // return <p>Loading countries...</p>;
  }


  const searchUser = (e) => {
    e.preventDefault()
    var username = usernameRef.current.value

    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
  };

    // Make a get request instead
    axios.get(`http://127.0.0.1:8000/accounts/search/?q=${username}`).then(
      res => {
        console.log(res);
        setFilteredUsers(res.data)
      }).catch(err => {
        console.log(err)
      })

    console.log(csrfToken);
    var csrftoken = getCookie('csrftoken')
    var url = `http://127.0.0.1:8000/accounts/search`

  }


  const foundFriends = filteredUsers.map((friend, index) => {


    // <div class="card flex-row flex-grow-1 p-2 mx-2 my-2 align-items-center">
    // <div className="d-flex flex-row flex-wrap">

    return (
      <div key={index} className="card flex-row flex-grow-1 p-2 mx-2 my-2 align-items-center">
        <a className ="profile-link" 
          href = {`http://localhost:3000/profile/?userId=${friend[0].id}`}>
          <div className="card-image m-2">
            <img className="img-fluid profile-image"
             src= {`http://localhost:8000${friend[0].profile_image}`} alt="" />
          </div>
        </a>
        <a className="profile-link"
        //  href="{% url 'account:view' user_id=account.0.id %}"
          href = {`http://localhost:3000/profile/?userId=${friend[0].id}`}
        >
          <div className="card-center px-2">
            <h4 className="card-title">{friend[0].username}</h4>
            {/* {% if account.1 %}
                <p className="card-text"><a href="#" onclick="createOrReturnPrivateChat('{{account.0.id}}')">Send a Message</a></p>
                {% endif %}
                 */}
          </div>
        </a>
        <div className="d-flex flex-row card-right flex-grow-1 justify-content-end mx-2">
          {(friend[1] == true) ?
            <div className="d-flex flex-row friends-text-container p-3">
              <p className="friends-text m-auto">
                Friends
                  </p>
              <span className="material-icons checkmark-icon m-auto pl-2">
                check_circle_outline
                  </span>
            </div> :
            // Else if this is not you 
              (friend[0].id != authUser.userId) &&
            <div className="d-flex flex-row friends-text-container p-3">
              <p className="friends-text m-auto">
                Not Friends
                    </p>
              <span className="material-icons cancel-icon m-auto pl-2">cancel</span>
            </div>
          }
          {/* IF this this you  */}
          {(friend[0].id == authUser.userId) &&
            <div className="d-flex flex-row friends-text-container p-3">
              <p className="friends-text m-auto">
                This is you
                  </p>
              <span className="material-icons m-auto pl-2">
                person_pin
                  </span>
            </div>


          }
        </div>
        {(filteredUsers == null) &&
          <div className="d-flex flex-row flex-grow-1 justify-content-center align-items-center p-4">
            <p>No results</p>
          </div>}


      </div>

    )
  })


    // No need to delete this sectino; can be reused later 
        // const foundUsers = filteredUsers.map((user, index) => {

        //   return (

        //       <div className= "userBox" key={index}>
        //         <div>
        //           <p><b>User Email:   </b>
        //            {user.email}</p>


        //         <p> <b>My name is </b>
        //          {user.username}</p>

        //           <img className="img-fluid profile-image" src=
        //           {`http://localhost:8000${user.imageUrl}`} alt=""/>


        //           <a href={`http://localhost:3000/profile/?userId=${user.id}`}>Click on user</a>
        //           </div>



        //     </div>
        //   )
        //   }
      // )
    return (

    <div>


      <form onSubmit={searchUser} id="form">
        <div className="inputGroup">
          <label htmlFor="username">Please enter user name</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="abc@example.com"
            ref={usernameRef}
          />
        </div>

        <div style={{ flex: 1 }}>
          <input id="submit" className="btn btn-warning" type="submit" name="Add" />
        </div>
      </form>
      {foundFriends}
    </div>

  )


}


export default SearchFriends