import {useEffect, useState} from "react";
import {useLocation, useHistory} from "react-router-dom";
import axios from "axios";
import moment from 'moment';
import defaultUrlIcon from "../defaultUrlIcone.png";

function Games(){

    const initState = {
        league : {
            id: null,
            image_url: "",
            modified_at: "",
            name: "",
            series: [],
            slug: "",
            url: "",
            videogame: {
                current_version: null,
                id: null,
                name: "",
                slug: ""
            }
        },
        team : {
            acronym: null,
            current_videogame: {
                id: null,
                name: "",
                slug: "",
            },
            id: null,
            image_url: "",
            location: "",
            modified_at: "",
            name: "",
            players: [],
            slug: ""
        }
    }

    const [gameState, setGameState] = useState(initState)

    const gameOptions = {
        method: 'GET',
        url: process.env.REACT_APP_API_URL+useLocation().pathname+"?",
        params : {
            token : process.env.REACT_APP_USER_TOKEN
        },
        headers: {Accept: 'application/json'}
    };

    let isLeaguePath = useLocation().pathname.includes('league')
    const getGameDetails = () => {
        axios.request(gameOptions)
            .then((response) => {
                if (isLeaguePath){
                    setGameState({...gameState, league: response.data, team: initState.team});
                }
                else setGameState({...gameState, league: initState.league, team: response.data});
            }).catch((error) => {
            console.log(error);
        });
    }

    let history = useHistory();
    let localPath = useLocation().pathname

    useEffect(() => {
        getGameDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[localPath])


    return <div className="Game mt-3">
        <div className="col-md-5 ml-auto mr-auto">
            <div className="card md-3 mt-3 mb-3">
                <div className="card-header">
                    <img height={500} width={400} className="card-img-top" alt={'...'}
                         src={gameState.league.image_url || gameState.team.image_url || defaultUrlIcon}/>
                </div>
                <div className="card-body">
                    <h1 className="card-title">{gameState.league.name || gameState.team.name}</h1>
                    <a className={gameState.league.id ? 'btn' : 'hide'} href={gameState.league.url}>
                        <strong>Site de la league</strong>
                    </a>
                    <h4 className={'card-text text-lg'}>
                        Game : {gameState.league.videogame.name || gameState.team.current_videogame.name}
                    </h4>
                    <p className="card-text">
                        <small className="text-muted">
                            Last updated at {moment(gameState.league.modified_at || gameState.team.modified_at).format("DD/MM/yyyy hh:mm")}
                        </small>
                    </p>
                </div>
                <div className={'card-footer'}>
                    <div className={gameState.league.series.length>0 ? '' : 'hide'}>
                        {gameState.league.series.map( (serie) => {
                            return <div className={'card-text'} key={serie.id}>
                                <h4>{serie.full_name}</h4>
                                <h5>From : {moment(serie.begin_at).format("DD/MM/yyyy hh:mm") } -
                                    To : {moment(serie.end_at).format("DD/MM/yyyy hh:mm") || moment(serie.modified_at)
                                        .format("DD/MM/yyyy hh:mm")}
                                </h5>
                                <div className={serie.winner_id ? 'form-group md-auto' : 'hide'}>
                                        <button className={'btn btn-link'}
                                        onClick={()=>{history.push('/teams/'+serie.winner_id)}}>
                                            ! VAINQUEUR !
                                            </button>
                                </div>
                                <hr/>
                            </div>
                        })}
                    </div>
                    <div className={gameState.team.players.length>0 ? '':'hide'}>
                        <div className="row">
                            {gameState.team.players.map( (player) => {
                                return <div className={'col-md-4 mr-auto ml-auto'} key={player.id}>
                                    <h4>
                                        <span className={'badge badge-info'}>{player.name}</span>
                                    </h4>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

}

export default Games;
