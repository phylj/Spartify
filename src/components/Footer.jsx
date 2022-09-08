import Spotify from './spotify_logo.png'
import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faMusic, faCat, faDog } from '@fortawesome/free-solid-svg-icons';


<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"></link>

/**
 * creates the footer for our page that includes links that 
 * direct users to top artists, albums and songs
**/

function Footer() {
    return (
        <div className="footer">
            <div className="footercontainer">
                <div className="row">

                    <div className="footer-col">
                        <div className="header">
                            <img src={Spotify} alt="logoimage" className="logo"></img>
                            <h1 className="footername">
                                Sp-ART-ify
                            </h1>


                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>
                            Art-ify!
                        </h4>
                        <ul>
                            <li className="col_item"> <a href="albums"> Albums </a></li>
                            <li className="col_item"> <a href="songs"> Songs </a></li>
                            <li className="col_item"> <a href="artists"> Artists </a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>
                            Learn More
                        </h4>
                        <ul>
                            <li className="col_item"> <a href="https://github.com/CS222SP22/course-project-mp-b"> About Us </a></li>
                            <li className="col_item"> <a href="https://www.spotify.com/us/"> About Spotify </a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>
                            Groove With Us!
                        </h4>
                        <div className="social-links">
                            <a href="https://open.spotify.com/user/sophiaxiezhuang?si=jVp0QLygSqSDuj6GvSE88w&nd=1">
                                <FontAwesomeIcon icon={faCoffee} className="icon" />
                            </a>
                            <a href="https://open.spotify.com/user/rayway____?si=btXi9OiUQsCPjcyVuyIHWA&nd=1">
                                <FontAwesomeIcon icon={faMusic} className="icon" />
                            </a>
                            <a href="https://open.spotify.com/user/phyllisjiawang?si=9QN--7JlTqyakSGPhC4J-w&nd=1">
                                <FontAwesomeIcon icon={faCat} className="icon" />
                            </a>
                            <a href="https://open.spotify.com/user/vaixkobk06qp3x4i65gh2fjq1?si=gdsZhE1ETqSItFcctzqvAg&nd=1">
                                <FontAwesomeIcon icon={faDog} className="icon" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
export default Footer;