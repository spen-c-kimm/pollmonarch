import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../Styles/styles.css";

class Welcome extends Component {
  render() {
    return (
      <div className="welcome">
        <div className="welcome-paragraph">
          <h1>My Polling App</h1>
          <hr />
          <p>
            As we all know, the polling industry over the past couple election
            cycles has faced criticism over the inaccuracy of their polls.
            Questions have arisen about whether those involved in these polls
            had bias or used proper research methods. In my opinion,
            transparency and proper context are the most important factors when
            determining the accuracy of a poll/survey, but accurately
            representing an entire country’s thoughts and feelings on any
            subject is easier said than done, especially a country as big and
            diverse as the U.S. This is what inspired me to make this app! With
            my polling app, you can create a poll, vote on a poll, search for a
            poll, and filter their results based on many different demographics
            such as: age, salary, gender, etc... Log in with the email:
            "test@gmail.com" and the password "pass12345" for the demo. Happy
            polling!
          </p>
        </div>
        <div className="welcome-buttons">
          <div className="welcome-buttons-sub">
            <Link to={"/login"}>
              <button>Log In</button>
            </Link>
            <br />
            <Link to={"/signup"}>
              <button>Sign Up</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;
