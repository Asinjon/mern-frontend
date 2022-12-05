import React, {useContext, useEffect, useRef, useState} from "react";
import { signIn, signUp } from "../../api.js";
import "./auth.css";
import { AuthContext } from "../../context/AuthContext.js";
import { public_folder } from "../../variable.js";
import { Link, useNavigate } from "react-router-dom";

const Auth = ({type}) => {
    const {state, dispatch, userDataId} = useContext(AuthContext);
    const [isSignUp, setIsSignUp] = useState(type === "login" ? false : true);
    const [authError, setAuthError] = useState({error: false, message: ""});
    const username = useRef();
    const email = useRef();
    const password = useRef();
    let navigate = useNavigate();
    const [inputErrors, setInputErrors] = useState({
        username: "",
        email: "",
        password: ""
    });

    const switchMode = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch({type: "SIGNUP"});

        if (isSignUp) {
            signUp(username.current.value, email.current.value, password.current.value, setInputErrors, setAuthError);
            navigate("/confirm");
        } else {
            signIn(email.current.value, password.current.value, dispatch, setInputErrors, setAuthError);
        }
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
                                    <Link to="/" className="link">
                                        <img src={public_folder + "logo-full.png"} alt="Logotype" />
                                    </Link>
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
                                <form method="POST" onSubmit={handleSubmit}>
                                    <h1 className="title">Sign {isSignUp ? "up" : "in"}</h1>
                                    <p className="description">Enter your {isSignUp ? "full name," : ""} email address and password
                                        {isSignUp ? " to sign up in our system" : " to access admin panel"}</p>
                                    <h3 style={{color: "red"}}>{authError.error ? isSignUp ? null : authError.message : ""}</h3>
                                    <div className="inputs">
                                        {isSignUp ? (
                                            <div className="fullname">
                                                <label htmlFor="fullname">Your Username</label>
                                                <input
                                                    onChange={() => {
                                                        if (inputErrors.username !== "") setInputErrors({
                                                            username: "",
                                                            email: inputErrors.email,
                                                            password: inputErrors.password
                                                        });
                                                    }}
                                                    ref={username}
                                                    name="username"
                                                    id="username"
                                                    type="text"
                                                    placeholder="Your username" />
                                                <p className="error">{inputErrors.username}</p>
                                            </div>
                                        ) : null}
                                        <div className="email">
                                            <label htmlFor="email">Email address</label>
                                            <input
                                                onChange={() => {
                                                    if (authError.error) {
                                                        setAuthError({error: false, message: ""});
                                                    } else {
                                                        setInputErrors({
                                                        username: inputErrors.username,
                                                        email: "",
                                                        password: inputErrors.password
                                                    });
                                                    }
                                                }}
                                                ref={email}
                                                name="email" 
                                                id="email"
                                                type="email"
                                                placeholder="Enter email" />
                                            <p className="error">{inputErrors.email}</p>
                                        </div>
                                        <div className="password">
                                            <label htmlFor="password">Password</label>
                                            <input
                                                onChange={() => {
                                                    if (authError.error) {
                                                        setAuthError({error: false, message: ""});
                                                    } else {
                                                        setInputErrors({
                                                            username: inputErrors.username,
                                                            email: inputErrors.email,
                                                            password: ""
                                                        });
                                                    }
                                                }}
                                                ref={password}
                                                name="password" 
                                                id="password" 
                                                type="password"  
                                                placeholder="Password" />
                                            <p className="error">{inputErrors.password}</p>
                                        </div>
                                    </div>
                                    <div className="terms">
                                        {/* <div className="accept__terms">
                                            {isSignUp ? (
                                                <>
                                                    <input type="checkbox" name="" id="check" />
                                                    <label htmlFor="check"> I accept <a className="link" href="#">Terms and Conditions</a></label>
                                                </>
                                            ) : (
                                                <>
                                                    <input type="checkbox" name="" id="check" />
                                                    <label htmlFor="check"> Remember me</label>
                                                </>
                                            )}
                                        </div> */}
                                        <button type="submit">Sign {isSignUp ? "up" : "in"}</button>
                                    </div>
                                    <div className="sign__info">
                                        <p className="have__account">{isSignUp ? (
                                            <>
                                                Already have an account? 
                                                <a className="link" onClick={switchMode} href="#"> Log in</a>
                                            </>
                                        ) : (
                                            <>
                                                Do not have an account?
                                                <a className="link" onClick={switchMode} href="#"> Sign up</a>
                                            </>
                                        )}</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Auth;