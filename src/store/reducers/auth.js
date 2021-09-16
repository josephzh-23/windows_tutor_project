// Right now we don't really need any reducers 

// They are only for changing the states of the functions 


import {createContext} from "react";
import { updateObject } from '../utility';


// THis is imported in parent componnent 

export const loginStateContext = createContext({})
const initialState = {
    token: null,
    username: null,
    error: null, 
    loading: false
}

const authStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
}

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        name: action.username,
        error: null,
        loading: false
    });
}

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
}

const authLogout = (state, action) => {
    return updateObject(state, {
        token: null,
        username: null
    });
}