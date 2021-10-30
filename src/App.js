import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from "./components/layout/Navbar";
import {Leagues} from "./components/Leagues";
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import Teams from "./components/Teams";
import React, {useState} from "react";

function App() {

    const [state, setState] = useState('');

    const handleGame = (value)=>{
        setState(value);
    }

  return (
      <div className="App">
            <Router>
                    <Navbar choosedGame={handleGame} />
                <div className="container-fluid">
                    <Route path={'/leagues'} >
                        <Leagues gameId={state}/>
                    </Route>
                    <Route path={'/teams'} >
                        <Teams gameSlug={state}/>
                    </Route>
                </div>
                <Route path="/">
                    <Redirect to="/leagues" />
                </Route>
            </Router>
      </div>
  );
}

export default App;
