import React, { useContext } from 'react';
import { public_folder } from '../../variable.js';
import { AuthContext } from '../../context/AuthContext.js';
import {format} from "timeago.js";
import { imageWithCapitalExt } from '../../api.js';

const Message = ({main, message, other}) => {
    const {user} = useContext(AuthContext);
  return (
    main ? (
        <div className="main__user">
            <div className="message">
                <div className="message__user">
                    <img src={user?.profile_img === "/noAvatar-big.png" ? (public_folder + user?.profile_img) : (public_folder + "users/" + imageWithCapitalExt(user?.profile_img))} alt="User" />
                    <span>{format(message.createdAt)}</span>
                </div>
                <div className="message__content">
                    <p>{message.text}</p>
                </div>
            </div>
        </div>
    ) : (
        <div className="other__user">
            <div className="message">
                <div className="message__user">
                    <img src={other?.profile_img === "/noAvatar-big.png" ? (public_folder + other?.profile_img) : (public_folder + "users/" + imageWithCapitalExt(other?.profile_img))} alt="User" />
                    <span>{format(message.createdAt)}</span>
                </div>
                <div className="message__content">
                    <p>{message.text}</p>
                </div>
            </div>
        </div>
    )
  )
}

export default Message