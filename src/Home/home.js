import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Styles/styles.css";
import Nav from "../Elements/nav";
import Footer from "../Elements/footer";
import Card from "../Elements/card";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      polls: [],
      tag: ""
    };
  }

  toObject(names, values) {
    let result = {};
    for (let i = 0; i < names.length; i++) result[names[i]] = values[i];
    return result;
  }

  changeVoteHandler(e) {
    let polls = this.state.polls;
    let user = this.state.user;
    let votedOn = user.pollsVotedOn;
    let keys = Object.keys(votedOn);
    let vals = Object.values(votedOn);
    let poll = JSON.parse(e.target.name);
    let answers = poll.answers;
    let votedOnIds = user.pollsVotedOnIds;
    const responses = poll.responses - 1;
    let index = Object.keys(votedOn).indexOf(poll._id);
    let votedArrIndex = votedOnIds.indexOf(poll._id);
    votedOnIds.splice(votedArrIndex, 1);
    keys.splice(index, 1);
    vals.splice(index, 1);
    votedOn = this.toObject(keys, vals);
    Object.values(poll.answers).forEach((ans, i) => {
      ans.forEach((id, j) => {
        if (id === user._id) {
          answers[i].splice(j, 1);
        }
      });
    });
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
          pollsVotedOn: votedOn,
          pollsVotedOnIds: votedOnIds
        },
        { withCredentials: true, credentials: "include" }
      )
    ]).then(res => {
      let newPoll = res[0].data.data.data;
      let pollIndex;
      polls.forEach((poll, i) => {
        if (poll.name === newPoll.name) {
          pollIndex = i;
        }
        newPoll.voted = false;
        polls[pollIndex] = newPoll;
        this.setState({
          polls,
          polls,
          user: res[1].data.data.user
        });
      });
    });
  }

  voteHandler(e) {
    let polls = this.state.polls;
    let poll = JSON.parse(e.target.name);
    let user = this.state.user;
    let pollIndex;
    polls.forEach((p, i) => {
      if (p.name === poll.name) {
        pollIndex = i;
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
      polls[pollIndex] = pollFinal;
      this.setState({
        polls: polls,
        user: user
      });
    });
  }

  deleteHandler(e) {
    let newPolls = this.state.polls;
    this.state.polls.forEach((poll, i) => {
      if (poll._id === e.target.name) {
        newPolls.splice(i, 1);
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
          polls: newPolls
        });
      });
  }

  homeNextHandler() {
    let num = this.state.page;
    if (num + 1 === this.state.pages) return;
    num = num + 1;
    this.setState({
      page: num
    });
  }

  Search(e) {
    this.setState({
      tag: e.target.value
    });
  }

  homeLastHandler() {
    let num = this.state.page;
    if (num === 0) return;
    num = num - 1;
    this.setState({
      page: num
    });
  }

  componentWillMount() {
    Promise.all([
      axios.get("https://pollmonarchapi.herokuapp.com/api/v1/users/me", {
        withCredentials: true,
        credentials: "include"
      }),
      axios.get("https://pollmonarchapi.herokuapp.com/api/v1/polls", {
        withCredentials: true,
        credentials: "include"
      })
    ]).then(res => {
      const user = res[0].data.data.data;
      let polls = res[1].data.data.data;
      polls.forEach((poll, i) => {
        if (Object.keys(user.pollsVotedOn).includes(poll._id)) {
          polls[i].voted = true;
        }
        if (user.pollsCreated.includes(poll._id)) {
          polls[i].created = true;
        }
      });
      let pages;
      if (polls.length % 4 === 0) {
        pages = polls.length / 4;
      } else {
        pages = Math.trunc(res[1].data.data.data.length / 4) + 1;
      }
      this.setState({
        user: user,
        polls: polls,
        pages: pages
      });
    });
  }

  SearchDatabase(e) {
    axios
      .post(
        "https://pollmonarchapi.herokuapp.com/api/v1/polls/tag",
        {
          tag: this.state.tag
        },
        { withCredentials: true, credentials: "include" }
      )
      .then(res => {
        let polls = res.data.data.data;
        const user = this.state.user;
        polls.forEach((poll, i) => {
          if (Object.keys(user.pollsVotedOn).includes(poll._id)) {
            polls[i].voted = true;
          }
          if (user.pollsCreated.includes(poll._id)) {
            polls[i].created = true;
          }
        });
        const pages = Math.ceil(polls.length / 4);
        this.setState({
          polls: polls,
          pages: pages,
          page: 0
        });
      });
  }

  Enter(e) {
    if (e.key === "Enter") {
      this.SearchDatabase();
    }
  }

  render() {
    return (
      <div className="home">
        <Nav />
        <div className="home-content">
          <div className="home-title">
            <h1>Welcome!</h1>
          </div>
          <div className="searchbar">
            <input
              placeholder='Suggested Searches: "politics", "sports", or "food"'
              onChange={this.Search.bind(this)}
              onKeyPress={this.Enter.bind(this)}
            />
            <button onClick={this.SearchDatabase.bind(this)}>Search</button>
          </div>
        </div>
        <hr className="break" />
        <div className="home-cards">
          {this.state.polls
            .slice(this.state.page * 4, this.state.page * 4 + 4)
            .map(poll => {
              let hidden = true;
              if (poll.created) {
                hidden = false;
              }
              return (
                <div className="home-card">
                  <Card
                    poll={poll}
                    user={this.state.user}
                    vote={this.voteHandler.bind(this)}
                    delete={this.deleteHandler.bind(this)}
                    change={this.changeVoteHandler.bind(this)}
                    deleteHidden={hidden}
                  />
                </div>
              );
            })}
        </div>
        <div className="home-pages">
          <button onClick={this.homeLastHandler.bind(this)}>Last</button>
          <p>
            <span>{this.state.page + 1}</span> of{" "}
            <span>{this.state.pages}</span>
          </p>
          <button onClick={this.homeNextHandler.bind(this)}>Next</button>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Home;
