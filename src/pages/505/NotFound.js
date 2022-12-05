import React from "react";
import { Link } from "react-router-dom";
import "./notfound.css";

const NotFound = () => {
    return (
        <>
            <div className="wrapper-not">
                <div className="container">
                    <img src="/assets/images/500.png" alt="Error 500" />
                    <h2>Oops! This Page is Not Working.</h2>
                    <p>The requested is Internal Server Error.</p>
                    <Link to="/" className="btn">Back to Home</Link>
                </div>
            </div>
        </>
    )
}

export default NotFound;