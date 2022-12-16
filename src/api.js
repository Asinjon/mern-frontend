import axios from "axios";
import { useNavigate } from "react-router-dom";
import {MAIN_URL} from "./variable.js"

export const signUp = async (username, email, password, setInputErrors, setAuthError) => {
    try {
        const data = await axios.post(`${MAIN_URL}/api/auth/signup`, {username, email, password});
        if (data.data.inputError) {
            setInputErrors({username:data.data.username, email:data.data.email, password:data.data.password})
        } else {
            setAuthError({error: !data.data.inputError, message: data.data.message});
        }
    } catch (error) {
        console.log("error in signUp()::", error);
    }
}

export const signIn = async(email, password, dispatch, setInputErrors, setAuthError) => {
    try {
        const data = await axios.post(`${MAIN_URL}/api/auth/signin`, {email, password});
        console.log("DATA:", data.data.data);
        if (data.data.inputError) {
            setInputErrors({username:data.data.username, email:data.data.email, password:data.data.password})
        } else if (data.data.verifyError) {
            setAuthError({error: data.data.verifyError, message: data.data.message});
        } else {
            dispatch({type:"SIGNIN", payload: {user: data.data.data.user, isLogged: data.data.data.isLogged, userDataId: data.data.userDataId}});
        }
    } catch (error) {
        console.log("error in signin():::", error);
    }
}


export const signOut = async (dispatch, userDataId) => {
    try {
        console.log("BEFORE await axios.post(address);");
        const isSignOut = await axios.post(`${MAIN_URL}/api/auth/signout`, {userDataId});
        if (isSignOut.data.signout) {
            dispatch({type: "SIGNOUT"});
        } else {
            console.log("Error while signing out!");
        }
        console.log("AFTER SIGNOUT dispatch");
    } catch (error) {
        console.log("error in signOut():::", error);
    }
}

export const submitChanges = async (datas, dispatch, userDataId) => {
    console.log("submitChanges");
    try {
        const response = await axios.post(`${MAIN_URL}/api/submit/`, {datas, userDataId});
        if (Object.keys(response.data?.user).length > 0) {
            console.log("response.data:", response.data);
            dispatch({type: "UPLOAD", payload: {user: response.data.user, userDataId: response.data.userDataId}});
        }
    } catch (error) {
        console.log("error in submitChanges():::", error);
    }
}

export const changePassword = async (data, dispatch) => {
    try {
        const response = await axios.post(`${MAIN_URL}/api/auth/change-password`, data);
        if (!response.data.error) {
            dispatch({type: "UPLOAD", payload: response.data.user});
        }
    } catch (error) {
        console.log("error in changePassword():::", error);
    }
};

export const requestFriend = async (datas, userId, dispatch) => {
    try {
        const response = await axios.post(`${MAIN_URL}/api/submit/invite`, {id:datas._id, userId});
        return response.data.message;
    } catch (error) {
        console.log("error in requestFriend():::", error);
    }
};

export const receiveInvitation = async (strangerId, userDataId userId) => {
    try {
        const response = await axios.post(`${MAIN_URL}/api/submit/friend`, {friendId:strangerId, userDataId, userId});
        return response.data;
    } catch (error) {
        console.log("error in receiveInvitation():::", error);
    }
};

export const deleteConv = async (conversationId) => {
    const result = await axios.post(`${MAIN_URL}/api/conversations/delete`, {id:conversationId});
    console.log("result in api:", JSON.stringify(result));
    return result.data;
};

export const imageWithCapitalExt = (imageName) => {
    // if (imageName !== undefined || imageName !== null) {
    //     const extension = imageName[imageName?.length - 3] + imageName[imageName?.length - 2] + imageName[imageName?.length - 1];
    //     imageName = imageName.replace(extension, extension.toUpperCase());
    //     return imageName;
    // } else {
    //     return imageName;
    // }
    return imageName;
}
