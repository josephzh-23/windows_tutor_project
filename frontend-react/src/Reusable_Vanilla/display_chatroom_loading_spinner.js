// // TO handle hiding and displaying the spinner 
export function displayChatroomLoadingSpinner(isDisplayed){
    var spinner = document.getElementById("id_chatroom_loading_spinner")
    if(isDisplayed){
        spinner.style.display = "block"
    }
    else{
        spinner.style.display = "none"
    }
}