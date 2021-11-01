import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from "./components/layout/Navbar";
import {Leagues} from "./components/Leagues";
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import Teams from "./components/Teams";
import React, {useState} from "react";
import Games from "./components/Games";

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
                    <Route exact path={'/leagues'} >
                        <Leagues gameId={state}/>
                    </Route>
                    <Route exactx path={'/teams'} >
                        <Teams gameSlug={state}/>
                    </Route>
                    <Route path={['/leagues/:id','/teams/:id']} component={Games}/>
                    <Route path="/">
                        <Redirect to="/leagues" />
                    </Route>
                </div>
            </Router>
      </div>
  );
}

export default App;
