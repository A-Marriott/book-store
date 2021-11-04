import "./App.css";
import Search from "./components/Search";
import Book from "./components/Book";
import {Switch, Route, Redirect} from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path="/" component={Search}/>
                <Route path="/basket/:id" component={Book}/>
            </Switch>
        </div>
    );
}

export default App;
