import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "../Styles/styles.css";
import Nav from "../Elements/nav";
import Footer from "../Elements/footer";

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Options: ["", ""]
    };
  }

  componentDidMount() {
    axios
      .get("https://pollmonarchapi.herokuapp.com/api/v1/users/me", {
        withCredentials: true,
        credentials: "include"
      })
      .then(res => {
        this.setState({
          user: res.data.data.data
        });
      });
  }

  addOptions() {
    let arr = this.state.Options;
    if (arr.length === 5) {
      return;
    }
    arr.push("");
    this.setState({
      Options: arr
    });
  }

  optionHandler(e) {
    if (e.target.name === "Name" || e.target.name === "Question") {
      this.setState({
        [e.target.name]: e.target.value
      });
      return;
    }
    let arr = this.state.Options;
    arr[Number(e.target.name)] = e.target.value;
    this.setState({
      Options: arr
    });
  }

  submitPoll() {
    let answers = {};
    let tags = this.state.Question.split(" ");
    tags.push(this.state.Name, this.state.Question);
    this.state.Options.forEach((_, i) => {
      answers[i] = [];
    });

    axios
      .post(
        "https://pollmonarchapi.herokuapp.com/api/v1/polls",
        {
          name: this.state.Name,
          question: this.state.Question,
          options: this.state.Options,
          answers: answers,
          responses: 0,
          colors: [
            "#4e79a7",
            "#f28e2c",
            "#e15759",
            "#76b7b2",
            "#59a14f",
            "#edc949"
          ],
          tags: tags
        },
        { withCredentials: true, credentials: "include" }
      )
      .then(res => {
        this.updateUser(res.data.data.data._id);
      });
  }

  updateUser(id) {
    let created = this.state.user.pollsCreated;
    created.push(id);
    axios
      .patch(
        `https://pollmonarchapi.herokuapp.com/api/v1/users/updateMe`,
        {
          pollsCreated: created
        },
        { withCredentials: true, credentials: "include" }
      )
      .then(res => {
        this.setState({
          redirect: true
        });
      });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/profile" />;
    }
    return (
      <div className="create">
        <Nav />
        <div className="create-content">
          <div className="create-heading">
            <h1>Create Your Own Poll!</h1>
          </div>
          <div>
            <h3>Poll Name</h3>
            <input name="Name" onChange={this.optionHandler.bind(this)} />
            <h3>Question</h3>
            <input name="Question" onChange={this.optionHandler.bind(this)} />
            <div className="results-options-container">
              <h3>Options</h3>
              <input
                name={0}
                key={0}
                onChange={this.optionHandler.bind(this)}
              />
              <input
                name={1}
                key={1}
                onChange={this.optionHandler.bind(this)}
              />
              {this.state.Options.slice(2).map((_, i) => {
                return (
                  <input
                    name={i + 2}
                    key={i + 2}
                    onChange={this.optionHandler.bind(this)}
                  />
                );
              })}
            </div>
          </div>
          <div className="create-buttons">
            <button onClick={this.addOptions.bind(this)}>Add Option</button>
            <button onClick={this.submitPoll.bind(this)}>Submit</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Create;
