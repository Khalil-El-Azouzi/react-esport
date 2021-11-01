import {useEffect, useState} from "react";
import axios from "axios";
import './Teams.css'
import {useHistory} from "react-router-dom";
import defaultUrlIcon from  '../defaultUrlIcone.png'

function Teams(props){
    const initState = {
        teams:[],
        currentPage: 1,
        pageSize: 12
    }

    const [teamState, setTeamState] = useState(initState);

    let user_token="IwMa-JpTE1gsbo_2rN4vYHJxxWl--XWGfXZijGWRsmK6LvreaMA";

    const teamOptions = {
        method: 'GET',
        url: process.env.REACT_APP_TEAMS_API_URL+"&page="+teamState.currentPage+"&per_page="+teamState.pageSize,
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
                url: 'https://api.pandascore.co/' + gameSlug + '/teams?token=' + user_token +
                    "&page=" + teamState.currentPage + "&per_page=" + teamState.pageSize,
                headers: {Accept: 'application/json'}
            }
    }

    const getTeams = (options) => {
        axios.request(options)
            .then((response) => {
                setTeamState({ ...teamState, teams: response.data });
            }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(()=>{
        if (props.gameSlug && props.gameSlug!=='DEFAULT') getTeams(gameTeamsOptions(setSlugs(props)));
        else getTeams(teamOptions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[teamState.currentPage, props.gameSlug])

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

    return (
        <div className="Team">
            <div className="align-content-center">
                <h1 className="text-capitalize text-capitalize text-black-50 mt-3 mb-3"> Teams  </h1>
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
