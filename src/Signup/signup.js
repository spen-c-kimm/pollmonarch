import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "../Styles/styles.css";
import Traits from "../Elements/traits";
import Calendar from "../Elements/calendar";

let days = [...Array(32).keys()];
let years = [...Array(102).keys()];
years = years.map(num => num + 1920);
days.shift();
years.shift();

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Page: 0,
      Redirect: false,
      nextDisabled: false,
      submitDisabled: true,
      percentage: 0
    };
  }

  keys = Object.keys(Traits);

  groups = [
    ["Name", "Email", "Password", "Confirm Password"],
    this.keys.slice(0, 4),
    this.keys.slice(4, 7),
    this.keys.slice(7, 11),
    this.keys.slice(11, 15)
  ];

  nextHandler() {
    const num = this.state.Page + 1;
    let finished = true;
    if (num === 1 || num === 3 || num === 4) {
      this.groups[num - 1].forEach(cat => {
        if (!this.state[cat]) {
          finished = false;
        }
      });
    }
    if (num === 2) {
      if (
        !this.state["Month"] ||
        !this.state["Day"] ||
        !this.state["Year"] ||
        !this.state["Gender"] ||
        !this.state["Race"]
      ) {
        finished = false;
      }
    }
    if (!finished) return;
    this.setState({
      Page: num,
      percentage: num * 20
    });
    if (num === 4) {
      this.setState({
        nextDisabled: true,
        submitDisabled: false
      });
    }
  }

  submitHandler() {
    let finished = true;
    if (this.state.Page === 4) {
      if (
        !this.state["Feet"] ||
        !this.state["Inches"] ||
        !this.state["Weight"] ||
        !this.state["Hair Color"] ||
        !this.state["Eye Color"]
      ) {
        finished = false;
      }
    }
    if (!finished) return;
    this.setState({
      percentage: 100
    });

    let height = Number(this.state.Feet * 12) + Number(this.state.Inches);
    let date = this.state.Month + "/" + this.state.Day + "/" + this.state.Year;
    date = new Date(date);
    let time = date.getTime();
    this.setState(
      {
        Birthday: time,
        Height: height
      },
      () => {
        axios
          .post(
            "https://pollmonarchapi.herokuapp.com/api/v1/users/signup",
            {
              name: this.state.Name,
              email: this.state.Email,
              password: this.state.Password,
              passwordConfirm: this.state["Confirm Password"],
              Birthday: this.state.Birthday,
              Gender: this.state.Gender,
              Race: this.state.Race,
              "Sexual Orientation": this.state["Sexual Orientation"],
              "Political Party": this.state["Political Party"],
              "Relationship Status": this.state["Relationship Status"],
              Education: this.state.Education,
              Salary: Number(this.state.Salary),
              Religion: this.state.Religion,
              Community: this.state.Community,
              State: this.state.State,
              Height: this.state.Height,
              Weight: Number(this.state.Weight),
              "Hair Color": this.state["Hair Color"],
              "Eye Color": this.state["Eye Color"]
            },
            { withCredentials: true, credentials: "include" }
          )
          .then(res => {
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + res.data.token;
            this.setState({
              Redirect: true
            });
          });
      }
    );
  }

  traitsHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    if (this.state.Redirect) {
      return <Redirect to="/home" />;
    }
    return (
      <div className="signup">
        <div className="signup-traits-content">
          <div className="signup-progress-bar">
            <div
              style={{
                width: `${this.state.percentage}%`,
                height: "31px",
                background: "black"
              }}
              className="progress-percentage"
            >
              <h2>{this.state.percentage}%</h2>
            </div>
          </div>
          <div className="signup-traits">
            {this.groups[this.state.Page].map(cat => {
              if (this.state.Page === 0) {
                return (
                  <div>
                    <h3>{cat}</h3>
                    <input
                      key={cat}
                      name={cat}
                      onChange={this.traitsHandler.bind(this)}
                    />
                  </div>
                );
              }
              if (cat === "Salary") {
                return (
                  <div>
                    <h3>{cat}</h3>
                    <input
                      placeholder="$"
                      key={cat}
                      name={cat}
                      onChange={this.traitsHandler.bind(this)}
                    />
                  </div>
                );
              }
              if (cat === "Weight") {
                return (
                  <div>
                    <h3>{cat}</h3>
                    <input
                      placeholder="lbs"
                      key={cat}
                      name={cat}
                      onChange={this.traitsHandler.bind(this)}
                    />
                  </div>
                );
              }
              if (cat === "Birthday") {
                return (
                  <div>
                    <h3>{cat}</h3>
                    <select
                      key="Month"
                      onChange={this.traitsHandler.bind(this)}
                      name="Month"
                    >
                      <option>Month</option>
                      {Object.keys(Calendar).map(month => {
                        return <option value={month}>{month}</option>;
                      })}
                    </select>
                    <select
                      key="Day"
                      onChange={this.traitsHandler.bind(this)}
                      name="Day"
                    >
                      <option>Day</option>
                      {days.map(day => {
                        return <option value={day}>{day}</option>;
                      })}
                    </select>
                    <select
                      key="Year"
                      onChange={this.traitsHandler.bind(this)}
                      name="Year"
                    >
                      <option>Year</option>
                      {years.map(year => {
                        return <option value={year}>{year}</option>;
                      })}
                    </select>
                  </div>
                );
              }

              if (cat === "Height") {
                return (
                  <div>
                    <h3>{cat}</h3>
                    <input
                      placeholder="Feet"
                      key="Feet"
                      onChange={this.traitsHandler.bind(this)}
                      name="Feet"
                    />
                    <input
                      placeholder="Inches"
                      key="Inches"
                      onChange={this.traitsHandler.bind(this)}
                      name="Inches"
                    />
                  </div>
                );
              }

              return (
                <div>
                  <h3>{cat}</h3>
                  <select
                    key={cat}
                    name={cat}
                    onChange={this.traitsHandler.bind(this)}
                  >
                    <option>Select</option>
                    {Traits[cat].map(demo => {
                      return <option value={demo}>{demo}</option>;
                    })}
                  </select>
                </div>
              );
            })}
          </div>
          <div className="signup-bottom-buttons">
            <button
              className="signup-next"
              disabled={this.state.nextDisabled}
              onClick={this.nextHandler.bind(this)}
            >
              Next
            </button>
            <button
              className="signup-submit"
              disabled={this.state.submitDisabled}
              onClick={this.submitHandler.bind(this)}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
