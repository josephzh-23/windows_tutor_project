// Can also be used to update a cookie by its value 
// Remember the ';' separator
export function set_cookie(cName,path, cValue, expDays) {
    let date = new Date();
    console.log("joseph");
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    var path = `path=/${path};`
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue +";" + path + expires + ";";

  
}


export function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded .split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res;
}


export function delete_private_chat_Cookie(cName) { 
    
    
    document.cookie = cName + "=" +"; path=/private_chat;" + 
    "expires=Thu, 01 Jan 1970 00:00:01 GMT"; 

}

export function delete_public_chat_Cookie(cName) { 
    
    
    document.cookie = cName + "=" +"; path=/public_chat;" + 
    "expires=Thu, 01 Jan 1970 00:00:01 GMT"; 

}
