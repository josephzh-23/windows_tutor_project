import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Reusable_React/UserContext.js"
import { getQueryStrings } from "../Reusable_Vanilla/getQueryStrings.js"


/*
THis is when you click on someone's friends 
Also, when you search for users, it will show if user is your friend or not

3. It tellss if you r friend with someone or not
*/
// This page is for when you want to see the friendlist of someone else. 
const FriendList = (props) => {

	const { authUser } = useContext(UserContext)
	const [data, setData] = useState({friends:[]})

	var friends = data.friends
	var viewee_user_id = getQueryStrings("userId")
	useEffect(() => {

		console.log(authUser);
		fetchAllFriends()
	}, [])

	const fetchAllFriends = (params) => {
		axios({
			method: 'GET',

			// Ex: when you click Stella's friends and you should see her friends
			url: `http://127.0.0.1:8000/friend/friend_list_view?user_id=${viewee_user_id}`,
			headers: {
				Authorization: "Token " + sessionStorage.getItem("token"),
				'Content-type': 'application/json',
				'X-CSRFToken': authUser.csrfToken
			}
		}).then((res) => {
			

			// What will be returned will be the 
			// [user1, whether mutual friend]
			// [user2, whether mutual friend]
			console.log(res.data.friends);

			
			setData({...data,friends:res.data.friends})
			
			console.log(authUser.userId);
			// console.log(data.friends);
			console.log(data.friends[0]);
			if (res.data.result == "success") {

				//Click cancel
				// document.getElementById("id_cancel").click()

			}
			else if (res.data.result == "error") {
				alert(res.data.result)

				document.getElementById("id_cancel").click()

			}
		}).catch((err) => {
			// console.log(err);
		})
	}

	return (
		
			<div className="container">
					<div className="joseph">Joseph</div>
				<div className="card p-2">

					{/* {(data.friends) && */}
						<div className="d-flex flex-row flex-wrap">
						
						{data.friends.map((friend, index) =>{ 
							return(
								<div key = {index}className="card flex-row flex-grow-1 p-2 mx-2 my-2 align-items-center">
									<a className="profile-link"
									
									href = {`http://localhost:3000/profile/?userId=${friend[0].id}`}>
										<div className="card-image m-2">

											{/* friend.0 means the 1st entry in the array returned  */}
											<img className="img-fluid profile-image" 

											src={`http://localhost:8000${friend[0].profile_image}`} alt=""/>
										</div>
									</a>

									<div className="card-center px-2">
										<a className="profile-link" 
										 href = {`http://localhost:3000/profile/?userId=${friend[0].id}`}>
											<h4 className="card-title">{ friend[0].username}</h4>
										</a>

										{/* If we can send a message
										means: we are mutual friends here  */}
										{(friend[1]) &&
											<a href="#"
											//  onClick="createOrReturnPrivateChat('{{friend.0.id}}')"
											 >Send a Message</a>
										}

									</div>


								{/* This is when you see sb's friend
								and who is also your friend */}
									<div className="d-flex flex-row card-right flex-grow-1 justify-content-end mx-2">
									
										{(friend[1] == true) ?
											<div className="d-flex flex-row friends-text-container p-3">
												<p className="friends-text m-auto">
													Friends
												</p>
												<span className="material-icons checkmark-icon m-auto pl-2">
													check_circle_outline
												</span>
											</div>:
										// {/* Else if this is not you */}
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
								</div>
						)})}
							</div>
	{/* } */}
		</div>
							
						
			</div>	  
				
			
						
	)
	

}
export default FriendList