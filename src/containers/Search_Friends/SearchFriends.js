import { useContext, useEffect, useState } from "react"
import React from "react";
import axios from "axios";

import $ from "jquery"
import 'whatwg-fetch'
// import '../assets/common.css'
import '../../App.css'
import { UserContext } from "../../Reusable_React/UserContext";
import { scroll_to_bottom } from "../../Reusable_Vanilla/Scroll_to_bottom";
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

  const [loading, setLoading] = useState(false);


  const [query, setQuery] = useState("")                                                                                                                                                                                                                     
  const [filteredUsers, setFilteredUsers] = useState([])
  var csrfToken = getCookie('csrftoken')
  useEffect(() => {


  

    $(window).scroll(function() {   
      console.log($(window).scrollTop(),$(window).height(), $(document).height());
     
      //100 to account for the offset
      if($(window).scrollTop() + $(window).height() +100> $(document).height()) {
            // alert("bottom!");
            console.log("the object", query);
          if(document.getElementById('id_page_number').innerHTML!="-1"){

            console.log("load tutor fired");
            load_more_tutors(query)
          }
        }
     });
    setLoading(true);
  }, []);

  function setPageNumber(pageNumber){
    document.getElementById("id_page_number").innerHTML = pageNumber
  }
  
  // Same as the search tutos function called when user scrolls to bottom

  //      c   c                    c              vv                    


  function load_more_tutors(query){


    toggleSpinner()
    
    if(document.getElementById('profile-link')!=null){
    // This means there is already some data returned
   if(document.getElementById('profile-link').innerHTML!="")
    // This is the page number to send to the backend
      var pageNumber = document.getElementById("id_page_number").innerHTML
      if(pageNumber == "-1"){
        setPageNumber("1") // loading in progress
        

        console.log('page number is',pageNumber)

    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
  };

    // Make a get request instead
    axios.get(`http://127.0.0.1:8000/accounts/search/?q=${query}&pageNum=${pageNumber}`).then(
      res => {
        console.log(res);


        toggleSpinner()
        // Add to the exiting users 
        setFilteredUsers([...filteredUsers, res.data])

        
      }).catch(err => {
        console.log(err)
      })

    console.log(csrfToken);
    var csrftoken = getCookie('csrftoken')
    var url = `http://127.0.0.1:8000/accounts/search`
    }
  }
}



  function handle_incoming_data(data){
      
    setPageNumber(data.pageNumber)

    // Add each user to the current var 
    data.user.forEach((user)=>{

    })
  }
/*
		Sets the pagination page number.
	*/
	function setGeneralPageNumber(pageNumber) {
		document.getElementById("id_general_page_number").innerHTML = pageNumber
  }
  
  	/*
			Called when pagination is exhausted and there is no more notifications.
		*/
	function setGeneralPaginationExhausted() {
		console.log("general pagination exhausted.")
		setGeneralPageNumber("-1")
	}




  const searchUser = (e) => {
    e.preventDefault()
    var username = query

    // setQuery("filled")
    console.log('username is ', username);
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
  };
 // This is the page number to send to the backend
 var pageNumber = document.getElementById("id_page_number").innerHTML
 if(pageNumber == "-1"){
   setPageNumber("1") // loading in progress
 }
    // Make a get request instead
    axios.get(`http://127.0.0.1:8000/accounts/search/?q=${username}&pageNum=${pageNumber}`).then(
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
       
       
        <a className ="profile-link"  id="profile-link"
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
  
      
      var toggleSpinner=()=>{

        var spinner = document.getElementById("loader")
        if(spinner.style.display = "block"){
            spinner.style.display="none"
        }else{
          spinner.style.display="block"
        }
      }
    return (


     
    <div>



<div className ="loader" id="loader">
</div>
    <span className="page-number" id="id_page_number">1</span>


      <form onSubmit={searchUser} id="form">
        <div className="inputGroup">
          <label htmlFor="username">Please enter user name or email to
          search for people</label>
          <div>
          <input
            type="text"
            name="username"
            id="username"

            value = {query}
            placeholder="abc@example.com"
          onChange={(e) => setQuery(e.target.value)}
          
          /></div>
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