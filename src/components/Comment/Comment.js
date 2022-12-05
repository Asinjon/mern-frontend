import React, {useContext, useEffect, useState} from "react";
import "./comment.css";
import {Link} from "react-router-dom";
import { public_folder, MAIN_URL } from "../../variable.js";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.js";
import { imageWithCapitalExt } from "../../api.js";


const Comment = ({friendId, creatorId, text, username, profile_img}) => {
    const {user} = useContext(AuthContext);
    const [friend, setFriend] = useState(null);

    useEffect(() => {
        const getFriend = async () => {
            try {
                if (friendId) {
                    const friendInfo = await axios.get(`${MAIN_URL}/api/auth/${friendId}`);
                    setFriend(friendInfo.data);
                } else {setFriend(user)}
            } catch (error) {
                console.log("error: " + error);
            }
        };
        getFriend();
    }, []);
    return (
        <>
            <article className="comment">
                <div className="user">
                    {friend ? (
                        <Link to="/"><img src={profile_img === "/noAvatar-big.png" ? (public_folder + profile_img) : (public_folder + "users/" + imageWithCapitalExt(profile_img))} alt="User" /></Link>
                    ) : (<span></span>)}
                </div>
                <div className="content">
                    <h6>{username}</h6>
                    <p>{text}</p>
                </div>
            </article>
        </>
    )
}

export default Comment;