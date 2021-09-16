
	// These are the globa var used for cropping 

import axios from "axios";
import { displayLoadingSpinner, getCookie } from "../Utilities/Util";


	var csrfToken = getCookie("csrftoken")
	var imageFile;
	var cropper;
	var base64ImageString;
	var cropX;
	var cropY;
	var cropWidth;
	var cropHeight;

	console.log('joseph')
	 export function enableImageOverlay(){
		var text = document.getElementById("id_text")
		text.style.backgroundColor = "#0066ff"
		text.style.color = "white"
		text.style.fontSize = "16px"
		text.style.padding = "16px 32px"
		text.style.cursor = "pointer"

		var profileImage = document.getElementById("id_profile_image")
		profileImage.style.opacity = "1"
		profileImage.style.display = "block"
		profileImage.style.width = "100%"
		profileImage.style.height = "auto"
		profileImage.style.transition = ".5s ease"
		profileImage.style.backfaceVisibility  = "hidden"
		profileImage.style.cursor = "pointer"


        // THis is the edit container
		var middleContainer = document.getElementById("id_middle_container")
		middleContainer.style.transition = ".5s ease"
		middleContainer.style.opacity = "0"
		middleContainer.style.position = "absolute"

		middleContainer.style.top = "50%"
		middleContainer.style.left = "50%"
		middleContainer.style.transform = "translate(-50%, -50%)"
		middleContainer.style.textAlign = "center"

		var imageContainer = document.getElementById("id_image_container")
		imageContainer.addEventListener("mouseover", function( event ) { 
			profileImage.style.opacity = "0.3"
			middleContainer.style.opacity = "1"
		})

		imageContainer.addEventListener("mouseout", function( event ) { 
			profileImage.style.opacity = "1"
			middleContainer.style.opacity = "0"
		})

		imageContainer.addEventListener("click", function(event){
			document.getElementById('id_profile_image').click();
		});

		var cropConfirm = document.getElementById("id_image_crop_confirm")
		cropConfirm.classList.remove("d-flex")
		cropConfirm.classList.remove("flex-row")
		cropConfirm.classList.remove("justify-content-between")
		cropConfirm.classList.add("d-none")
		
	}

	 export function disableImageOverlay(){
		var profileImage = document.getElementById("id_profile_image_display")
		var middleContainer = document.getElementById("id_middle_container")
		var imageContainer = document.getElementById("id_image_container")
		var text = document.getElementById("id_text")

		imageContainer.removeEventListener("mouseover", function( event ) { 
			profileImage.style.opacity = "0.3"
			middleContainer.style.opacity = "1"
		})

		imageContainer.removeEventListener("mouseout", function( event ) { 
			profileImage.style.opacity = "1"
			middleContainer.style.opacity = "0"
		})

		profileImage.style.opacity = "1"
		middleContainer.style.opacity = "0"
		text.style.cursor = "default"
		text.style.opacity = "0"

		document.getElementById('id_image_container').removeEventListener("click", function(event){
			event.preventDefault();
			// do nothing
		});
		document.getElementById('id_profile_image').addEventListener("click", function(event){
			event.preventDefault();
			// do nothing
		});

		var cropConfirm = document.getElementById("id_image_crop_confirm")
		cropConfirm.classList.remove("d-none")
		cropConfirm.classList.add("d-flex")
		cropConfirm.classList.add("flex-row")
		cropConfirm.classList.add("justify-content-between")


		// WHen confirm clicked will start cropping the image 
		var confirm = document.getElementById("id_confirm")
		confirm.addEventListener("click", function(event){

			//Will start cropping
			console.log("Sending crop data for processing...")
			cropImage(
				imageFile, 
				cropX, 
				cropY, 
				cropWidth,
				cropHeight
			)
		})

		var cancel = document.getElementById("id_cancel")
		cancel.addEventListener("click", function(event){
			console.log("Reloading window...")
			window.location.reload();
		})
	}


		/* return null if invalid or base64String if valid */
		function isImageSizeValid(image){
			console.log("max size: {{DATA_UPLOAD_MAX_MEMORY_SIZE}}")
			// console.log(image)

			// We want the character after "base64"
			var startIndex = image.indexOf("base64,") + 7;
			var base64str = image.substr(startIndex);
			var decoded = atob(base64str);

			console.log("FileSize: " + decoded.length);
			if(decoded.length>= 10485760){
				return null
			}
			return base64str
		}

		function cropImage(image, x, y, width, height){

			console.log(image)
			base64ImageString = isImageSizeValid(image)
	

			// Sending an ajax request down here 
			if(base64ImageString != null){
				var requestData = {
					"csrfmiddlewaretoken": "{{ csrf_token }}",
					"image": base64ImageString,
					"cropX": cropX,
					"cropY": cropY,
					"cropWidth": cropWidth,
					"cropHeight": cropHeight
				}
				displayLoadingSpinner(true)
				axios({
					method: 'POST',
					url: "http://127.0.0.1:8000/accounts/1/edit/cropImage/",
					data: requestData,
					headers: {
						Authorization: "Token " + sessionStorage.getItem("token"),
					   'Content-type':'application/json',
					   'X-CSRFToken': csrfToken
					}
					 }).then((res)=>{
						if(res.data.result == "success"){

							//Click cancel
							// document.getElementById("id_cancel").click()
							window.location.reload()
						}	
						else if(res.data.result == "error"){
							alert(res.data.result)
							
							document.getElementById("id_cancel").click()
							
						}
						displayLoadingSpinner(false)
					}).catch((err) => {
						// console.log(err);
					})
				}
			else{
				alert("Upload an image smaller than 10 MB");
				document.getElementById("id_cancel").click()
			}
		}

	// this is called when a new imge is selected
	// export function readURL(e) {

	// 	var input = e.target
		
	// 	// THis means sth is selected
    //     if (input.files && input.files[0]) {
    //         var reader = new FileReader();

    //         reader.onload = function (e) {
    //         	disableImageOverlay()
    //         	var image = e.target.result
    //         	var imageField = document.getElementById('id_profile_image_display')
    //             imageField.src = image
	// 			cropper = new Cropper(imageField, {
	// 				aspectRatio: 1/1,
	// 				crop(event) {
	// 					// console.log("CROP START")
	// 					// console.log("x: " + event.detail.x);
	// 					// console.log("y: " + event.detail.y);
	// 					// console.log("width: " + event.detail.width);
	// 					// console.log("height: " + event.detail.height);
	// 					// setImageCropProperties(
	// 					// 	image,
	// 					// 	event.detail.x,
	// 					// 	event.detail.y,
	// 					// 	event.detail.width,
	// 					// 	event.detail.height
	// 					// )
	// 				},
	// 			});
    //         };
    //         reader.readAsDataURL(input.files[0]);
    //     }
    // };

	
    export function setImageCropProperties(image, x, y, width, height){
		imageFile = image
		cropX = x
		cropY = y
		cropWidth = width
		cropHeight = height
	}
