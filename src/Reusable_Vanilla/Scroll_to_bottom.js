import $ from "jquery"

// Runs the callback when this reaches the bottom
export function scroll_to_bottom(){

    console.log($(window).scrollTop(),$(window).height(), $(document).height());
    $(window).scroll(function() {   
        if($(window).scrollTop() + $(window).height() >= $(document).height()) {
            // alert("bottom!");

        }
     });

}