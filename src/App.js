import Home from "./pages/Home/Home.js";
import Auth from "./pages/Auth/Auth.js";
import Confirm from "./pages/ConfirmEmail/Confirm.js";
import Profile from "./pages/Profile/Profile.js";
import NotFound from "./pages/505/NotFound.js";
import EditProfile from "./pages/EditProfile/EditProfile.js";
import Chat from "./pages/Chat/Chat.js";
import { useContext, useEffect } from "react";
import {BrowserRouter, Route, Navigate, Routes, Outlet} from "react-router-dom";
import { AuthContext } from "./context/AuthContext.js";
import axios from "axios";
import {MAIN_URL} from "./variable.js"
function App() {
  const {user, isLogged, userDataId, dispatch} = useContext(AuthContext);
  console.log("user:::", user);
  console.log("isLogged::", isLogged);
  console.log("userDataId::", userDataId);
  axios.defaults.withCredentials = true;
  useEffect(() => {
      const getUser = async () => {
        try {
          const result = await axios.post(`${MAIN_URL}/api/auth/signin/user`, {userDataId});
          console.log("result::", JSON.stringify(result));
          if (result.data.isLogged === true) {
            dispatch({type:"SIGNIN", payload: {
              user: result.data.user, 
              isLogged: result.data.isLogged, 
              userDataId: result.data.userDataId}});
          }
        } catch (error) {
          console.log("error::", error);
        }
      }
      getUser();
  }, []);
  useEffect(() => {
    if (window.performance) {
      if (performance.navigation.type === 1) {
        console.log( "This page is reloaded" );
      } else {
        console.log( "This page is not reloaded");
      }
    }
  });
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={isLogged ? <Home /> : <Auth type="login" />} />
        <Route path="/signin" element={isLogged ? <Navigate to="/" /> : <Auth type="login" />} />
        <Route path="/signup" element={isLogged ? <Navigate to="/" /> : <Auth type="register" />} />
        <Route path="/profile/:userId" element={isLogged ? <Profile /> : <Navigate to="/signin" />} />
        <Route path="/editprofile" element={isLogged ? <EditProfile /> : <Navigate to="/signin" />} />
        <Route path="/chat" element={isLogged ? <Chat /> : <Navigate to="/signin" />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Outlet />
    </BrowserRouter>
  );
}
export default App;
