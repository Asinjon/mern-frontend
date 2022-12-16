import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.js";
import "./topbar.css";
import { public_folder, MAIN_URL } from "../../variable.js";
import axios from "axios";
import { signOut, receiveInvitation, imageWithCapitalExt } from "../../api.js";

function Topbar () {
    const {user, dispatch, userDataId} = useContext(AuthContext);
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [search, setSearch] = useState(false);
    const [users, setUsers] = useState(null);
    const [state, setState] = useState({
        requests: {
            isShow: false,
            count: 0
        }, 
        messages: {
            isShow: false,
            count: 0
        }, 
        profile: {
            isShow: false,
            count: 0
        }});

    const requestRef = useRef();
    const messageRef = useRef();
    const profileRef = useRef();
    const searchRef = useRef();

    useEffect(() => {
        if (query !== "") {
            if (!search) setSearch(true);
        }
    }, [query]);
    const signOutBtn = () => {
        signOut(dispatch, userDataId);
    }

    const handleClick = (e) => {
        switch (e.target.className) {
            case "user__requests-link":
            case "user__requests-img":
                state.requests.count === 1 
                    ? setState({
                        requests: {isShow: false, count: 0},
                        messages: {isShow: false, count: 0},
                        profile: {isShow: false, count: 0}
                    }) 
                    : setState({
                        requests: {isShow: true, count: state.requests.count + 1},
                        messages: {isShow: false, count: 0},
                        profile: {isShow: false, count: 0}
                    });
                break;
            case "user__messages-link":
            case "user__messages-img":
                state.messages.count === 1 
                    ? setState({
                        requests: {isShow: false, count: 0},
                        messages: {isShow: false, count: 0},
                        profile: {isShow: false, count: 0}
                    }) 
                    : setState({
                        requests: {isShow: false, count: 0},
                        messages: {isShow: true, count: state.messages.count + 1},
                        profile: {isShow: false, count: 0}
                    });
                break;
            case "user__profile-link":
            case "user__profile-img":
                state.profile.count === 1 
                    ? setState({
                        requests: {isShow: false, count: 0},
                        messages: {isShow: false, count: 0},
                        profile: {isShow: false, count: 0}
                    }) 
                    : setState({
                        requests: {isShow: false, count: 0},
                        messages: {isShow: false, count: 0},
                        profile: {isShow: true, count: state.profile.count + 1}
                    });
                break;
            default:
                return;
        }
    }

    useEffect(() => {
        const handler = (e) => {
            if (requestRef.current.contains(e.target) ||
                profileRef.current.contains(e.target)) {
                } else {
                    setState({
                        requests: {isShow: false, count: 0},
                        messages: {isShow: false, count: 0},
                        profile: {isShow: false, count: 0}
                    });
                }
        }
        document.addEventListener("mousedown", handler);

        return () => document.removeEventListener("mousedown", handler);
    });

    useEffect(() => {
        const searchHandler = (e) => {
            if (searchRef.current.contains(e.target)) {
                } else {
                    if (search) setSearch(false);
                    setQuery("");
                }
        }
        window.addEventListener("mousedown", searchHandler);

        return () => window.removeEventListener("mousedown", searchHandler);
    });

    useEffect(() => {
        const getUsers = async () => {
            try {
                const users = await axios.post(`${MAIN_URL}/api/auth/`);
                setUsers(users.data);
            } catch (error) {
                console.log("error:", error);
            }
        };
        getUsers();
    }, []);

    const someUserHomepage = (someuser) => {
        navigate("/profile/:userId", {state: someuser});
    }

    const confirm = async (strangerId, userId) => {
        const response = await receiveInvitation(strangerId, userDataId, userId);
        dispatch({type: "UPLOAD", payload: {user: response}});
        window.location.reload();
    };
    const deny = async (strangerId, userId) => {

    };

    const userInvitations = (function() {
        const invs = [];
        if (user !== null && user !== undefined) {
            if (Object.keys(user).length > 0) {
                if (users !== null && users.length > 0) {
                    user.invitations.map(invitation => {
                        users.forEach(someUser => {
                            if (someUser._id === invitation) {
                                invs.push(
                                    <div key={invitation} className="friend__request">
                                        <div className="friend__request-wrapper">
                                            <div className="friend">
                                                <img src={someUser?.profile_img === "/noAvatar-big.png" ? (public_folder + someUser?.profile_img) : (public_folder + "users/" + imageWithCapitalExt(someUser?.profile_img))} alt="User" />
                                                <p>
                                                    <span>{someUser.username}</span>
                                                    <span>{someUser.friends.length} friends</span>
                                                </p>
                                            </div>
                                            <div className="actions">
                                                <button type="button" className="confirm" onClick={() => confirm(invitation, user._id)}>Confirm</button>
                                                <button type="button" className="delete" onClick={() => deny(invitation, user._id)}>Delete Request</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        });
                    });
                    return invs;
                }
            }
        }
    })();

    const noInvitations = userInvitations !== undefined && userInvitations !== null && userInvitations.length === 0 ? <h3 className="no__requests">No requests!</h3> : null

    const searchResults = users !== null && users.length > 0 && users.filter(aUser => aUser.username.toLowerCase().includes(query.toLowerCase())).map(someuser => (
        <li onClick={() => someUserHomepage(someuser)} key={someuser._id}>
            <img src={someuser?.profile_img === "/noAvatar-big.png" ? (public_folder + someuser?.profile_img) : (public_folder + "users/" + imageWithCapitalExt(someuser?.profile_img))} alt="User" />
            <span>{someuser.username}</span>
        </li>
    ));

    return (
        <>
            <header>
                <div className="header__wrapper">
                    <div className="logo">
                        <Link to="/" className="brand">
                                <img src={public_folder + "topbar/logo.png"} alt="Brand" />
                                <h1>SocialV</h1>
                        </Link>
                    </div>
                    <div className="search" ref={searchRef}>
                        <form action="">
                            <input type="text" placeholder="Search here..." value={search ? query : ""} onChange={e => setQuery(e.target.value)}/>
                            <button><img src={public_folder + "topbar/loupe.png"} alt="Search for something" /></button>
                        </form>
                        <div className={search ? "search__result active" : "search__result"}>
                            <ul>
                                {searchResults ? search && query !== "" ? searchResults : null : null}
                            </ul>
                        </div>
                    </div>
                    <div className="profile">
                        <nav>
                            <ul>
                                <li>
                                    <Link to="/">
                                        <img src={public_folder + "topbar/house.png"} alt="Home" />
                                    </Link>
                                </li>
                                <li ref={requestRef} className="user__requests">
                                    <div className="clicker user__requests-link" onClick={handleClick}>
                                        <img className="user__requests-img" src={public_folder + "topbar/friends.png"} alt="Requests" />
                                    </div>
                                    <div className={state.requests.isShow ? "active card" : "card"}>
                                        <div className="card__header">
                                            <h3>Friend Request</h3>
                                            <small>{user ?? user.invitations.length}</small>
                                        </div>
                                        <div className="card__content">
                                            {userInvitations !== undefined 
                                                ? userInvitations !== null 
                                                    ? userInvitations.length > 0
                                                        ? userInvitations
                                                        : noInvitations
                                                    : null 
                                                : null}
                                            {/* <div className="view__more">
                                                <a href="#">View More Requests</a>
                                            </div> */}
                                        </div>
                                    </div>
                                </li>
                                {/* <li ref={messageRef} className="user__messages">
                                    <div className="clicker user__messages-link" onClick={handleClick}>
                                        <img className="user__messages-link" src={public_folder + "topbar/mail.png"} alt="Messages" />
                                    </div>
                                    <div className={state.messages.isShow ? "active card" : "card"}>
                                        <div className="card__header">
                                            <h3>All Messages</h3>
                                            <small>4</small>
                                        </div>
                                        <div className="card__content">
                                            <div className="friend__request">
                                                <div className="friend__request-wrapper">
                                                    <div className="friend">
                                                        <img src="/assets/images/user/01.jpg" alt="" />
                                                        <p>
                                                            <span>Bni Emma Watson</span>
                                                            <span>13 Jun</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="friend__request">
                                                <div className="friend__request-wrapper">
                                                    <div className="friend">
                                                        <img src="/assets/images/user/02.jpg" alt="" />
                                                        <p>
                                                            <span>Lorem Ipsum Watson</span>
                                                            <span>20 Apr</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="friend__request">
                                                <div className="friend__request-wrapper">
                                                    <div className="friend">
                                                        <img src="/assets/images/user/03.jpg" alt="" />
                                                        <p>
                                                            <span>Why do we use it?</span>
                                                            <span>30 Jun</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="friend__request">
                                                <div className="friend__request-wrapper">
                                                    <div className="friend">
                                                        <img src="/assets/images/user/04.jpg" alt="" />
                                                        <p>
                                                            <span>Variations Passages</span>
                                                            <span>12 Sep</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="friend__request">
                                                <div className="friend__request-wrapper">
                                                    <div className="friend">
                                                        <img src="/assets/images/user/05.jpg" alt="" />
                                                        <p>
                                                            <span>Marsha Mello</span>
                                                            <span>5 Dec</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li> */}
                                <li ref={profileRef} className="user__profile">
                                    <button type="button" className="user__profile-link" onClick={handleClick}>
                                        <img className="user__profile-img" src={user?.profile_img === "noAvatar-big.png" ? (public_folder + user?.profile_img) : (public_folder + "users/" + imageWithCapitalExt(user?.profile_img))} alt="User" />
                                        <span className="username">{user?.username}</span>
                                    </button>
                                    <div className={state.profile.isShow ? "active card" : "card"}>
                                        <div className="card__header">
                                            <h3>Hello {user !== undefined && user !== null && user.username}</h3>
                                        </div>
                                        <div className="card__content">
                                            <div className="friend__request view__profile">
                                                <div className="friend__request-wrapper">
                                                    <div className="friend">
                                                        <Link to={{pathname:"/profile/:userId"}}>
                                                            <img src="/assets/images/nav/user.png" alt="View Profile" />
                                                            <p>
                                                                <span>My Profile</span>
                                                                <span>View personal profile details</span>
                                                            </p>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                                <div className="friend__request edit__profile">
                                                    <div className="friend__request-wrapper">
                                                        <div className="friend">
                                                            <Link to={{pathname:"/editprofile"}}>
                                                                <img src="/assets/images/nav/resume.png" alt="Edit Profile" />
                                                                <p>
                                                                    <span>Edit Profile</span>
                                                                    <span>Modify your personal details</span>
                                                                </p>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            <div className="view__more">
                                                <button href="#" onClick={signOutBtn}>Sign out</button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}


export default Topbar;
