import React, { useContext, useState, useRef, useEffect } from "react";
import Topbar from "../../components/Topbar/Topbar.js";
import "./profile.css";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.js";
import RightSidebar from "../../components/RightSidebar/RightSidebar.js";
import Footer from "../../components/Footer/Footer.js";
import CreatePost from "../../components/CreatePost/CreatePost.js";
import IndexPost from "../../components/IndexPost/IndexPost.js";
import { AuthContext } from "../../context/AuthContext.js";
import { MAIN_URL, public_folder } from "../../variable.js";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { requestFriend, imageWithCapitalExt } from "../../api.js";

const Profile = () => {
    const data = useLocation();
    const navigate = useNavigate();
    const {user, dispatch} = useContext(AuthContext);
    const [mainUser, setMainUser] = useState({});
    const [state, setState] = useState({timeline: true, about: false});
    const [posts, setPosts] = useState([]);
    const [isInvited, setIsInvited] = useState(false);
    const timelineRef = useRef();
    const months = [
        "January", 
        "February", 
        "March", 
        "April", 
        "May", 
        "June", 
        "July", 
        "August", 
        "September", 
        "October",
        "November", 
        "December"
    ]

    const clickHandler = (e) => {
        if (e.target === timelineRef.current ) {
            setState({timeline: true, about: false});
        } else {
            setState({timeline: false, about: true});
        }
    }

    
    useEffect(() => {
        if (data.state !== null) {
            console.log("if (data.state !== null)");
            setMainUser(data.state);
        } else {
            console.log("} else {");
            setMainUser(user);
        }
        const getPosts = async () => {
            try {
                const allPosts = await axios.get(`${MAIN_URL}/api/posts/${mainUser?._id}`);
                setPosts(allPosts.data);
            } catch (error) {
                console.log("error: " + error);
            }
        };
        const getIsInvited = () => {
            return mainUser.invitations.includes(user._id);
        };
        if (Object.keys(mainUser).length > 0) {
            if (mainUser._id !== user._id) {
                if (mainUser.invitations.length > 0) {
                    getPosts();
                    setIsInvited(getIsInvited());
                } else {
                    getPosts();
                }
            } else {
                getPosts();
            }
        }
    }, []);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const allPosts = await axios.get(`${MAIN_URL}/api/posts/${mainUser?._id}`);
                setPosts(allPosts.data);
            } catch (error) {
                console.log("error: " + error);
            }
        };
        const getIsInvited = () => {
            return mainUser.invitations.includes(user._id);
        };
        if (Object.keys(mainUser).length > 0) {
            if (mainUser._id !== user._id) {
                if (mainUser.invitations.length > 0) {
                    getPosts();
                    setIsInvited(getIsInvited());
                } else {
                    getPosts();
                }
            } else {
                getPosts();
            }
        }
    }, [mainUser]);

    const invite = async (mainUser) => {
        const response = await requestFriend(mainUser, user._id, dispatch);
        alert(response);
        navigate("/");
    }
    return (
        <>
            <Topbar />
            <LeftSidebar />
            <RightSidebar />
            <main className="main__profile">
                <div className="main__container">
                    <div className="profile__header">
                        <div className="profile__header-img">
                            <img src="/assets/images/profile-bg1.jpg" alt="Profile" />
                        </div>
                        <div className="user__img">
                            <img src={Object.keys(mainUser).length > 0 ?
                                        mainUser?.profile_img === "noAvatar-big.png" 
                                        ? (public_folder + mainUser?.profile_img) 
                                        : (public_folder + "users/" + imageWithCapitalExt(mainUser?.profile_img))
                                    : ""}  alt="User" />
                        </div>
                        <div className="profile__info">
                            <ul>
                                <li>
                                    <h4 className="username">{mainUser !== undefined && mainUser !== null && mainUser.username}</h4>
                                </li>
                                <li>
                                    {Object.keys(mainUser).length > 0 ?
                                        mainUser !== null && user !== null ?
                                            mainUser._id !== user._id ?
                                                user?.friends.includes(mainUser._id) ?
                                                    <h6>YOU ARE FRIENDS</h6>
                                                :
                                                    isInvited ? <h6>User already has been invited!</h6> : <button className="invite" onClick={() => invite(mainUser)}>Make a friendship</button>
                                            : null
                                        : null
                                    : null
                                    }
                                    </li>
                                <li>
                                    <h6>Posts</h6>
                                    <span>{posts ? posts.length : "0"}</span>
                                </li>
                                <li>
                                    <h6>Friends</h6>
                                    <span>{Object.keys(mainUser).length > 0 ? mainUser.friends.length : 0}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="tabs">
                        <ul>
                            <li>
                                <p onClick={clickHandler} ref={timelineRef} href="#" className={state.timeline ? "active" : ""}>Timeline</p>
                            </li>
                            <li>
                                <p onClick={clickHandler} href="#" className={state.about ? "active" : ""}>About</p>
                            </li>
                        </ul>
                    </div>
                    <div className="tabs__content">
                        <section className={state.timeline ? "tabs__content-wrapper active" : "tabs__content-wrapper"}>
                            {Object.keys(mainUser).length > 0 ?
                                        mainUser._id === user._id ?
                                            <>
                                                <CreatePost />
                                                <IndexPost stranger={{}} isFriendsProfile={false} isStrangersProfile={false}/>
                                            </>
                                        : (
                                            <>
                                                {user.friends.includes(mainUser._id) ? (
                                                    <IndexPost stranger={{}} isStrangersProfile={false} isFriendsProfile={true}/>
                                                ) : (
                                                    <IndexPost stranger={mainUser} isStrangersProfile={true} isFriendsProfile={false}/>
                                                )}
                                            </>
                                            )
                                    : null
                                    }
                        </section>
                        <section className={state.about ? "tabs__content-wrapper active" : "tabs__content-wrapper"}>
                            <div className="contacts">
                                <h4 className="title">Contact Information</h4>
                                <hr />
                                <div className="info">
                                    <div className="email section">
                                        <span>Email</span>
                                        <p>{Object.keys(mainUser).length > 0 ? mainUser.email : ""}</p>
                                    </div>
                                    {/* <div className="mobile section">
                                        <span>Mobile</span>
                                        <p>(001) 4544 565 456</p>
                                    </div> */}
                                    <div className="address section">
                                        <span>Address</span>
                                        <p>
                                            {Object.keys(mainUser).length > 0 ?
                                                mainUser.address + ", " + mainUser.city + ", " + mainUser.state + ", "
                                                 + mainUser.country
                                            : <span></span>
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="websites">
                                <h4 className="title">Websites and Social Links</h4>
                                <hr />
                                <div className="info">
                                    <div className="email section">
                                        <span>Website</span>
                                        <p>www.bootstrap.com</p>
                                    </div>
                                </div>
                            </div> */}
                            <div className="basic__info">
                                <h4 className="title">Basic Information</h4>
                                <hr />
                                <div className="info">
                                    <div className="birth__date section">
                                        <span>Birth date</span>
                                        <p>{Object.keys(mainUser).length > 0 ? `${months[new Date(mainUser.birth).getUTCMonth()]},${new Date(mainUser.birth).getUTCDate()}` : ""}</p>
                                    </div>
                                    <div className="birth__year section">
                                        <span>Birth year</span>
                                        <p>{Object.keys(mainUser).length > 0 ? new Date(mainUser.birth).getFullYear() : ""}</p>
                                    </div>
                                    <div className="gender section">
                                        <span>Gender</span>
                                        <p>{Object.keys(mainUser).length > 0 ? mainUser.gender : ""}</p>
                                    </div>
                                    {/* <div className="interested section">
                                        <span>interested in</span>
                                        <p>Designing</p>
                                    </div> */}
                                    {/* <div className="language section">
                                        <span>language</span>
                                        <p>English, French</p>
                                    </div> */}
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


export default Profile;
