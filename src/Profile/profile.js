import React, { cloneElement, Component } from "react";
import { BrowserRouter, Link, Redirect } from "react-router-dom";
import axios from "axios";
import "../Styles/styles.css";
import Traits from "../Elements/traits";
import Nav from "../Elements/nav";
import Footer from "../Elements/footer";
import Card from "../Elements/card";

const Years = [...Array(102).keys()];
const Days = [...Array(31).keys()];

const Months = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

// const Days = [
//   1,
//   2,
//   3,
//   4,
//   5,
//   6,
//   7,
//   8,
//   9,
//   10,
//   11,
//   12,
//   13,
//   14,
//   15,
//   16,
//   17,
//   18,
//   19,
//   20,
//   21,
//   22,
//   23,
//   24,
//   25,
//   26,
//   27,
//   28,
//   29,
//   30,
//   31
// ];

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "profile",
      voted: [],
      created: [],
      user: {},
      page: 0,
      pages: 0
    };
  }
  componentDidMount() {
    axios
      .get("https://pollmonarchapi.herokuapp.com/api/v1/users/me", {
        withCredentials: true,
        credentials: "include"
      })
      .then(res => {
        this.user(res.data.data.data);
      });
  }

  user(user) {
    const date = new Date(user.Birthday);
    this.setState({
      user: user,
      Birthday: user.Birthday,
      Month: Months[date.getMonth()],
      Day: date.getDate(),
      Year: date.getFullYear(),
      Gender: user.Gender,
      Race: user.Race,
      "Sexual Orientation": user["Sexual Orientation"],
      "Political Party": user["Political Party"],
      Education: user.Education,
      Salary: user.Salary,
      Religion: user.Religion,
      "Relationship Status": user["Relationship Status"],
      Community: user.Community,
      State: user.State,
      Height: user.Height,
      Feet: Math.floor(user.Height / 12),
      Inches: user.Height - Math.floor(user.Height / 12) * 12,
      Weight: user.Weight
    });
    let votedRequests = [];
    let createdRequests = [];
    Object.keys(user.pollsVotedOn).forEach(id => {
      votedRequests.push(
        axios.get(`https://pollmonarchapi.herokuapp.com/api/v1/polls/${id}`, {
          withCredentials: true,
          credentials: "include"
        })
      );
    });
    user.pollsCreated.forEach(id => {
      createdRequests.push(
        axios.get(`https://pollmonarchapi.herokuapp.com/api/v1/polls/${id}`, {
          withCredentials: true,
          credentials: "include"
        })
      );
    });
    Promise.allSettled(votedRequests).then(response => {
      let polls = [];
      response.forEach(res => {
        if (res.value.data.data.data.name !== "DELETED") {
          res.value.data.data.data.voted = true;
          polls.push(res.value.data.data.data);
        }
      });
      this.setState({
        voted: polls,
        pages: Math.ceil(polls.length / 2)
      });
    });
    Promise.allSettled(createdRequests).then(response => {
      let polls = [];
      response.forEach(res => {
        if (res.value.data.data.data.name !== "DELETED") {
          polls.push(res.value.data.data.data);
        }
      });
      this.setState({
        created: polls
      });
    });
  }

  nextHandler(e) {
    let page = this.state.page;
    if (page === this.state.pages - 1) {
      return;
    }
    this.setState({
      page: page + 1
    });
  }

  lastHandler(e) {
    let page = this.state.page;
    if (page === 0) {
      return;
    }
    this.setState({
      page: page - 1
    });
  }

  update() {
    const date = new Date(
      `${this.state.Month}/${this.state.Day}/${this.state.Year}`
    );
    const milliseconds = date.getTime();
    axios
      .patch(
        `https://pollmonarchapi.herokuapp.com/api/v1/users/updateMe`,
        {
          Birthday: milliseconds,
          Gender: this.state.Gender,
          Race: this.state.Race,
          "Sexual Orientation": this.state["Sexual Orientation"],
          "Political Party": this.state["Political Party"],
          Education: this.state.Education,
          Salary: this.state.Salary,
          Religion: this.state.Religion,
          "Relationship Status": this.state["Relationship Status"],
          Community: this.state.Community,
          State: this.state.State,
          Height: Number(this.state.Feet * 12) + Number(this.state.Inches),
          Weight: this.state.Weight,
          "Hair Color": this.state["Hair Color"],
          "Eye Color": this.state["Eye Color"]
        },
        {
          withCredentials: true,
          credentials: "include"
        }
      )
      .then(alert("success"));
  }

  voteHandler(e) {
    let voted = this.state.voted;
    let created = this.state.created;
    let poll = JSON.parse(e.target.name);
    let user = this.state.user;
    let votedIndex;
    let createdIndex;
    voted.forEach((p, i) => {
      if (p.name === poll.name) {
        votedIndex = i;
      }
    });
    created.forEach((p, i) => {
      if (p.name === poll.name) {
        createdIndex = i;
      }
    });
    let answerIndex = e.target.value;
    let responses = poll.responses;
    let answers = poll.answers;
    let pollsVoted = user.pollsVotedOn;
    let pollsVotedIds = user.pollsVotedOnIds;
    pollsVotedIds.push(poll._id);
    responses += 1;
    answers[answerIndex].push(user._id);
    pollsVoted[poll._id] = Number(answerIndex);

    Promise.all([
      axios.patch(
        `https://pollmonarchapi.herokuapp.com/api/v1/polls/${poll._id}`,
        {
          answers: answers,
          responses: responses
        },
        { withCredentials: true, credentials: "include" }
      ),
      axios.patch(
        `https://pollmonarchapi.herokuapp.com/api/v1/users/updateMe`,
        {
          pollsVotedOn: pollsVoted,
          pollsVotedOnIds: pollsVotedIds
        },
        { withCredentials: true, credentials: "include" }
      )
    ]).then(res => {
      const pollFinal = res[0].data.data.data;
      const user = res[1].data.data.user;
      pollFinal.voted = true;
      voted[votedIndex] = pollFinal;
      created[createdIndex] = pollFinal;
      this.setState({
        voted: voted,
        created: created,
        user: user
      });
    });
  }

  deleteHandler(e) {
    let newVoted = this.state.voted;
    let newCreated = this.state.created;
    this.state.voted.forEach((poll, i) => {
      if (poll._id === poll._id) {
        newVoted.splice(i, 1);
      }
    });
    this.state.created.forEach((poll, i) => {
      if (poll._id === poll._id) {
        newCreated.splice(i, 1);
      }
    });
    axios
      .delete(
        `https://pollmonarchapi.herokuapp.com/api/v1/polls/${e.target.name}`,
        {
          withCredentials: true,
          credentials: "include"
        }
      )
      .then(res => {
        this.setState({
          voted: newVoted,
          created: newCreated
        });
      });
  }

  changeVoteHandler(e) {
    const user = this.state.user;
    let poll = JSON.parse(e.target.name);
    let answers = poll.answers;
    const responses = poll.responses - 1;
    Object.values(poll.answers).forEach((ans, i) => {
      ans.forEach((id, j) => {
        if (id === user._id) {
          answers[i].splice(j, 1);
        }
      });
    });
    let voted = this.state.voted;
    let created = this.state.created;
    let createdIDs = user.pollsCreated;
    let votedIDS = user.pollsVotedOn;
    let votedIdsArr = user.pollsVotedOnIds;
    let keys = Object.keys(votedIDS);
    let vals = Object.values(votedIDS);
    const createdIndex = createdIDs.indexOf(poll._id);
    createdIDs.splice(createdIndex, 1);
    const votedIndex = Object.keys(votedIDS).indexOf(poll._id);
    let arrIndex = votedIdsArr.indexOf(poll._id);
    keys.splice(votedIndex, 1);
    vals.splice(votedIndex, 1);
    votedIdsArr.splice(arrIndex, 1);
    votedIDS = this.toObject(keys, vals);
    Promise.all([
      axios.patch(
        `https://pollmonarchapi.herokuapp.com/api/v1/polls/${poll._id}`,
        {
          answers: answers,
          responses: responses
        },
        { withCredentials: true, credentials: "include" }
      ),
      axios.patch(
        `https://pollmonarchapi.herokuapp.com/api/v1/users/updateMe`,
        {
          pollsVotedOn: votedIDS,
          pollsVotedOnIds: votedIdsArr
        },
        { withCredentials: true, credentials: "include" }
      )
    ]).then(res => {
      let newPoll = res[0].data.data.data;
      const newUser = res[1].data.data.user;
      let votedI;
      let createdI;
      newPoll.voted = false;
      voted.forEach((poll, i) => {
        if (poll.name === newPoll.name) {
          votedI = i;
        }
      });
      created.forEach((poll, i) => {
        if (poll.name === newPoll.name) {
          createdI = i;
        }
      });
      created[createdI] = newPoll;
      voted[votedI] = newPoll;
      this.setState({
        user: newUser,
        voted: voted,
        created: created
      });
    });
  }

  toObject(names, values) {
    let result = {};
    for (let i = 0; i < names.length; i++) result[names[i]] = values[i];
    return result;
  }

  deleteAccount() {
    axios
      .delete(`https://pollmonarchapi.herokuapp.com/api/v1/users/deleteMe`, {
        withCredentials: true,
        credentials: "include"
      })
      .then(
        this.setState({
          redirect: true
        })
      );
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }

    if (this.state.active === "voted") {
      return (
        <div className="profile">
          <Nav />
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-header-buttons">
                <button
                  onClick={() => {
                    this.setState({
                      active: "profile"
                    });
                  }}
                >
                  User Info
                </button>
                <button
                  onClick={() => {
                    this.setState({
                      page: 0,
                      active: "created",
                      pages: Math.ceil(this.state.created.length / 2)
                    });
                  }}
                >
                  Created Polls
                </button>
                <button
                  onClick={() => {
                    this.setState({
                      page: 0,
                      active: "voted",
                      pages: Math.ceil(this.state.voted.length / 2)
                    });
                  }}
                >
                  Polls Voted On
                </button>
              </div>
              <div className="profile-content">
                {this.state.voted
                  .slice(this.state.page * 2, this.state.page * 2 + 2)
                  .map(poll => {
                    let hidden = true;
                    if (this.state.user.pollsCreated.includes(poll._id)) {
                      hidden = false;
                    }
                    return (
                      <div className="profile-card">
                        <Card
                          poll={poll}
                          user={this.state.user}
                          width="45%"
                          margin="1%"
                          change={this.changeVoteHandler.bind(this)}
                          vote={this.voteHandler.bind(this)}
                          delete={this.deleteHandler.bind(this)}
                          deleteHidden={hidden}
                        />
                      </div>
                    );
                  })}
              </div>
              <div className="profile-pages">
                <button onClick={this.lastHandler.bind(this)}>Last</button>
                <p>
                  <span>{this.state.page + 1}</span> of{" "}
                  <span>{this.state.pages}</span>
                </p>
                <button onClick={this.nextHandler.bind(this)}>Next</button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    if (this.state.active === "created") {
      return (
        <div className="profile">
          <Nav />
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-header-buttons">
                <button
                  onClick={() => {
                    this.setState({
                      active: "profile"
                    });
                  }}
                >
                  User Info
                </button>
                <button
                  onClick={() => {
                    this.setState({
                      page: 0,
                      active: "created",
                      pages: Math.ceil(this.state.created.length / 2)
                    });
                  }}
                >
                  Created Polls
                </button>
                <button
                  onClick={() => {
                    this.setState({
                      page: 0,
                      active: "voted",
                      pages: Math.ceil(this.state.voted.length / 2)
                    });
                  }}
                >
                  Polls Voted On
                </button>
              </div>
              <div className="profile-content">
                {this.state.created
                  .slice(this.state.page * 2, this.state.page * 2 + 2)
                  .map(poll => {
                    let hidden = false;
                    if (
                      Object.keys(this.state.user.pollsVotedOn).includes(
                        poll._id
                      )
                    ) {
                      poll.voted = true;
                    }
                    return (
                      <div className="profile-card">
                        <Card
                          poll={poll}
                          user={this.state.user}
                          width="45%"
                          margin="1%"
                          change={this.changeVoteHandler.bind(this)}
                          vote={this.voteHandler.bind(this)}
                          delete={this.deleteHandler.bind(this)}
                          deleteHidden={hidden}
                        />
                      </div>
                    );
                  })}
              </div>
              <div className="profile-pages">
                <button onClick={this.lastHandler.bind(this)}>Last</button>
                <p>
                  <span>{this.state.page + 1}</span> of{" "}
                  <span>{this.state.pages}</span>
                </p>
                <button onClick={this.nextHandler.bind(this)}>Next</button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }

    if (this.state.active === "profile") {
      return (
        <div className="profile">
          <Nav />
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-header-buttons">
                <button
                  onClick={() => {
                    this.setState({
                      active: "profile"
                    });
                  }}
                >
                  User Info
                </button>
                <button
                  onClick={() => {
                    this.setState({
                      page: 0,
                      active: "created",
                      pages: Math.ceil(this.state.created.length / 2)
                    });
                  }}
                >
                  Created Polls
                </button>
                <button
                  onClick={() => {
                    this.setState({
                      page: 0,
                      active: "voted",
                      pages: Math.ceil(this.state.voted.length / 2)
                    });
                  }}
                >
                  Polls Voted On
                </button>
              </div>
            </div>
            <div className="profile-content">
              <div className="profile-user-info">
                {Object.keys(Traits).map(cat => {
                  if (cat === "Birthday") {
                    return (
                      <div className="profile-trait">
                        <h3>{cat}</h3>
                        <select
                          value={this.state.Month}
                          style={{ width: "20%" }}
                          onChange={e => {
                            this.setState({
                              Month: e.target.value
                            });
                          }}
                        >
                          {Months.map(month => {
                            return <option value={month}>{month}</option>;
                          })}
                        </select>
                        <select
                          style={{ width: "15%" }}
                          value={this.state.Day}
                          onChange={e => {
                            this.setState({
                              Day: e.target.value
                            });
                          }}
                        >
                          {Days.map(day => {
                            return <option value={day}>{day}</option>;
                          })}
                        </select>
                        <select
                          value={this.state.Year}
                          style={{ width: "15%" }}
                          onChange={e => {
                            this.setState({
                              Year: e.target.value
                            });
                          }}
                        >
                          {Years.map(year => {
                            return (
                              <option value={year + 1920}>{year + 1920}</option>
                            );
                          })}
                        </select>
                      </div>
                    );
                  }
                  if (cat === "Salary" || cat === "Weight") {
                    return (
                      <div className="profile-trait">
                        <h3>{cat}</h3>
                        <input
                          defaultValue={this.state[cat]}
                          onChange={e => {
                            this.setState({
                              [cat]: e.target.value
                            });
                          }}
                        />
                      </div>
                    );
                  }

                  if (cat === "Height") {
                    const style = { width: "25%" };
                    return (
                      <div className="profile-trait">
                        <h3>{cat}</h3>
                        <select
                          style={style}
                          value={this.state.Feet}
                          onChange={e => {
                            this.setState({
                              Feet: e.target.value
                            });
                          }}
                        >
                          {[...Array(8).keys()].slice(3).map(feet => {
                            return <option value={feet}>{feet}</option>;
                          })}
                        </select>
                        <select
                          style={style}
                          value={this.state.Inches}
                          onChange={e => {
                            this.setState({
                              Inches: e.target.value
                            });
                          }}
                        >
                          {[...Array(12).keys()].map(inch => {
                            return <option>{inch}</option>;
                          })}
                        </select>
                      </div>
                    );
                  }
                  return (
                    <div className="profile-trait">
                      <h3>{cat}</h3>{" "}
                      <select
                        onChange={e => {
                          this.setState({
                            [cat]: e.target.value
                          });
                        }}
                        value={this.state[cat]}
                      >
                        {Traits[cat].map(demo => {
                          return (
                            <option key={demo} value={demo}>
                              {demo}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="profile-update">
              <button
                className="delete"
                onClick={this.deleteAccount.bind(this)}
              >
                Delete Account
              </button>
              <button className="update" onClick={this.update.bind(this)}>
                Update Account
              </button>
            </div>
          </div>
          <Footer />
        </div>
      );
    }
  }
}

export default Profile;
