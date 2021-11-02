import React, {useEffect, useState} from "react";
import axios from "axios";
import './Teams.css'
import {useHistory} from "react-router-dom";
import defaultUrlIcon from  '../defaultUrlIcone.png'
import {debounceTime, distinctUntilChanged, pluck, Subject} from "rxjs";

function Teams(props){
    const initState = {
        teams:[],
        currentSlug: null,
        currentPage: 1,
        pageSize: 12,
        keyWord: ''
    }

    const [teamState, setTeamState] = useState(initState);

    const teamOptions = {
        method: 'GET',
        url: process.env.REACT_APP_TEAMS_API_URL,
        params: {
            token: process.env.REACT_APP_USER_TOKEN,
            'search[name]': teamState.keyWord,
            page: teamState.currentPage,
            per_page: teamState.pageSize
        },
        headers: {Accept: 'application/json'}
    };

    const setSlugs = (props) => {
        switch (props.gameSlug) {
            case 'league-of-legends':
                return 'lol';
            case 'cs-go':
                return 'csgo';
            case 'dota-2':
                return 'dota2';
            case 'cod-mw':
                return 'codmw';
            case 'r6-siege':
                return 'r6siege';
            default:
                return props.gameSlug;
        }
    }

    const gameTeamsOptions = (gameSlug) => {
        return {
            method: 'GET',
            url: process.env.REACT_APP_API_URL + gameSlug + '/teams?',
            params: {
                token: process.env.REACT_APP_USER_TOKEN,
                'search[name]': teamState.keyWord,
                page: teamState.currentPage,
                per_page: teamState.pageSize
            },
            headers: {Accept: 'application/json'}
        }
    }

    const getTeams = (options) => {
        axios.request(options)
            .then((response) => {
                console.log(teamState.currentSlug);
                setTeamState({ ...teamState, teams: response.data });
            }).catch((error) => {
            console.log(error);
        });
    }
    let chosenGame = localStorage.getItem('game');
    useEffect(()=>{
        if (chosenGame && chosenGame!=='DEFAULT'){
            getTeams(gameTeamsOptions(setSlugs(props)));
        }
        else getTeams(teamOptions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[teamState.currentPage, props.gameSlug, teamState.keyWord])

    function handlePage(pageNumber) {
        if (teamState.teams.length !== 0 ) {
            setTeamState(teamState => ({...teamState, currentPage: pageNumber}));
        }
    }

    function handlePageStatus(action) {
        switch (action){
            case 'next':
                setTeamState(teamState => ({...teamState, currentPage: teamState.currentPage+1}));
                break;
            case 'previous':
                setTeamState(teamState => ({...teamState, currentPage: teamState.currentPage-1}));
                break;
            default:
                console.log('done');
        }
    }

    let history = useHistory();
    function handleDetails(id) {
        history.push('/teams/'+id);
    }

    let searchTeamTerm$= new Subject();
    function handleSearch(event) {
        searchTeamTerm$.next(event);
    }
    searchTeamTerm$
        .pipe(
            pluck('target', 'value'),
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(
        (value) => {
            setTeamState({...teamState, keyWord: value})
        },
        (error => {
            console.log(error)})
    )

    return (
        <div className="Team">
            <div className="align-content-center">
                <div className={'d-flex justify-content-around'}>
                    <h1 className="text-capitalize text-capitalize text-xl-center text-black-50 mt-3 mb-3">
                        Teams
                    </h1>
                    <div className={'form-group mt-4 '}>
                        <input type="text" className={'form-control'} placeholder={'Recherche...'}
                               onChange={handleSearch}/>
                    </div>
                </div>
                <hr/>
                <br/>
                <div className="row">
                    {teamState.teams.map(team => {
                        return <div className="col-md-3" key={team.id}>
                                    <div  className="card mt-3">
                                        <div className="card-header">
                                            {team.name}
                                        </div>
                                        <div className="card-body">
                                            <img width={100} height={150} src={team.image_url || defaultUrlIcon} alt={team.acronym}/>
                                        </div>
                                        <div className="card-footer">
                                            <button className="btn btn-block btn-outline-info" onClick={() => handleDetails(team.id)}>
                                                Détails
                                            </button>
                                        </div>
                                    </div>
                                </div>
                    })}
                </div>
                <br/>
                <footer className="m-3">
                    <nav aria-label="..." className="d-flex justify-content-center">
                        <ul className="pagination">
                            <li className={teamState.currentPage===1 ? "page-item disabled" : "page-item"}>
                                <button className="page-link" tabIndex="-1" onClick={()=>handlePageStatus("previous")}>
                                    Previous
                                </button>
                            </li>
                            <li className="page-item active">
                                <button className="page-link" onClick={()=>handlePage(teamState.currentPage)}>
                                    {teamState.currentPage}</button>
                            </li>

                            <li className={teamState.teams.length<12 ? "page-item disabled hide" : "page-item"}>
                                <button className="page-link" onClick={()=>handlePage(teamState.currentPage+1)} >
                                    {teamState.currentPage+1}
                                </button>
                            </li>
                            <li className={teamState.teams.length<12 ? "page-item hide disabled" : "page-item"}>
                                <button className="page-link" onClick={()=>handlePage(teamState.currentPage+2)} >
                                    {teamState.currentPage+2}
                                </button>
                            </li>
                            <li className={teamState.teams.length<12 ? "page-item disabled" : "page-item"}>
                                <button className="page-link" tabIndex="+1" onClick={()=>handlePageStatus("next")}>
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </footer>
            </div>
        </div>
    )
}

export default Teams;
