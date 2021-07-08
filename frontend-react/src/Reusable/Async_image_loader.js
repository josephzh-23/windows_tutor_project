
    // the callback here is to set the image to 
    // what we are interested in 
	function preloadCallback(src, elementId){
		var img = document.getElementById(elementId)
		
		var replaced_url = src.replace("3000", "8000")
	// console.log(replaced_url);
		img.src = replaced_url
		
	}


    //elementId: id of each chat message 
	export function preloadImage(imgSrc, elementId){
		// console.log("attempting to load " + imgSrc + " on element " + elementId)
		var objImagePreloader = new Image();
		

		objImagePreloader.src = imgSrc;

		//Once calling image completes set that image to the element 
		if(objImagePreloader.complete){

			// preloadCallback(objImagePreloader.src, elementId);
			preloadCallback( objImagePreloader.src, elementId);

			objImagePreloader.onload = function(){};
		}
		else{
			// objImagePreloader.onload = function() {
				preloadCallback( objImagePreloader.src, elementId);
				//    clear onLoad, IE behaves irratically with animated gifs otherwise
				// objImagePreloader.onload=function(){};
			// }
		}
	}
	