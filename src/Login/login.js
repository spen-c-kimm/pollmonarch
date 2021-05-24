import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "../Styles/styles.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: "",
      Password: "",
      redirect: false
    };
  }

  inputHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  loginHandler() {
    this.setState({
      loading: true
    });
    axios
      .post(
        `https://pollmonarchapi.herokuapp.com/api/v1/users/login`,
        {
          email: this.state.Email,
          password: this.state.Password
        },
        { withCredentials: true, credentials: "include" }
      )
      .then(res => {
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + res.data.token;
        this.setState({
          redirect: true,
          loading: false
        });
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="login">
          <div className="login-container">
            <div class="loader"></div>
          </div>
        </div>
      );
    }
    if (this.state.redirect) {
      return <Redirect to="/home" />;
    }
    return (
      <div className="login">
        <div className="login-container">
          <div className="login-container-contents">
            <div>
              <h3>Email</h3>
              <input
                placeholder='Use: "test@gmail.com"'
                name="Email"
                onChange={this.inputHandler.bind(this)}
              />
              <h3>Password</h3>
              <input
                placeholder='Use: "pass12345"'
                name="Password"
                onChange={this.inputHandler.bind(this)}
              />
            </div>
            <div>
              <button onClick={this.loginHandler.bind(this)}>Login</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
