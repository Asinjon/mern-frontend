import React, { useContext, useRef, useState } from "react";
import "./createpost.css";
import { public_folder } from "../../variable.js";
import {AuthContext} from "../../context/AuthContext.js";
import { MAIN_URL } from "../../variable.js";
import axios, { Axios } from "axios";
import {imageWithCapitalExt} from "../../api.js";

const CreatePost = () => {
    const {createdDispatch} = useContext(AuthContext);
    const {user} = useContext(AuthContext);
    const [isActive, setIsActive] = useState(false);
    const [imgFile, setImgFile] = useState(null);
    const [imgActive, setImgActive] = useState(false);
    const [text, setText] = useState("");
    const inputRef = useRef();
    const btnRef = useRef();

    const clickHandler = (e) => {
        if (e.target === inputRef.current) {
            setIsActive(true);
            inputRef.current.blur();
        }else if (e.target === btnRef.current){
            setIsActive(false);
        }
    }

    const handleInputImg = (e) => {
        const imgElement = document.querySelector(".create__post-body .content img.uploaded");
        console.log("imgElement:", imgElement);
        const imgFile = document.querySelector("input#uploadedImg").files[0];
        const fr = new FileReader();
        fr.onload = function() {
            console.log("url:", fr.result);
            imgElement.src = fr.result;
        }
        fr.readAsDataURL(imgFile);
        setImgActive(true);
        setImgFile(imgFile);
    }

    const createPost = async () => {
        setIsActive(false);
        if (imgFile) {
            const formData = new FormData();
            formData.append("postImg", imgFile);
            formData.append("creatorId", user._id);
            console.log("formData:", formData);
            try {
                const response = await axios.post(`${MAIN_URL}/post`, formData);
                if (response.data.imgName) {
                    console.log("respons:", response);
                    console.log("text:", text);
                    const answer = await axios.post(`${MAIN_URL}/api/posts/create`, {id: user._id, text, img: response.data.imgName, creatorUsername: user.username});
                    if (answer.data) {
                        createdDispatch({type:"CREATE", payload: true});
                    }
                }
            } catch (error) {
                console.log("error:", error);
            }
        } else {
            try {
                
            } catch (error) {
                console.log("error:", error);
            }
        }
        setText("");
        setImgFile(null);
    }
    return (
        <>
            <article className="create__post">
                <div className="card__header">
                    <h3>Create Post</h3>
                </div>
                <div className="content">
                    <div className="user__input">
                        <img src={user?.profile_img === "/noAvatar-big.png" ? (public_folder + user?.profile_img) : (public_folder + "users/" + imageWithCapitalExt(user?.profile_img))} alt="User" className="user__img" />
                        <div className="input">
                            <input ref={inputRef} onClick={clickHandler} type="text" id="clickHandler" placeholder="Write something here"/>
                        </div>
                    </div>
                </div>
                <div className={isActive ? "create__post-body active" : "create__post-body"}>
                    <div className="card__header">
                        <h3>Create Post</h3>
                        <button type="button" href="#" className="close__popup" ref={btnRef} onClick={clickHandler}>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                    <div className="content">
                        <div className="user__input">
                            <img src={user?.profile_img === "/noAvatar-big.png" ? (public_folder + user?.profile_img) : (public_folder + "users/" + imageWithCapitalExt(user?.profile_img))} alt="User" className="user__img" />
                            <div className="input">
                                <input value={text} onChange={(e) => setText(e.target.value)} type="text" placeholder="Write something here"/>
                            </div>
                        </div>
                        <hr />
                        <img className={imgActive ? "uploaded active" : "uploaded inactive"} src="" alt="Uploaded" />
                        <div className={imgActive ? "upload__image hidden" : "upload__image active"}>
                            <label htmlFor="uploadedImg"><span>+</span></label>
                            <input type="file" onChange={handleInputImg} name="uploadedImg" id="uploadedImg" accept="image/*" />
                            <p>Click to "+" to upload an image</p>
                        </div>
                        <hr />
                        <a href="#" className="make__post" onClick={createPost}>Post</a>
                    </div>
                </div>
                <div className="modal__overlay">
                    
                </div>
            </article>
        </>
    )
}

export default CreatePost;