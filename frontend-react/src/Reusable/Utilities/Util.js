export var $ = function( id ) { return document.getElementById( id ); };


export const getCookie= (name)=> {
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


 export function displayLoadingSpinner(isDisplayed){
    var spinner = document.getElementById("id_loading_spinner")
    if(isDisplayed){
      spinner.style.display = "block"
    }
    else{
      spinner.style.display = "none"
    }
  }


