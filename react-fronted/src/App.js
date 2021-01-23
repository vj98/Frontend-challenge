import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Checkout from "./components/Checkout";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route exact path="/checkout">
            <Checkout />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
