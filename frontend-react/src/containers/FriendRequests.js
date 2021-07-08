import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { backend_url_friend, base_url_account } from "../Contants.js"
import { UserContext } from "../Reusable/UserContext.js"
import { successToast, errorToast } from "../Toaster.js"


export const FriendRequests = (params) => {
    // const {user, setUser} = useContext(UserContext)
    // var requests = JSON.parse(sessionStorage.getItem('fRequests'))
     
    const [requests, setRequests] = useState(
        {sendersData:[]}
    )

    const [friendRequestIds, setFriendRequestIds] = useState()


    useEffect(() => {
        var current_userId = sessionStorage.getItem('auth_userId')
        console.log(current_userId);
        getFriendRequests(current_userId)
        console.log(requests);

        return () => {
            // cleanup
        }
    },[])


    const declineFriendRequest = (friend_request_id)=>{

     
        axios.get(`${backend_url_friend}/decline_friend_request?friend_request_id=${friend_request_id}`,{
            headers: {Authorization: `Token ${sessionStorage.getItem('token')}`
          }}).then(
              res => {
            
                console.log(res.data);
      
              }).catch(err => {
                console.log(err)
              })

    }
    const getFriendRequests=(current_userId)=>{
        
        axios.get(`${backend_url_friend}/friendRequests/?userId=${current_userId}`,{
            headers: {Authorization: `Token ${sessionStorage.getItem('token')}`
          }} ).then(
              res => {
                console.log(res.data.sendersData);
                setRequests({...requests, sendersData: res.data.sendersData})
                setFriendRequestIds(res.data.friendRequestIds)
                
      
              }).catch(err => {
                console.log(err)
              })
      
    }

    const acceptFriendRequest=(requestId)=>{
        // console.log(requestId)
        axios.get(`${backend_url_friend}/friend_request_accept/?requestId=${requestId}`,
            {
            headers: {Authorization: `Token ${sessionStorage.getItem('token')}`
          }}).then(
            res => {


                if(!res.data.err){
                    successToast(res.data.response)
                }else{
                    errorToast(res.data.err)
                }

                // console.log("the resut ",extra.isFriend , extra.isSelf);
            }).catch(err => {
                console.log(err)
            })


    }
    
    return(

        
     <div className="container">
	<div className="card p-2">

	

                {console.log(requests)}
        {requests.sendersData.map((request,index)=>(
            <div key="{index}" className="d-flex flex-row flex-wrap">
                
		<div className="card flex-row flex-grow-1 p-2 mx-2 my-2 align-items-center">
			
            <a className="profile-link" href={`http://localhost:3000/account/accountView/userId=${request.id}`} alt="">
				<div className="card-image m-2">
					<img className="img-fluid profile-image" src={`http://localhost:8000${request.profile_image}`} alt=""/>
				</div>
			</a>
			<a className="profile-link" href="{% url 'account:view' user_id=request.sender.id %}">
				<div className="card-center px-2">
					<h4 className="card-title">{request.email}</h4>
				</div>
			</a>
            </div>
			<div className="d-flex flex-row card-right flex-grow-1 justify-content-end mx-2">
	  			{/* Carries the id of the request */}
                  <span  className="decline-friend-request material-icons p-1" 
                  onClick={()=>declineFriendRequest(friendRequestIds[index])}
                  >cancel</span>


	  			<span  className="confirm-friend-request material-icons p-1" 
                  onClick={()=>{
                      console.log(friendRequestIds)
                      acceptFriendRequest(friendRequestIds[index])}}
                  >check</span>
			</div>
            
            </div>
        ))}
    
		{/* In the case of no friend requestst */}
		{/* {(requests)&& 
		<div className="d-flex flex-row flex-grow-1 justify-content-center align-items-center p-4">
			<p>No results</p>
		</div>} */}
		</div>
	</div>
	
 )
}