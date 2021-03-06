import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

function Navbar(props) {

    const initState = {
        games:[{
            id: null,
            name: '',
            slug: ''
        }
        ],
        game_slug: null
    }
    const [gamesState, setGamesState] = useState(initState);

    const gamesOptions = {
        method: 'GET',
        url: process.env.REACT_APP_GAMES_API_URL,
        params: {
            token: process.env.REACT_APP_USER_TOKEN
        },
        headers: {Accept: 'application/json'}
    };

    const getGames = () => {
        axios.request(gamesOptions)
            .then((response) => {
                setGamesState({ ...gamesState, games: response.data.map( game => {
                    return {id: game.id, name : game.name, slug: game.slug}
                    })
                });
            }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(()=>{
        getGames();
        props.choosedGame(gamesState.game_slug);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[gamesState.game_slug]);

    function handleGameOption(event) {
        setGamesState({...gamesState, game_slug: event.target.value});
        localStorage.setItem('game',event.target.value);
    }

    let history = useHistory();
    function handleNavLink(link){
        if (link === 'teams'){
            history.push('/teams');
        }else if (link === 'leagues'){
            history.push('/leagues')
        }
    }

    return(
        <div className="Navbar">
            <nav className="navbar navbar-dark bg-info">
                <a href={"/"} className="navbar-brand" > <h2>E-sport</h2></a>
                <div className="d-flex ml-auto">
                    <select className="custom-select mr-2" onChange={handleGameOption} defaultValue={'DEFAULT'}>
                        <option key={1} value={'DEFAULT'}> Choose a game... </option>
                        { gamesState.games.map(game => {
                            return <option key={game.id} value={game.slug}>
                                {game.name}</option>
                        })}
                    </select>
                    <button type="button" className="btn btn-light mr-2"  onClick={() => handleNavLink('teams')}>
                        TEAMS
                    </button>
                    <button type="button" className="btn btn-light mr-2" onClick={() => handleNavLink('leagues')}>
                        LEAGUES
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;
