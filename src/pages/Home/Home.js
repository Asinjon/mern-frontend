import React, { useContext, useState, useEffect } from "react";
import "./home.css"
import Topbar from "../../components/Topbar/Topbar.js";
import CreatePost from "../../components/CreatePost/CreatePost.js";
import IndexPost from "../../components/IndexPost/IndexPost.js";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.js";
import RightSidebar from "../../components/RightSidebar/RightSidebar.js";
import Footer from "../../components/Footer/Footer.js";
import { AuthContext } from "../../context/AuthContext.js";
import { imageWithCapitalExt } from "../../api.js";

const Home = () => {
    const {user} = useContext(AuthContext);
    console.log("user in Home:", user);

    return (
        <>
            <Topbar />
            <LeftSidebar />
            <RightSidebar/>
            <main>
                <div className="main__container">
                    <div className="posts">
                        <CreatePost />
                        <IndexPost />
                    </div>
                    <aside></aside>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Home;