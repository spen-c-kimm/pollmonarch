import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Styles/styles.css";

class Nav extends Component {
  logoutHandler() {
    axios.get("https://pollmonarchapi.herokuapp.com/api/v1/users/logout", {
      withCredentials: true,
      credentials: "include"
    });
  }

  render() {
    return (
      <div className="nav">
        <div className="nav-content">
          <Link to="/home">
            <button>Home</button>
          </Link>
          <Link to="/profile">
            <button>UserProfile</button>
          </Link>
          <Link to="/createPoll">
            <button>Create Poll</button>
          </Link>
          <Link to="/">
            <button onClick={this.logoutHandler}>Logout</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Nav;
