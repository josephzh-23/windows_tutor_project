import React, { useEffect } from "react";
import axios from 'axios';


import  "../Profile/Profile.css";
import { disableImageOverlay, enableImageOverlay ,
    setImageCropProperties} from "../../Reusable/Utilities/croppingEditor.js"
import './UpdateAccount.css';

import Cropper from 'cropperjs';
import { makeToast } from "../../Toaster.js";
import { getCookie } from "../../Reusable/Utilities/Util";


const UpdateAccount = (params) => {


    var token = sessionStorage.getItem("token")
    console.log(token);
	var imageFile;
	var base64ImageString;
	var cropX;
	var cropX;
    var cropper;
	var cropWidth;
	var cropHeight;
    var csrfToken = getCookie('csrftoken')
    var username = ""
    var email = ""

    // By defining things like this, prevent the uncontroller input error
    const [profile, setProfile] = React.useState({
        account:{name:""}
    })



    const readURL=(e)=> {

        e.stopPropagation()
		var input = e.target
		
		// THis means sth is selected
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
            	disableImageOverlay()
            	var image = e.target.result
            	var imageField = document.getElementById('id_profile_image_display')
                imageField.src = image
				cropper = new Cropper(imageField, {
					aspectRatio: 1/1,
					crop(event) {
						// console.log("CROP START")
						// console.log("x: " + event.detail.x);
						// console.log("y: " + event.detail.y);
						// console.log("width: " + event.detail.width);
						// console.log("height: " + event.detail.height);
					 setImageCropProperties(
							image,
							event.detail.x,
							event.detail.y,
							event.detail.width,
							event.detail.height
						)
					},
				});
            };
            reader.readAsDataURL(input.files[0]);
        }
    };
    // Always have to make sure the user is loggeed infirst 
    const editUserData = (e)=>{
        e.preventDefault()

        console.log(csrfToken);
        axios(
            {
             method: 'POST',
           url: "http://127.0.0.1:8000/accounts/1/accountUpdate/",
           data:{
             username,
            email
           },
             headers: {
                Authorization: "Token " + sessionStorage.getItem("token"),
               'Content-type':'application/json',
               'X-CSRFToken': csrfToken
             }
            })
            .then(res => {

               
                console.log(res.data);
                makeToast("error", res.data)
                // console.log("the resut ",extra.isFriend , extra.isSelf);
            }).catch(err => {
                console.log(err)
            })


    }
    const fetchUserProfile = (userId) => {

        // Make a get request instead
        axios.get(`http://127.0.0.1:8000/accounts/accountView?userId=${userId}`).then(
            res => {

                console.log(res.data);
                
    
                setProfile({...profile, account: res.data.account})
                console.log(profile);

                // console.log("the resut ",extra.isFriend , extra.isSelf);
            }).catch(err => {
                console.log(err)
            })

    }
    const handleChange = (e)=>{

        setProfile({username: e.target.username,
        email: e.target.email})
    }


    React.useEffect(() => {

        // To activate the upoad file effect
        enableImageOverlay()
        
        var userId = sessionStorage.getItem('auth_userId')
        //Get the user 
        fetchUserProfile(userId)
    }, [])

    // Will dispaly user's stuff in the email field
    return (

        <div>
            {(profile)&&
            <div className="card-body">

            <div className="d-flex flex-column justify-content-center p-4">
            <div className="mb-2" id="id_image_crop_confirm">
		  			<span id="id_cancel" className="material-icons">cancel</span>
		  			<span id="id_confirm" className="material-icons">check</span>
		  		</div>
            <div className="image-container" id="id_image_container">
	  				<img className="border border-dark rounded-circle img-fluid mx-auto profileimage" id="id_profile_image_display"
                       src={`http://localhost:8000${profile.account.profile_image}`} />
				
                
                	<div className="middle" id="id_middle_container">
						<div className="text" id="id_text">Edit</div>
					</div>
		  		</div>
                <div className="d-flex flex-column justify-content-center p-4" encType="multipart/form-data">
                    <form onSubmit={editUserData} className="form-signin" method="post">

                        <input className="d-none" type="file" id="id_profile_image"
                            name="profile_image" 
                             onChange={e=> readURL(e)}/>
                        <h6 className="mt-4 field-heading">Email</h6>


                        <input type="email" name="email" id="id_input_email" className="form-control"
                            placeholder="Email address" required value={profile.account.email}
                            onChange = {handleChange} />
                        <h6 className="mt-4 field-heading">Username</h6>

                        <input type="text" name="username" id="id_input_username" className="form-control" placeholder="Username" required
                            value={profile.account.username}  onChange = {handleChange} />
                        <div className="mt-4 checkbox">
                            <label>
                                <input type="checkbox" name="hide_email" id="id_input_hide_email" />
              Hide Email
          </label>

                        </div>

                        <div className="d-flex flex-column mt-4">
                            <button className="mt-4 btn btn-primary flex-grow-1" type="submit">Save</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
}
        </div>
    )
}
export default UpdateAccount