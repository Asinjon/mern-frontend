import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { public_folder, MAIN_URL } from '../../variable.js';
import { imageWithCapitalExt } from '../../api.js';

const Conversation = ({conversation, currentUser}) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const friendId = conversation.members.find(m => m !== currentUser._id);

        const getUser = async () => {
            try {
                const response = await axios.get(`${MAIN_URL}/api/auth/` + friendId);
                setUser(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getUser();
    }, [currentUser, conversation]);
  return (
    <li>
        <button type="button">
            <div className="user__img">
                <img src={user?.profile_img === "/noAvatar-big.png" ? (public_folder + user?.profile_img) : (public_folder + "users/" + imageWithCapitalExt(user?.profile_img))} alt="" />
            </div>
            <div className="user__title">
                <span className="username">{user?.username}</span>
                <span className="message">I send this message</span>
            </div>
        </button>
    </li>
  )
}

export default Conversation;