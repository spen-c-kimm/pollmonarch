import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Styles/styles.css";
import Nav from "../Elements/nav";
import Footer from "../Elements/footer";
import Traits from "../Elements/traits";

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "Gender",
      selectedTraits: [],
      poll: {
        options: []
      },
      accumulator: [0, 0, 0, 0, 0],
      percentages: [],
      NoResults: true,
      Age: [],
      Salary: [],
      Weight: [],
      Height: [3, 0, 3, 0]
    };
  }

  componentWillMount() {
    axios
      .get(
        `https://pollmonarchapi.herokuapp.com/api/v1/polls/${this.props.match.params.id}`,
        {
          withCredentials: true,
          credentials: "include"
        }
      )
      .then(res => {
        const poll = res.data.data.data;
        let percentages = [];
        let accArr = [];
        let acc = 0;
        let accumulator = [0, 0, 0, 0, 0];
        Object.values(poll.answers).forEach(answers => {
          percentages.push(Math.round((answers.length / poll.responses) * 100));
          acc += (answers.length / poll.responses) * 100;
          accArr.push(acc);
        });
        accArr.forEach((num, i) => {
          accumulator[i] = num;
        });
        this.setState({
          poll: poll,
          responses: poll.responses,
          percentages: percentages,
          accumulator: accumulator
        });
      });
  }

  filterRanges(category, button) {
    let arr = this.state.selectedTraits;
    arr.forEach((el, i) => {
      if (el.startsWith(category)) {
        arr.splice(i, 1);
      }
    });
    if (button === "Submit") {
      if (category === "Age") {
        arr.push(
          `${category}: ${this.state[category][0]} To ${this.state[category][1]} Years Old`
        );
      }
      if (category === "Salary") {
        arr.push(
          `${category}: $${this.state[category][0]} To $${this.state[category][1]}`
        );
      }
      if (category === "Weight") {
        arr.push(
          `${category}: ${this.state[category][0]} To ${this.state[category][1]} Lbs`
        );
      }
      if (category === "Height") {
        arr.push(
          `${category}: ${this.state[category][0]}'${this.state[category][1]}" To ${this.state[category][2]}'${this.state[category][3]}"`
        );
      }
    }
    this.setState({
      selectedTraits: arr
    });
    if (arr.length === 0) {
      const poll = this.state.poll;
      let tempPercentages = [];
      let tempAccArr = [];
      let tempAcc = 0;
      let tempAccumulator = [0, 0, 0, 0, 0];
      Object.values(poll.answers).forEach(answers => {
        tempPercentages.push(
          Math.round((answers.length / poll.responses) * 100)
        );
        tempAcc += (answers.length / poll.responses) * 100;
        tempAccArr.push(tempAcc);
      });
      tempAccArr.forEach((num, i) => {
        tempAccumulator[i] = num;
      });
      this.setState({
        responses: poll.responses,
        percentages: tempPercentages,
        accumulator: tempAccumulator
      });
      return;
    }
    let query = {};
    arr.forEach(trait => {
      Object.keys(Traits).forEach(cat => {
        if (trait.startsWith(cat)) {
          query[cat] = this.state[cat];
        }
        if (trait.startsWith("Age")) {
          query["Birthday"] = this.state["Age"];
        }
        if (Traits[cat].includes(trait)) {
          query[cat] = trait;
        }
      });
    });

    let requests = [];
    Object.values(this.state.poll.answers).forEach(arr => {
      query["_id"] = arr;
      requests.push(
        axios.post(
          `https://pollmonarchapi.herokuapp.com/api/v1/users/filter`,
          {
            query: query
          },
          {
            withCredentials: true,
            credentials: "include"
          }
        )
      );
    });
    Promise.all(requests, {
      withCredentials: true,
      credentials: "include"
    }).then(response => {
      let numerator = [];
      let denominator = 0;
      let percentage = [0, 0, 0, 0, 0];
      let acc = 0;
      let accArr = [0, 0, 0, 0, 0];
      response.forEach(res => {
        numerator.push(res.data.results);
        denominator += Number(res.data.results);
      });
      if (denominator !== 0) {
        numerator.forEach((num, i) => {
          percentage[i] = Math.round((num / denominator) * 100);
          acc += Math.round((num / denominator) * 100);
          accArr[i] = acc;
        });
      }
      this.setState({
        percentages: percentage,
        accumulator: accArr,
        responses: denominator
      });
    });
  }

  filter(e) {
    let arr = this.state.selectedTraits;
    if (arr.includes(e.target.name)) {
      arr.splice(arr.indexOf(e.target.name, 1));
      this.setState({
        selectedTraits: arr
      });
      if (arr.length === 0) {
        if (arr.length === 0) {
          const poll = this.state.poll;
          let tempPercentages = [];
          let tempAccArr = [];
          let tempAcc = 0;
          let tempAccumulator = [0, 0, 0, 0, 0];
          Object.values(poll.answers).forEach(answers => {
            tempPercentages.push(
              Math.round((answers.length / poll.responses) * 100)
            );
            tempAcc += (answers.length / poll.responses) * 100;
            tempAccArr.push(tempAcc);
          });
          tempAccArr.forEach((num, i) => {
            tempAccumulator[i] = num;
          });
          this.setState({
            responses: poll.responses,
            percentages: tempPercentages,
            accumulator: tempAccumulator
          });
          return;
        }
      } else {
        let query = {};
        arr.forEach(trait => {
          Object.keys(Traits).forEach(cat => {
            if (trait.startsWith(cat)) {
              query[cat] = this.state[cat];
            }
            if (trait.startsWith("Age")) {
              query["Birthday"] = this.state["Age"];
            }
            if (Traits[cat].includes(trait)) {
              query[cat] = trait;
            }
          });
        });

        let requests = [];
        Object.values(this.state.poll.answers).forEach(arr => {
          query["_id"] = arr;
          requests.push(
            axios.post(
              `https://pollmonarchapi.herokuapp.com/api/v1/users/filter`,
              {
                query: query
              },
              {
                withCredentials: true,
                credentials: "include"
              }
            )
          );
        });
        Promise.all(requests, {
          withCredentials: true,
          credentials: "include"
        }).then(response => {
          let numerator = [];
          let denominator = 0;
          let percentage = [0, 0, 0, 0, 0];
          let acc = 0;
          let accArr = [0, 0, 0, 0, 0];
          response.forEach(res => {
            numerator.push(res.data.results);
            denominator += Number(res.data.results);
          });
          if (denominator !== 0) {
            numerator.forEach((num, i) => {
              percentage[i] = Math.round((num / denominator) * 100);
              acc += Math.round((num / denominator) * 100);
              accArr[i] = acc;
            });
          }
          this.setState({
            percentages: percentage,
            accumulator: accArr,
            responses: denominator
          });
        });
      }
      return;
    }
    Traits[this.state.selected].forEach(trait => {
      if (arr.includes(trait)) {
        const index = arr.indexOf(trait);
        arr.splice(index, 1);
      }
    });
    arr.push(e.target.name);
    this.setState({
      selectedTraits: arr
    });

    let query = {};
    arr.forEach(trait => {
      Object.keys(Traits).forEach(cat => {
        if (trait.startsWith(cat)) {
          query[cat] = this.state[cat];
        }
        if (trait.startsWith("Age")) {
          query["Birthday"] = this.state["Age"];
        }
        if (Traits[cat].includes(trait)) {
          query[cat] = trait;
        }
      });
    });

    let requests = [];
    Object.values(this.state.poll.answers).forEach(arr => {
      query["_id"] = arr;
      requests.push(
        axios.post(
          `https://pollmonarchapi.herokuapp.com/api/v1/users/filter`,
          {
            query: query
          },
          {
            withCredentials: true,
            credentials: "include"
          }
        )
      );
    });
    Promise.all(requests, {
      withCredentials: true,
      credentials: "include"
    }).then(response => {
      let numerator = [];
      let denominator = 0;
      let percentage = [0, 0, 0, 0, 0];
      let acc = 0;
      let accArr = [0, 0, 0, 0, 0];
      response.forEach(res => {
        numerator.push(res.data.results);
        denominator += Number(res.data.results);
      });
      if (denominator !== 0) {
        numerator.forEach((num, i) => {
          percentage[i] = Math.round((num / denominator) * 100);
          acc += Math.round((num / denominator) * 100);
          accArr[i] = acc;
        });
      }
      this.setState({
        percentages: percentage,
        accumulator: accArr,
        responses: denominator
      });
    });
  }

  render() {
    return (
      <div className="results">
        <Nav />
        <div className="results-container">
          <div className="results-filters">
            <div className="results-filters-side">
              <div className="results-filters-side-buttons">
                {Object.keys(Traits).map(cat => {
                  if (cat === "Birthday") {
                    return (
                      <button
                        onClick={() =>
                          this.setState({
                            selected: cat
                          })
                        }
                      >
                        Age
                      </button>
                    );
                  }
                  return (
                    <button
                      onClick={() =>
                        this.setState({
                          selected: cat
                        })
                      }
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="traits-and-selected">
              <div className="results-traits">
                {Traits[this.state.selected].map(trait => {
                  if (trait === "Age") {
                    return (
                      <div className="results-age">
                        <h3>{trait}</h3>
                        <div className="results-age-content">
                          <h6>Between</h6>
                          <input
                            onChange={e => {
                              let arr = this.state.Age;
                              arr[0] = Number(e.target.value);
                              this.setState({
                                Age: arr
                              });
                            }}
                          />
                          <h6>And</h6>
                          <input
                            onChange={e => {
                              let arr = this.state.Age;
                              arr[1] = Number(e.target.value);
                              this.setState({
                                Age: arr
                              });
                            }}
                          />
                          <h6>Years Old</h6>
                        </div>
                        <div className="results-submit-buttons">
                          <button
                            onClick={() => {
                              this.filterRanges("Age", "Submit");
                            }}
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => this.filterRanges("Age", "Remove")}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  }
                  if (trait === "Salary") {
                    return (
                      <div className="results-age">
                        <h3>{trait}</h3>
                        <div className="results-age-content">
                          <h6>Between</h6>
                          <input
                            placeholder="$"
                            onChange={e => {
                              let arr = this.state.Salary;
                              arr[0] = Number(e.target.value);
                              this.setState({
                                Salary: arr
                              });
                            }}
                          />
                          <h6>And</h6>
                          <input
                            placeholder="$"
                            onChange={e => {
                              let arr = this.state.Salary;
                              arr[1] = Number(e.target.value);
                              this.setState({
                                Salary: arr
                              });
                            }}
                          />
                        </div>
                        <div className="results-submit-buttons">
                          <button
                            onClick={() => {
                              this.filterRanges("Salary", "Submit");
                            }}
                          >
                            Submit
                          </button>
                          <button
                            onClick={() =>
                              this.filterRanges("Salary", "Remove")
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  }
                  if (trait === "Weight") {
                    return (
                      <div className="results-age">
                        <h3>{trait}</h3>
                        <div className="results-age-content">
                          <h6>Between</h6>
                          <input
                            placeholder="lbs"
                            onChange={e => {
                              let arr = this.state.Weight;
                              arr[0] = Number(e.target.value);
                              this.setState({
                                Weight: arr
                              });
                            }}
                          />
                          <h6>And</h6>
                          <input
                            placeholder="lbs"
                            onChange={e => {
                              let arr = this.state.Weight;
                              arr[1] = Number(e.target.value);
                              this.setState({
                                Weight: arr
                              });
                            }}
                          />
                        </div>
                        <div className="results-submit-buttons">
                          <button
                            onClick={() => {
                              this.filterRanges("Weight", "Submit");
                            }}
                          >
                            Submit
                          </button>
                          <button
                            onClick={() =>
                              this.filterRanges("Weight", "Remove")
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  }
                  if (trait === "Height") {
                    return (
                      <div className="results-age">
                        <h3>{trait}</h3>
                        <div className="results-age-content">
                          <h6>Between</h6>
                          <select
                            onChange={e => {
                              let arr = this.state["Height"];
                              arr[0] = Number(e.target.value);
                              this.setState({
                                Height: arr
                              });
                            }}
                          >
                            {[...Array(8).keys()].slice(3).map(feet => {
                              return <option value={feet}>{feet}</option>;
                            })}
                          </select>
                          <select
                            onChange={e => {
                              let arr = this.state["Height"];
                              arr[1] = Number(e.target.value);
                              this.setState({
                                Height: arr
                              });
                            }}
                          >
                            {[...Array(12).keys()].map(inches => {
                              return <option value={inches}>{inches}</option>;
                            })}
                          </select>
                          <h6>And</h6>
                          <select
                            onChange={e => {
                              let arr = this.state["Height"];
                              arr[2] = Number(e.target.value);
                              this.setState({
                                Height: arr
                              });
                            }}
                          >
                            {[...Array(8).keys()].slice(3).map(feet => {
                              return <option value={feet}>{feet}</option>;
                            })}
                          </select>
                          <select
                            onChange={e => {
                              let arr = this.state["Height"];
                              arr[3] = Number(e.target.value);
                              this.setState({
                                Height: arr
                              });
                            }}
                          >
                            {[...Array(12).keys()].map(inches => {
                              return <option value={inches}>{inches}</option>;
                            })}
                          </select>
                        </div>
                        <div className="results-submit-buttons">
                          <button
                            onClick={() => {
                              this.filterRanges("Height", "Submit");
                            }}
                          >
                            Submit
                          </button>
                          <button
                            onClick={() =>
                              this.filterRanges("Height", "Remove")
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  }
                  let color = "whitesmoke";
                  if (this.state.selectedTraits.includes(trait)) {
                    color = "black";
                  }
                  return (
                    <div className="results-trait">
                      <button
                        style={{ background: color }}
                        className="results-trait-button"
                        name={trait}
                        onClick={this.filter.bind(this)}
                      ></button>{" "}
                      <h3>{trait}</h3>
                    </div>
                  );
                })}
              </div>
              <div className="results-selected-traits">
                {this.state.selectedTraits.map(trait => {
                  return <h3>{trait}</h3>;
                })}
              </div>
            </div>
          </div>
          <figure
            className="results-pieGraph"
            style={{
              background: `radial-gradient(
                circle closest-side,
                transparent 66%,
                white 0
              ),
              conic-gradient(
                #4e79a7 0,
                #4e79a7 ${this.state.accumulator[0]}%,
                #f28e2c 0,
                #f28e2c ${this.state.accumulator[1]}%,
                #e15759 0,
                #e15759 ${this.state.accumulator[2]}%,
                #76b7b2 0,
                #76b7b2 ${this.state.accumulator[3]}%,
                #59a14f 0,
                #59a14f ${this.state.accumulator[4]}%,
                #1b1b1b 0,
                #1b1b1b 0
            )`
            }}
          >
            <h2>{this.state.poll.question}</h2>
            <div hidden={this.state.NoResults} className="no-results-container">
              <h2 className="no-results">No Results</h2>
            </div>
            <div className="pie-bottom">
              <div className="profile-responses">
                <h3>{this.state.responses} results</h3>
              </div>
              <figcaption>
                {this.state.poll.options.map((option, i) => {
                  return (
                    <div>
                      {option} {this.state.percentages[i]}%
                      <span style={{ color: this.state.poll.colors[i] }} />
                      <br />
                    </div>
                  );
                })}
              </figcaption>
            </div>
          </figure>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Results;
