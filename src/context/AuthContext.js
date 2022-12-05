import { createContext, useEffect, useReducer, useState } from "react";
import { AuthReducer, PostReducer } from "./AuthReducer.js";
import axios from "axios";
import { MAIN_URL } from "../variable.js";

const INITIAL_STATE = {
    user: null,
    isLogged: false,
    userDataId: "12345"
}
const postCreated = false;
export const AuthContext = createContext(INITIAL_STATE);
export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const [isCreated, createdDispatch] = useReducer(PostReducer, postCreated);
    console.log("isCreated: " + isCreated);
    return (
        <AuthContext.Provider value={{
            isCreated,
            createdDispatch,
            user: state.user,
            isLogged: state.isLogged,
            userDataId: state.userDataId,
            dispatch
        }}>
            {children}
        </AuthContext.Provider>
    )
}