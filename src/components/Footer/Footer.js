import React from "react";
import "./footer.css";


const Footer = () => {
    return (
        <>
            <footer>
                <div className="footer__container">
                    <div className="terms">
                        <a href="#" className="privacy">Privacy Policy</a>
                        <a href="#" className="use">Terms of Use</a>
                    </div>
                    <div className="rights">
                        <span>Copyright 2020 SocialV All Rights Reserved.</span>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;