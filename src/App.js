import "./App.css";
import Search from "./components/Search";
import { Switch, Route, Redirect } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Search} />
      </Switch>
    </div>
  );
}

export default App;
