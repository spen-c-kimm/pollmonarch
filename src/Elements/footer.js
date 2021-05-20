import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Styles/styles.css";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-about">
            <h3>About</h3>

            <p>
              This application was built was Express and Node on the back-end
              and React on the front-end. Poll and user data is stored using
              MongoDB Atlas. JSON Web Token is used for the login functionality,
              and requests are performed using axios.
            </p>
          </div>
          <div className="footer-tech">
            <h3>Tech Used</h3>

            <ul>
              <li>Mongo</li>
              <li>Express</li>
              <li>React</li>
              <li>Node.js</li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Contact</h3>

            <ul>
              <li>
                Email: <br />
                spencer.c.kimmell@gmail.com
              </li>
              <li>Phone Number: 6203883301</li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="footer-bottom">
          <div>
            <button className="snap"></button>
          </div>
          <div>
            <button className="insta"></button>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
