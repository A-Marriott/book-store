import "./App.css";
import Search from "./components/Search";
import Book from "./components/Book";
import {Switch, Route } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path="/" component={Search}/>
                <Route path="/book/:id" component={Book}/>
            </Switch>
        </div>
    );
}

export default App;
