import {useEffect, useState} from "react";
import axios from "axios";
import './css/style.css'

export function Leagues(props){

    let initState = {
        leagues: [{
            id: null,
            image_url: '',
            name: ''
        }],
        currentPage: 1,
        pageSize: 9
    };
    const [leagueState, setLeagueState] = useState(initState);

    let user_token="IwMa-JpTE1gsbo_2rN4vYHJxxWl--XWGfXZijGWRsmK6LvreaMA";
    const allLeaguesOptions = {
        method: 'GET',
        url: process.env.REACT_APP_LEAGUE_API_URL+
            "&page="+leagueState.currentPage+"&per_page="+leagueState.pageSize,
        headers: {Accept: 'application/json'}
    };

    const gameLeaguesOption = {
        method: 'GET',
        url: process.env.REACT_APP_GAME_API_URL+"/"+props.gameId+"/leagues?token="+user_token+
            "&page="+leagueState.currentPage+"&per_page="+leagueState.pageSize,
        headers: {Accept: 'application/json'}
    };

    const getLeagues = (options)=> {
        axios.request(options)
            .then((response) => {
                setLeagueState({...leagueState, leagues: response.data});
                // console.log(response.data)
            }).catch((error) => {
            console.log(error);
        });
    }

    function handlePage(pageNumber) {
        if (leagueState.leagues.length !== 0){
            setLeagueState(leagueState => ({...leagueState, currentPage: pageNumber}));
        }
    }

    function handlePageStatus(action) {
        switch (action){
            case 'next':
                setLeagueState(leagueState => ({...leagueState, currentPage: leagueState.currentPage+1}));
                break;
            case 'previous':
                setLeagueState(leagueState => ({...leagueState, currentPage: leagueState.currentPage-1}));
                break;
            default:
                setLeagueState(leagueState => ({...leagueState}));
        }
    }

    useEffect(()=>{
        if (props.gameId && props.gameId!=='DEFAULT') {
            getLeagues(gameLeaguesOption)
        }
        else getLeagues(allLeaguesOptions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[leagueState.currentPage, props.gameId])

    return (    <div className="container">
        <div className="align-content-center">
                <h2>Leagues : </h2>
                <br/>
                <div className="row">
                    {leagueState.leagues?.map((league) => {
                        return <div className="col-md-4" key={league.id} >
                            <div className="card mt-2">
                                <div className="card-header">{league.name}</div>
                                <div className="card-body">
                                    <img width={200} height={150} src={league.image_url} alt={league.name}/>
                                </div>
                                <div className="card-footer">
                                    <a href={'/'}> DETAILS </a>
                                </div>
                            </div>
                        </div>
                    })}
                </div>

            <footer className="m-3">
                <nav aria-label="..." className="d-flex justify-content-center">
                    <ul className="pagination">
                        <li className={leagueState.currentPage===1 ? "page-item disabled" : "page-item"}>
                            <button className="page-link" tabIndex="-1" onClick={()=>handlePageStatus("previous")}>
                                Previous
                            </button>
                        </li>
                        <li className="page-item active">
                            <button className="page-link" onClick={()=>handlePage(leagueState.currentPage)}>
                                {leagueState.currentPage}</button>
                        </li>

                        <li className={leagueState.leagues.length<9 ? "page-item disabled hide" : "page-item"}>
                            <button className="page-link" onClick={()=>handlePage(leagueState.currentPage+1)} >
                                {leagueState.currentPage+1}
                            </button>
                        </li>
                        <li className={leagueState.leagues.length<9 ? "page-item hide disabled" : "page-item"}>
                            <button className="page-link" onClick={()=>handlePage(leagueState.currentPage+2)} >
                                {leagueState.currentPage+2}
                            </button>
                        </li>
                        <li className={leagueState.leagues.length<9 ? "page-item disabled" : "page-item"}>
                            <button className="page-link" tabIndex="+1" onClick={()=>handlePageStatus("next")}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </footer>
        </div>
        </div>
    );
}

