import React, {createContext, useState} from 'react'
import { getCookie } from '../getCookie.js'

// Fxnal and class context are different 
export const UserContext = createContext()

// Need a provider 

export const UserContextProvider = (props) =>{


    // Value will be changed when logged in 
    const[authUser, setUser] = useState(
        {
            friendRequests: {},
             userId: sessionStorage.getItem("auth_userId"),
             csrfToken: getCookie("csrftoken"),
             isAuthenticated: true})

            
    // Need to wrap around children components 
    // so children have access to this 
    return (
        // Note here you have to pass in user and setUser specifically 
        <UserContext.Provider value = {{ authUser, setUser}}>
            {props.children}
        </UserContext.Provider>
    )
}