import React, { useEffect, useRef, useState } from "react";
import "./editprofile.css";
import Topbar from "../../components/Topbar/Topbar.js";
import Footer from "../../components/Footer/Footer.js";
import { useContext } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.js";
import RightSidebar from "../../components/RightSidebar/RightSidebar.js";
import { AuthContext } from "../../context/AuthContext.js";
import Select from "./Select.js";
import { changePassword, submitChanges, imageWithCapitalExt } from "../../api.js";
import { MAIN_URL, public_folder } from "../../variable.js";
import { dataURItoBlob, getOptions, listOfCountries } from "../../options.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const EditProfile = () => {
    const {user, dispatch, userDataId} = useContext(AuthContext);
    const [address, setAddress] = useState("");
    const [state, setState] = useState({personal: true, changePass: false});
    const [check, setCheck] = useState("male");
    const [selectedCountries, setSelectedCountries] = useState(getOptions("COUNTRY"));
    const [selectedStates, setSelectedStates] = useState(getOptions("STATE"));
    const [selectedCities, setSelectedCities] = useState(getOptions("CITY"));
    const [closePopup, setClosePopup] = useState(true);
    const [uploaded, setUploaded] = useState(false);
    const [imgFile, setImgFile] = useState("");
    const [imgName, setImgName] = useState("");
    const [noCurrentPass, setNoCurrentPass] = useState(false);
    const [noNewPass, setNoNewPass] = useState(false);
    const [noVerifyNewPass, setNoVerifyNewPass] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [verifyNewPassword, setVerifyNewPassword] = useState("");
    const personalRef = useRef();
    const changePassRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const userNameRef = useRef();
    const maleRef = useRef();
    const femaleRef = useRef();
    const statusRef = useRef();
    const ageRef = useRef();
    const cityRef = useRef();
    const countryRef = useRef();
    const stateRef = useRef();
    const birthRef = useRef();
    const addressRef = useRef();
    const currentPasswordRef = useRef();
    const newPasswordRef = useRef();
    const verifyNewPasswordRef = useRef();
    const formRef = useRef();
    const navigate = useNavigate();


    const clickHandler = (e) => {
        if (e.target === personalRef.current ) {
            setState({personal: true, changePass: false});
        } else {
            setState({personal: false, changePass: true});
        }
    }

    const handleSubmit = (e) => {
        switch (e.target.className) {
            case "submit":
                submitChanges( {
                        user: user,
                        firstName: firstNameRef.current.value,
                        lastName: lastNameRef.current.value,
                        userName: userNameRef.current.value,
                        gender: check,
                        status: statusRef.current.value,
                        age: ageRef.current.value,
                        city: cityRef.current.value,
                        country: countryRef.current.value,
                        state: stateRef.current.value,
                        birth: birthRef.current.value,
                        address: addressRef.current.value
                }, dispatch, userDataId);
                setAddress("");
                formRef.current.reset();
                navigate("/profile/:userId", { state: user });
                break;
            case "cancel":
                firstNameRef.current.value = "";
                lastNameRef.current.value = "";
                userNameRef.current.value = "";
                addressRef.current.value = "";
                break;
            default:
                return ;
        }
    }

    const handleSubmitPassword = (e) => {
        console.log("className:", e.target.className);
        switch (e.target.className) {
            case "submit":
                if (currentPasswordRef.current.value === "" || newPasswordRef.current.value === "" ||
                    verifyNewPasswordRef.current.value === "") {
                    if (currentPasswordRef.current.value === "") setNoCurrentPass(true);
                    if (newPasswordRef.current.value === "") setNoNewPass(true);
                    if (verifyNewPasswordRef.current.value === "") setNoVerifyNewPass(true);
                } else {
                    if (newPassword === verifyNewPassword) {
                        changePassword({
                            id: user._id,
                            current: currentPassword, 
                            new: newPassword
                        }, dispatch);
                    } else {
                        alert("New password and its verify are not equel");
                    }
                }
                break;
            case "cancel":
                currentPasswordRef.current.value = "";
                newPasswordRef.current.value = "";
                verifyNewPasswordRef.current.value = "";
                break;
            default:
                return ;
        }
    };

    useEffect(() => {
        setNoCurrentPass(false);
    }, [currentPassword]);

    useEffect(() => {
        setNoNewPass(false);
    }, [newPassword]);

    useEffect(() => {
        setNoVerifyNewPass(false);
    }, [verifyNewPassword]);

    const handleSelect = (select) => {
        let list = getOptions("STATE", listOfCountries.indexOf(countryRef.current.value));
        let listOfStates = [];
        for (let index = 0; index < list.length; index++) {
            listOfStates.push(list[index].props.value);
        }
        switch (select.target) {
            case countryRef.current:
                setSelectedStates(getOptions("STATE", listOfCountries.indexOf(countryRef.current.value)));
                setSelectedCities(getOptions(
                        "CITY", 
                        listOfCountries.indexOf(countryRef.current.value)), 
                        listOfStates.indexOf(stateRef.current.value)
                );
                return;
            case stateRef.current:
                setSelectedCities(
                    getOptions(
                                "CITY", 
                                listOfCountries.indexOf(countryRef.current.value),
                                listOfStates.indexOf(stateRef.current.value)
                            )
                );
                return;
            default:
                console.log("DEFAULT VALUE OF handleSelect is ran");
        }
    }

    useEffect(() => {
        if (!closePopup) {
            console.log("Popup is not closed!");
            const container = document.querySelector(".image__resize");
            container.style.display = "none";
        } else {
            setUploaded(false);
        }
    }, [closePopup]);

    const handleImgUpload = (e) => {
        const upload = document.querySelector("#upload__image");
        const container = document.querySelector(".image__resize");
        container.style.display = "block";
        const canvasMain = document.querySelector("canvas.main");
        const canvasCropper = document.querySelector("canvas.canvas");
        const pictures = document.querySelector(".pictures");
        canvasMain.width = pictures.offsetWidth;
        canvasMain.height = pictures.offsetHeight;
        canvasCropper.width = canvasCropper.height = pictures.offsetHeight;

        const ctxMain = canvasMain.getContext("2d");
        const ctxCropper = canvasCropper.getContext("2d");

        const mainComputedStyle = window.getComputedStyle(canvasMain);
        const cropperComputedStyle = window.getComputedStyle(canvasCropper);

        let MOVING = {};
        let MoveLimitLeft = 0, MoveLimitTop= 0,
        MoveLimitRight = pictures.offsetWidth - canvasCropper.offsetWidth,
        MoveLimitBottom = pictures.offsetHeight - canvasCropper.offsetHeight;
        let NO_MOVE = false;

        let reader = new FileReader();
        reader.readAsDataURL(upload.files[0]);
        let img = new Image();
        img.crossOrigin = "anonymous";
        reader.onload = () => {
            img.src = reader.result;
        };

        img.addEventListener("load", function() {
            ctxMain.drawImage(img, 0, 0, canvasMain.offsetWidth, canvasMain.offsetHeight);
            ctxCropper.drawImage(canvasMain, 
                cropperComputedStyle.left, 
                cropperComputedStyle.top, 
                canvasCropper.offsetWidth,
                canvasCropper.offsetHeight,
                0, 0, canvasCropper.offsetWidth, canvasCropper.offsetHeight);
        });

        canvasCropper.addEventListener("mousedown", function(e) {
            if (!NO_MOVE) {
                MOVING.t = canvasCropper;
                MOVING.x = e.pageX - cropperComputedStyle.getPropertyValue("left").replace("px","");//Расстояние слево до эл. без отступов canvas
                MOVING.y = e.pageY - cropperComputedStyle.getPropertyValue("top").replace("px","");
            }
            
            MoveLimitRight = pictures.offsetWidth - canvasCropper.offsetWidth;
            MoveLimitBottom = pictures.offsetHeight - canvasCropper.offsetHeight;
        });
        pictures.addEventListener("mousemove", function(e) {
            if (MOVING.t) move(e, MOVING);
        });

        document.addEventListener("mouseup", function() {
            NO_MOVE = false;
            MOVING = {};
        });

        function move(e, MOVING) {
            let Left = e.pageX - MOVING.x, Top = e.pageY - MOVING.y;//always getPropertyValue("left") - n(px)
            let move_X = (Left >= MoveLimitLeft && Left <= (MoveLimitRight - 4)),
                move_Y = (Top >= MoveLimitTop && Top <= (MoveLimitBottom - 4));
            move_X ? canvasCropper.style.left = Left + "px" : Left = cropperComputedStyle.getPropertyValue("left").replace("px","");
            move_Y ? canvasCropper.style.top = Top + "px" : Top = cropperComputedStyle.getPropertyValue("top").replace("px", "");
            
            ctxCropper.drawImage(canvasMain, Left, Top, canvasCropper.offsetWidth, canvasCropper.offsetHeight, 0, 0, canvasCropper.offsetWidth, canvasCropper.offsetHeight);
            setImgFile(canvasCropper.toDataURL());
        }
        setImgName(upload.files[0].name);
        setUploaded(true);
    }

    const saveProfileImg = () => {
        const formData = new FormData();
        const dataUrl = dataURItoBlob(document.querySelector("canvas.canvas").toDataURL());
        let myFile = new File([dataUrl], `${imgName}`, {type: "image/png"});
        try {
            formData.append("image", myFile);
            formData.append("userID", user._id);
            formData.append("userDataId", userDataId);
            axios({
                url: `${MAIN_URL}/single`,
                method: "POST",
                headers: {},
                data: formData
            })
                .then(response => {
                    console.log("then in EditProfile");
                    if (response.data.uploaded) {
                        console.log("UPLOADED IS TRUE");
                        dispatch({type:"UPLOAD", payload: {user: response.data.user, userDataId: response.data.userDataId}});
                        setUploaded(false);
                        setClosePopup(prev => !prev);
                    }
                })
                .catch(error => {
                    console.log("error:", error);
                });
        } catch (error) {
            console.log("error while uploading img:", error);
        }
    }
    return (
        <>
            <Topbar />
            <LeftSidebar />
            <RightSidebar />
            <main>
                <div className="main__container">
                    <div className="tabs">
                        <ul>
                            <li>
                                <p className={state.personal ? "active" : ""} ref={personalRef} onClick={clickHandler} href="#">Personal Information</p>
                            </li>
                            <li>
                                <p className={state.changePass ? "active" : ""} ref={changePassRef} onClick={clickHandler} href="#">Change Password</p>
                            </li>
                        </ul>
                    </div>
                    <div className="tabs__content">
                        <section className={state.personal ? "card tabs__content-wrapper active" : "card tabs__content-wrapper"}>
                                <div className="card__header">
                                    <div className="card__container">
                                        <h3>Personal Information</h3>
                                    </div>
                                </div>
                                <div className="card__content">
                                    <form ref={formRef}>
                                        <div className="card__container">
                                                <div className="image__profile">
                                                    <img src={
                                                        user?.profile_img === "/noAvatar-big.png" 
                                                        ? (public_folder + user?.profile_img) 
                                                        : (public_folder + "users/" + imageWithCapitalExt(user?.profile_img))} 
                                                        alt="Profile" />
                                                    <div className="upload">
                                                        <img onClick={() => setClosePopup(prev => !prev)} src={public_folder + "/upload.png"} alt="Upload" />
                                                    </div>
                                                </div>
                                                <div  className={closePopup ? "image__editor" : "image__editor active"}>
                                                        <div className="header">
                                                            <div className="header__container">
                                                                <div className="title"><h2>Обновить фото профиля</h2></div>
                                                                <div className="close">
                                                                    <div className="btn" onClick={() => setClosePopup(prev => !prev)}>
                                                                        <span></span>
                                                                        <span></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="content">
                                                            <div className="image__resize">
                                                                <div className="layer"></div>
                                                                <canvas className="main"></canvas>
                                                                <div className="pictures">
                                                                    <canvas className="canvas"></canvas>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="actions">
                                                            {uploaded 
                                                                    ? <>
                                                                        <label onClick={saveProfileImg} htmlFor="upload__image">
                                                                            Save
                                                                        </label>
                                                                    </>
                                                                    : <>
                                                                    <label htmlFor="upload__image">
                                                                        <span className="plus">+</span>
                                                                        Upload image
                                                                    </label>
                                                                    <input onChange={handleImgUpload} type="file" accept="image/jpg" name="image" id="upload__image" />
                                                                </> 
                                                            }
                                                        </div>
                                                </div>
                                                <div className="row1">
                                                    <div className="firstname input">
                                                        <label htmlFor="firstname">First Name:</label>
                                                        <input ref={firstNameRef} type="text" id="firstname" placeholder="Bni"/>
                                                    </div>
                                                    <div className="lastname input">
                                                        <label htmlFor="lastname">Last Name:</label>
                                                        <input ref={lastNameRef} type="text" id="lastname" placeholder="John"/>
                                                    </div>
                                                </div>
                                                <div className="row2">
                                                    <div className="username input">
                                                        <label htmlFor="username">User Name:</label>
                                                        <input ref={userNameRef} type="text" id="username" placeholder="Bni@01"/>
                                                    </div>
                                                    <div className="country input">
                                                        <label htmlFor="country">Country:</label>
                                                        <Select 
                                                            onChange={handleSelect} 
                                                            size="1" 
                                                            reference={countryRef} 
                                                            name="country" 
                                                            id="country"
                                                            options={selectedCountries}
                                                        ></Select>
                                                    </div>
                                                </div>
                                                <div className="row3">
                                                    <div className="gender input">
                                                        <label htmlFor="">Gender:</label>
                                                        <div className="male__female">
                                                                <div>
                                                                    <label htmlFor="male">Male</label>
                                                                    <input checked={check === "male"} onChange={() => setCheck("male")} ref={maleRef} value="male" type="radio" name="female" id="male"/>
                                                                    <label htmlFor="female">Female</label>
                                                                    <input checked={check === "female"} onChange={() => setCheck("female")} ref={femaleRef} value="female" type="radio" name="female" id="female"/>
                                                                </div>
                                                        </div>
                                                    </div>
                                                    <div className="birth input">
                                                        <label htmlFor="birthday">Date of Birth:</label>
                                                        <input ref={birthRef} type="date" id="birthday" placeholder="1984-01-24"/>
                                                    </div>
                                                </div>
                                                <div className="row4">
                                                    <div className="status input">
                                                        <label htmlFor="status">Marital Status:</label>
                                                        <select defaultValue="Single" ref={statusRef} name="status" id="status">
                                                            <option>Single</option>
                                                            <option>Married</option>
                                                            <option>Widowed</option>
                                                            <option>Divorced</option>
                                                            <option>Separated</option>
                                                        </select>
                                                    </div>
                                                    <div className="age input">
                                                        <label htmlFor="age">Age:</label>
                                                        <select defaultValue="6-11" ref={ageRef} name="age" id="age">
                                                            <option>6-11</option>
                                                            <option>12-18</option>
                                                            <option>19-44</option>
                                                            <option>45-60</option>
                                                            <option>61-75</option>
                                                            <option>75&gt;</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="row5">
                                                    <div className="city input">
                                                        <label htmlFor="city">City:</label>
                                                        <Select 
                                                            onChange={handleSelect} 
                                                            size="1" 
                                                            reference={cityRef} 
                                                            name="city" 
                                                            id="city"
                                                            options={selectedCities}
                                                        ></Select>
                                                    </div>
                                                    <div className="state input">
                                                        <label htmlFor="state">State:</label>
                                                        <div>
                                                            <Select 
                                                                onChange={handleSelect} 
                                                                size="1" 
                                                                reference={stateRef} 
                                                                name="state" 
                                                                id="state"
                                                                options={selectedStates}
                                                            ></Select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="address">
                                                    <label htmlFor="addr">Address</label>
                                                    <textarea onChange={(e) => setAddress(e.target.value)} ref={addressRef} name="" id="addr" rows="5" value={address}></textarea>
                                                </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="actions">
                                    <div className="card__container">
                                        <button type="button" className="submit" onClick={handleSubmit}>Submit</button>
                                        <button type="button" className="cancel" onClick={handleSubmit}>Cancel</button>
                                    </div>
                                </div>
                        </section>
                        <section className={state.changePass ? "card tabs__content-wrapper active" : "card tabs__content-wrapper"}>
                            <div className="card__header">
                                <div className="card__container">
                                    <h3>Change Password</h3>
                                </div>
                            </div>
                            <div className="card__content">
                                <div className="card__container password">
                                    <div className="newpassword input">
                                        <p>
                                            <label htmlFor="current__password">Current Password</label>
                                            {/* <a href="#" className="forgot">Forgot Password</a> */}
                                        </p>
                                        <input ref={currentPasswordRef} type="password" id="current__password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}/>
                                        <p className="error">{noCurrentPass ? "You have to write your current password" : ""}</p>
                                    </div>
                                    <div className="newpassword input">
                                        <label htmlFor="new__password">New Password</label>
                                        <input ref={newPasswordRef} type="password" id="new__password" value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
                                        <p className="error">{noNewPass ? "You have to write your new password" : ""}</p>
                                    </div>
                                    <div className="newpassword input">
                                        <label htmlFor="verify__password">Verify Password</label>
                                        <input ref={verifyNewPasswordRef} type="password" id="verify__password" value={verifyNewPassword} onChange={e => setVerifyNewPassword(e.target.value)}/>
                                        <p className="error">{noVerifyNewPass ? "You have to verify your new password" : ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="actions">
                                    <div className="card__container">
                                        <button type="button" className="submit" onClick={handleSubmitPassword}>Submit</button>
                                        <button type="button" className="cancel" onClick={handleSubmitPassword}>Cancel</button>
                                    </div>
                                </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
export default EditProfile;