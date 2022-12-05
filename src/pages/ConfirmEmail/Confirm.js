import React from "react";
import { useNavigate } from "react-router-dom";
import "./confirm.css";
import { public_folder } from "../../variable.js";

const Confirm = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("../");
    }
    return (
        <>
            <div className="wrapper">
                <div className="sign__in-page">
                    <div className="container__bg">
                        <div id="circle-small"></div>
                        <div id="circle-medium"></div>
                        <div id="circle-large"></div>
                        <div id="circle-xlarge"></div>
                        <div id="circle-xxlarge"></div>
                    </div>
                    <div className="container">
                        <div className="container__wrapper">
                            <div className="slider">
                                <div className="slider__wrapper">
                                    <a href="/" className="link">
                                        <img src="/assets/images/logo-full.png" alt="Logotype" />
                                    </a>
                                    <div className="slider__content">
                                            <ul className="swiper-wrapper">
                                                <li className="swiper-slide">
                                                    <img src={public_folder + "login/1.png"} alt="User 1" />
                                                    <h3>Find new friends</h3>
                                                    <p>It is a long established fact that a reader <br /> 
                                                        will be distracted by the readable <br /> 
                                                        content.</p>
                                                </li>
                                                <li className="swiper-slide">
                                                    <img src={public_folder + "login/2.png"} alt="User 2" />
                                                    <h3>Connect with the World</h3>
                                                    <p>It is a long established fact that a reader <br /> 
                                                        will be distracted by the readable <br /> 
                                                        content.</p>
                                                </li>
                                                <li className="swiper-slide">
                                                    <img src={public_folder + "login/3.png"} alt="User 3" />
                                                    <h3>Create new Events</h3>
                                                    <p>It is a long established fact that a reader <br /> 
                                                        will be distracted by the readable <br /> 
                                                        content.</p>
                                                </li>
                                            </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="form">
                                <div className="form__content">
                                    <img src="/assets/images/login/mail.png" alt="Newsletter" />
                                    <h2 className="title">Success !</h2>
                                    <p className="description">
                                        A email has been send to your email. <br />
                                        Please check for an email from company and click <br />
                                        on the included link to verify your email.
                                    </p>
                                    <button onClick={handleClick}>Back to Home</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Confirm;