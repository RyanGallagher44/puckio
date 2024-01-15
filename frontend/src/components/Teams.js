import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useLocation} from 'react-router-dom';
import {
    List, ListItem, ListItemText, Divider, ListItemAvatar, CircularProgress
} from '@mui/material';

const Teams = () => {
    const [teamData, setTeamData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await axios.get('/team');
                setTeamData(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        fetchData();
    }, [loading]);

    const addPreviousPageToLS = () => {
        localStorage.setItem('schedulePrev', `${location.pathname}|Teams`);
        localStorage.setItem('gamePrev', "");
    };

    if (loading) {
        return (<CircularProgress sx={{marginTop: '50%', color: '#FAF9F6'}}/>);
    } else {
        return (<div>
            <List sx={{width: '100%', bgcolor: '#FAF9F6'}}>
                {teamData && teamData.map((team) => {
                    return (<div>
                        <Divider variant="inset" component="li"/>
                        <Link onClick={addPreviousPageToLS} className="team-link"
                              to={`/teams/${team.teamId}`}>
                            <ListItem>
                                <ListItemAvatar sx={{margin: '10px'}}>
                                    <img
                                        width="50px"
                                        src={team.imageUrl}
                                        alt={`${team.name} logo`}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{
                                        marginLeft: '10%'
                                    }}
                                    primary={team.name}
                                />
                            </ListItem>
                        </Link>
                    </div>);
                })}
            </List>
        </div>);
    }
};

export default Teams;