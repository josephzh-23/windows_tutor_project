import axios from "axios"
import makeToast from "../Toaster.js"
import { displayLoadingSpinner, getCookie } from "./Util"

/*
The id:
     of the profile of the user we are looking at 

*/
export const sendBuddyRequest =(e, receiverId, uiUpdateFunction)=>{

    e.preventDefault()
    var csrfToken = getCookie('csrftoken')
    console.log(csrfToken);
    axios({
        method: 'POST',
        url: "http://127.0.0.1:8000/friend/friendRequest/",
        data: receiverId,
        headers: {
            Authorization: "Token " + sessionStorage.getItem("token"),
           'Content-type':'application/json',
           'X-CSRFToken': csrfToken
        }
         }).then((res)=>{

            console.log(res);
            if(res.data.response == "Friend request sent."){

                //update ui 
                makeToast("success" , res.data.response)    
            }	
            else if(res.data.response !=null){
                alert(res.data.response)
                
            }
            displayLoadingSpinner(false)
        }).catch((err) => {

            console.log(err);
            // alert('something went wrong ' + err)
        })

}