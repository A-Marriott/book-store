import "./App.css";
import {Switch, Route} from "react-router-dom";
import Search from "./components/Search";
import Book from "./components/Book";
import Basket from "./components/Basket";

function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path="/" component={Search}/>
                <Route path="/book/:id" component={Book}/>
                <Route path="/basket" component={Basket}/>
            </Switch>
        </div>
    );
}

export default App;
