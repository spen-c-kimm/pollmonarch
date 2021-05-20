import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Welcome from "./Welcome/welcome";
import Home from "./Home/home";
import Login from "./Login/login";
import Signup from "./Signup/signup";
import Create from "./Create/create";
import Profile from "./Profile/profile";
import Results from "./Results/results";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Welcome} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/home" exact component={Home} />
          <Route path="/createPoll" exact component={Create} />
          <Route path="/profile" render={props => <Profile {...props} />} />
          <Route path="/results/:id" component={Results} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
