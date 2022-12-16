export const AuthReducer = (state, action) => {
    switch(action.type) {
        case "SIGNUP":
            return {
                ...state,
                user: null,
                isLogged: false,
                userDataId: "12345"
            };
        case "SIGNIN":
            console.log("SIGNIN");
            console.log("isLogged in AuthReducer::", action.payload.isLogged);
            return {
                ...state,
                isLogged: action.payload.isLogged,
                user: action.payload.user,
                userDataId: action.payload.userDataId
            };
        case "SIGNOUT":
            console.log("User has logged out");
            return {...state, user: null, isLogged: false};
        case "UPLOAD":
            console.log("USER IN AUTHREDUCER:", action.payload.user);
            return {...state, user: action.payload.user, userDataId: action.payload.userDataId};
        default:
            console.log("default in AuthReducer");
            return state;
    }
}

export const PostReducer = (state, action) => {
    switch (action.type) {
        case "CREATE":
            return action.payload;
        default:
            return state;
    }
}
