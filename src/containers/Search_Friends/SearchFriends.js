import { useContext, useEffect, useState } from "react"
import React from "react";
import axios from "axios";


import './SearchFriend.css'

import $ from "jquery"
import 'whatwg-fetch'
// import '../assets/common.css'
import '../../App.css'
import { UserContext } from "../../Reusable_React/UserContext";
import { scroll_to_bottom } from "../../Reusable_Vanilla/Scroll_to_bottom";
// Right now focused on buidling the user search page 

const SearchFriends = (props) => {






  var token = sessionStorage.getItem("token")
  const { authUser } = useContext(UserContext)
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

  var token = sessionStorage.getItem("token")

  // if($('#storeQuery').innerHTML!=""){

  //   setQuery($('#storeQuery').innerHTML)
  // }

  var pageNum= 0
  $( document ).ready(function() {
   pageNum= document.getElementById('id_page_number').innerHTML 
  })
 // We need a hack to prevent multiple firing of searchUser fxn
 // using this tracker 
 var fired = 1
  $(window).scroll(function () {

    

    //100 to account for the offset
    if ($(window).scrollTop() + $(window).height() + 100 > $(document).height()) {
      console.log('reached bottom');
      

      if(pageNum==="-1"){}
      else if (pageNum === "1"){}
      else if (pageNum!=="-1") {

  

        // THis fxn only fires if some data already returned from the functions
        //Check if a new page number is returned means >1, otherwise
        // nothing is loaded yet so don't fire this function

        if(fired<pageNum){
        setTimeout(function(){
          $('#submit').trigger("click")

          console.log('fired is', fired)
          fired++
        })
          // Fire an automatic click event
      //  searchUser(undefined)
       
      }
        
      
      }
    }
  });
  // If pag number set to -1, means exhuasted
  // usually start with 1 as the default 
  function setPageNumber(pageNumber) {

    // Once exhuatsed can't reset it 
    if(document.getElementById("id_page_number").innerHTML!="-1"){
    document.getElementById("id_page_number").innerHTML = pageNumber
    }
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

    if (typeof e !== 'undefined') {
      e.preventDefault()
    }
  

    toggleSpinner(true)

  
// loading in progress
    var pageNumber =document.getElementById("id_page_number").innerHTML 
  

    // Set header
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };

    var username =""
    
    if(query!=""){
      username = query
      $('#storeQuery').html(query)
      console.log('query is',   $('#storeQuery').html() )
    }else{
     username = $('#storeQuery').html()
    }


    console.log('username is ', username);


  
    // Make a get request instead
  
    if(fired<=pageNum){

      setTimeout(function(){
    axios.get(`http://127.0.0.1:8000/accounts/search/?q=${username}&pageNum=${pageNumber}`).then(
      res => {
        console.log(res.data);
        // setFilteredUsers(res.data.accounts)
        toggleSpinner(false)

        
        // WHy is exhuasted not returned
        console.log('exhausted is', res.data.exhausted);
        // Make sure data is not exhuasted
        if(res.data.exhausted===undefined){
          
          setFilteredUsers(
            
            [...filteredUsers,
          {
            id: res.data.accounts[0][0].id,
            username: res.data.accounts[0][0].username,
            image: res.data.accounts[0][0].profile_image
          }
        ]
        )
          console.log("new page number", res.data.new_page_number, fired);
          setPageNumber(res.data.new_page_number)

          console.log(filteredUsers);

        
    
        // Also store the query in html
        
        }else{

          setPageNumber(-1)
          console.log("the search is exhuasted");
        }
      }).catch(err => {
        console.log(err)
      })
  
    fired++
      
    },200)
  }
  }

  var toggleSpinner = (mode) => {

    if (mode == true) {


      document.getElementById('loader').style.display = "block"
    } else {
      document.getElementById('loader').style.display = "none"

    }

  }

  const foundFriends = filteredUsers.map((friend, index) => {


    // <div class="card flex-row flex-grow-1 p-2 mx-2 my-2 align-items-center">
    // <div className="d-flex flex-row flex-wrap">

    return (


      <div key={index} className="card flex-row flex-grow-1 p-2 mx-2 my-2 align-items-center">


        <a className="profile-link" id="profile-link"
          href={`http://localhost:3000/profile/?userId=${friend.id}`}>
          <div className="card-image m-2">
            <img className="img-fluid profile-image"
              src={`http://localhost:8000${friend.image}`} alt="" />
          </div>
        </a>
        <a className="profile-link"
          //  href="{% url 'account:view' user_id=account.0.id %}"
          href={`http://localhost:3000/profile/?userId=${friend.id}`}
        >
          <div className="card-center px-2">
            <h4 className="card-title">{friend.username}</h4>
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
            (friend.id != authUser.userId) &&
            <div className="d-flex flex-row friends-text-container p-3">
              <p className="friends-text m-auto">
                Not Friends
              </p>
              <span className="material-icons cancel-icon m-auto pl-2">cancel</span>
            </div>
          }
          {/* IF this this you  */}
          {(friend.id == authUser.userId) &&
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


  






  return (



    <div>



      {/* The number will start at 1 initially and 
      1 is for starting pagination
      -1 when exhausted */}
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

              value={query}
              placeholder="abc@example.com"
              onChange={(e) => setQuery(e.target.value)}

            /></div>
        </div>

        <div style={{ flex: 1 }}>
          <input id="submit" className="btn btn-warning" type="submit" name="Add" />
        </div>
      </form>
      {foundFriends}

      <div id="loader"></div>

      <div id="storeQuery" style={{display:"none"}}></div>
    </div>

      




  )



  
}


export default SearchFriends