import React, {useContext, useState, useEffect} from "react";
import "./leftsidebar.css";
import { Link } from "react-router-dom";
import { public_folder } from "../../variable.js";
import {AuthContext} from "../../context/AuthContext.js";
import { useLocation } from "react-router-dom";
const LeftSidebar = () => {
    const {user} = useContext(AuthContext);
    const [activeSection, setActiveSection] = useState({newsfeed: false, profile: false});
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/profile/:userId") {
            setActiveSection({newsfeed: false, profile: true});
        } else {
            setActiveSection({newsfeed: true, profile: false});
        }
    }, []);

    return (
        <>
            <div className="left__sidebar">
                <ul className="nav">
                    <li className={activeSection.newsfeed ? "active" : ""}>
                        <Link to="/">
                            <img src={public_folder + "leftsidebar/newspaper-folded.png"} alt="NewsFeed" />
                            NewsFeed
                        </Link>
                    </li>
                    <li  className={activeSection.profile ? "active" : ""}>
                        <Link to="/profile/:userId" state={user}>
                            <img src={public_folder + "leftsidebar/user-grey.png"} alt="Profile" />
                            Profile
                        </Link>
                    </li>
                    {/* <li>
                        <a href="#">
                            <img src="/assets/images/leftsidebar/users-group-grey.png" alt="Group" />
                            Group
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <img src="/assets/images/leftsidebar/check-circle-grey.png" alt="Todo" />
                            Todo
                        </a>
                    </li> */}
                </ul>
            </div>
        </>
    )
}

export default LeftSidebar;