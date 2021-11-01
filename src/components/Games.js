import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";
import moment from 'moment';

function Games(){

    const initState = {
        league : {
            id: null,
            image_url: "",
            modified_at: "",
            name: "",
            series: [
                {
                    begin_at: "",
                    description: null,
                    end_at: "",
                    full_name: "",
                    id: null,
                    league_id: null,
                    modified_at: "",
                    name: "",
                    season: "",
                    slug: "",
                    tier: "",
                    winner_id: null,
                    winner_type: null,
                    year: 2021
                }
            ],
            slug: "",
            url: "",
            videogame: {
                current_version: null,
                id: null,
                name: "",
                slug: ""
            }
        },
        team : {}
    }

    const [gameState, setGameState] = useState(initState)

    let user_token="IwMa-JpTE1gsbo_2rN4vYHJxxWl--XWGfXZijGWRsmK6LvreaMA";

    const gameOptions = {
        method: 'GET',
        url: process.env.REACT_APP_API_URL+useLocation().pathname+"?token="+user_token,
        headers: {Accept: 'application/json'}
    };

    let isLeaguePath = useLocation().pathname.includes('league')
    const getGameDetails = () => {
        axios.request(gameOptions)
            .then((response) => {
                if (isLeaguePath){
                    setGameState({...gameState, league: response.data});    }
                else setGameState({...gameState, team: response.data});
                console.log(response.data)
            }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        console.log(gameState);
        getGameDetails();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    return <div className="Game mt-3">
        <div className="col-md-5 ml-auto mr-auto">
            <div className="card md-3 mt-3 mb-3">
                <div className="card-header">
                    <img height={500} width={400} src={gameState.league.image_url} className="card-img-top"  alt={'...'}/>
                </div>
                <div className="card-body">
                    <h1 className="card-title">{gameState.league.name}</h1>
                        <a className={'btn'} href={gameState.league.url}>
                            <strong>Site de la league</strong>
                        </a>

                    <h4 className={'card-text text-lg'}>Game : {gameState.league.videogame.name}</h4>
                    <p className="card-text"><small className="text-muted">Last updated at {moment(gameState.league.modified_at).format("DD/MM/yyyy hh:mm")}</small></p>
                </div>
                <div className={'card-footer'}>
                    {gameState.league.series.map( (serie) => {
                        return <div className={'card-text'} key={serie.id}>
                            <h4>{serie.full_name}</h4>
                            <h5>From : {moment(serie.begin_at).format("DD/MM/yyyy hh:mm") } -
                                To : {moment(serie.end_at).format("DD/MM/yyyy hh:mm") || moment(serie.modified_at).format("DD/MM/yyyy hh:mm")}
                            </h5>
                            <hr/>
                        </div>
                    })}
                </div>
            </div>
        </div>
    </div>

}

export default Games;
