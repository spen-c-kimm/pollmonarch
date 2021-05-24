import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../Styles/styles.css";

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.poll.voted) {
      return (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <h3>{this.props.poll.question}</h3>
            </div>
          </div>
          <div className="card-graph">
            {Object.values(this.props.poll.answers).map((arr, i) => {
              let percent = Math.round(
                (arr.length / this.props.poll.responses) * 100
              );
              let border = "none";
              if (this.props.user.pollsVotedOn[this.props.poll._id] === i) {
                border = "2px solid black";
              }
              let top = {};
              let bottom = {};
              if (percent === 0) {
                top = { height: "90%" };
                bottom = {
                  borderTop: border,
                  borderLeft: border,
                  borderRight: border,
                  height: "10%",
                  background: "black",
                  background: `${this.props.poll.colors[i]}`
                };
              } else {
                top = { height: `${100 - percent}%` };
                bottom = {
                  borderTop: border,
                  borderLeft: border,
                  borderRight: border,
                  height: `${percent}%`,
                  background: "black",
                  background: `${this.props.poll.colors[i]}`
                };
              }
              return (
                <div className="card-bar">
                  <div className="card-bar-top" style={top}></div>
                  <div className="card-bar-bottom" style={bottom}>
                    {percent}%
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card-key">
            <div className="card-legend">
              {this.props.poll.options.map((option, i) => {
                return (
                  <div className="card-option">
                    <button
                      className="card-legend-color"
                      style={{
                        background: this.props.poll.colors[i],
                        borderRadius: "10px"
                      }}
                    ></button>{" "}
                    <p>{option}</p>
                  </div>
                );
              })}
            </div>
            <div className="card-bottom">
              <h6>Responses: {this.props.poll.responses}</h6>
              <div className="card-bottom-buttons">
                <button
                  name={JSON.stringify(this.props.poll)}
                  onClick={e => this.props.change(e)}
                >
                  Revote
                </button>
                <button
                  name={this.props.poll._id}
                  hidden={this.props.deleteHidden}
                  onClick={e => this.props.delete(e)}
                >
                  Delete
                </button>
                <Link to={`/results/${this.props.poll._id}`}>
                  <button>Filters</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <h3>{this.props.poll.question}</h3>
          </div>
        </div>
        <div className="card-options-buttons">
          {this.props.poll.options.map((option, i) => {
            return (
              <button
                name={JSON.stringify(this.props.poll)}
                value={i}
                onClick={e => this.props.vote(e)}
              >
                {option}
              </button>
            );
          })}
        </div>
        <div className="card-bottom-buttons">
          <h6>Responses: {this.props.poll.responses}</h6>
          <button
            name={this.props.poll._id}
            hidden={this.props.deleteHidden}
            onClick={e => this.props.delete(e)}
          >
            Delete
          </button>
          <Link to={`/results/${this.props.poll._id}`}>
            <button>Filters</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Card;
