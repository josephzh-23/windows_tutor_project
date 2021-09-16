import React, {createContext, useState} from 'react'
import { getCookie } from '../getCookie.js'

// Fxnal and class context are different 
export const UserContext = createContext()

// Need a provider 

export const UserContextProvider = (props) =>{


    // This will be passed around 
    // setUser used as a callback 
    const[authUser, setUser] = useState(
        {
            friendRequests: {},
            // username: sessionStorage.getItem("username"),
             userId: sessionStorage.getItem("auth_userId"),
             csrfToken: getCookie("csrftoken"),
            //  isAuthenticated:sessionStorage.getItem("isAuthenticated"),
            isAuthenticated:true,

            username: sessionStorage.getItem("username")
            })

            
    // Need to wrap around children components 
    // so children have access to this 
    return (
        // Note here you have to pass in user and setUser specifically 
        <UserContext.Provider value = {{ authUser, setUser}}>
            {props.children}
        </UserContext.Provider>
    )
}