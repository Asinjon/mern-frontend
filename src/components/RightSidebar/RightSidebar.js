import React, { useContext, useEffect, useState } from "react";
import "./rightsidebar.css";
import {Link} from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js";
import {MAIN_URL, public_folder} from "../../variable.js";
import axios from "axios";
import {imageWithCapitalExt} from "../../api.js";

const RightSidebar = () => {
    const {user} = useContext(AuthContext);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const getFriends = () => {
            const allFriends = [];
            if (user) {
                user.friends.forEach((friend) => {
                        axios.get(`${MAIN_URL}/api/auth/${friend}`).then(response => {
                            if (friends.length > 0) {
                                friends.forEach(friend => {
                                    if (friend._id === response.data._id) {console.log("REPEATING!");}
                                    else {allFriends.push(response.data);}
                                });
                            } else {
                                allFriends.push(response.data);
                            }
                        }).then(() => {
                            if (allFriends.length === user.friends.length) setFriends(allFriends);
                        }).catch(error => console.log("error:", error));
                });
            }
        }
        getFriends();
    }, []);
    return (
        <>
            <div className="right__sidebar">
                <ul className="users">
                    {friends.length > 0 && friends.map(friend => (
                        <li key={friend._id}>
                            <Link to="/chat" state={friend}>
                                <div className="user">
                                    <img src={friend?.profile_img === "/noAvatar-big.png" ? (public_folder + friend?.profile_img) : (public_folder + "users/" + imageWithCapitalExt(friend?.profile_img))} alt="" />
                                    <p>
                                        <span>{friend && friend.username}</span>
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))}
                    {friends.length === 0 && (<h2 className="noFriends">No friends</h2>)}
                </ul>
            </div>
        </>
    )
}

export default RightSidebar;