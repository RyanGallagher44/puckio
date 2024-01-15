import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import {
    List, ListItem, ListItemIcon, ListItemText, CircularProgress, Box, Grid, Typography
} from '@mui/material';
import NumbersIcon from '@mui/icons-material/Numbers';
import CakeIcon from '@mui/icons-material/Cake';
import HomeIcon from '@mui/icons-material/Home';
import HeightIcon from '@mui/icons-material/Height';
import ScaleIcon from '@mui/icons-material/Scale';
import PanToolIcon from '@mui/icons-material/PanTool';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {buildCurrentDateString, getTeamPrimaryColor} from '../helpers';

const Player = () => {
    const {id} = useParams();
    const [playerData, setPlayerData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await axios.get(`/player/${id}/details`);
                setPlayerData(data);

                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        if (id) {
            fetchData();
        }
    }, [id])

    if (loading) {
        return (<CircularProgress sx={{marginTop: '50%', color: '#FAF9F6'}}/>);
    } else {
        return (<div>
            <Box
                sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px'
                }}
            >
                <Link to={`/teams/${playerData.currentTeamId}`}>
                    <ArrowBackIcon sx={{color: '#FAF9F6', marginTop: '5px', marginRight: '5px'}}/>
                </Link>
                <h1 className="team-page-name">{playerData.fullName}</h1>
            </Box>
            <br/>
            <img
                className="player-page-image"
                width="350px"
                src={`${playerData.imageUrl}`}
                alt={`${playerData.name}`}
            />
            {(playerData.alternateCaptain || playerData.captain) && <div className="player-page-team-div">
                <h2 className="player-page-position">
                    {playerData.position}
                </h2>
                <h2 className="player-page-position">&nbsp;|&nbsp;</h2>
                {playerData.alternateCaptain && <h2 className="player-page-position">
                    Alternate Captain
                </h2>}
                {playerData.captain && <h2 className="player-page-position">
                    Captain
                </h2>}
            </div>}
            {!(playerData.alternateCaptain || playerData.captain) && <div className="player-page-team-div">
                <h2 className="player-page-position">
                    {playerData.position}
                </h2>
            </div>}
            <div className="player-page-team-div">
                <img
                    className="player-page-logo"
                    width="350px"
                    src={`${playerData.teamImageUrl}`}
                    alt={`${playerData.currentTeam}`}
                />
                <h2 className="player-page-team">{playerData.currentTeam}</h2>
            </div>
            <Box
                sx={{
                    display: 'flex', justifyContent: 'space-evenly'
                }}
            >
                <Box sx={{marginLeft: '20px', marginTop: '25px', borderRight: 'solid #FAF9F6'}}>
                    <Typography sx={{textAlign: 'left', color: '#FAF9F6'}}>Player Details</Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon sx={{color: '#e1e1e1'}}>
                                <NumbersIcon sx={{fontSize: 16}}/>
                            </ListItemIcon>
                            <ListItemText sx={{color: '#e1e1e1'}} primary={playerData.number}
                                          primaryTypographyProps={{fontSize: 12}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={{color: '#e1e1e1'}}>
                                <HeightIcon sx={{fontSize: 16}}/>
                            </ListItemIcon>
                            <ListItemText sx={{color: '#e1e1e1'}} primary={playerData.height}
                                          primaryTypographyProps={{fontSize: 12}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={{color: '#e1e1e1'}}>
                                <ScaleIcon sx={{fontSize: 16}}/>
                            </ListItemIcon>
                            <ListItemText sx={{color: '#e1e1e1'}} primary={`${playerData.weight} lbs.`}
                                          primaryTypographyProps={{fontSize: 12}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={{color: '#e1e1e1'}}>
                                <CakeIcon sx={{fontSize: 16}}/>
                            </ListItemIcon>
                            <ListItemText sx={{color: '#e1e1e1'}}
                                          primary={`${buildCurrentDateString(playerData.birthDate)}`}
                                          primaryTypographyProps={{fontSize: 12}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={{color: '#e1e1e1'}}>
                                <HomeIcon sx={{fontSize: 16}}/>
                            </ListItemIcon>
                            {playerData.birthStateProvince && <ListItemText sx={{color: '#e1e1e1'}}
                                                                            primary={`${playerData.birthCity}, ${playerData.birthStateProvince}, ${playerData.birthCountry}`}
                                                                            primaryTypographyProps={{fontSize: 12}}/>}
                            {!playerData.birthStateProvince && <ListItemText sx={{color: '#e1e1e1'}}
                                                                             primary={`${playerData.birthCity}, ${playerData.birthCountry}`}
                                                                             primaryTypographyProps={{fontSize: 12}}/>}
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={{color: '#e1e1e1'}}>
                                <PanToolIcon sx={{fontSize: 16}}/>
                            </ListItemIcon>
                            {playerData.handedness === 'L' && <ListItemText sx={{color: '#e1e1e1'}} primary="Left"
                                                                            primaryTypographyProps={{fontSize: 12}}/>}
                            {playerData.handedness === 'R' && <ListItemText sx={{color: '#e1e1e1'}} primary="Right"
                                                                            primaryTypographyProps={{fontSize: 12}}/>}
                        </ListItem>
                    </List>
                </Box>

                <Box sx={{marginTop: '25px', marginLeft: '20px'}}>
                    <Typography sx={{textAlign: 'left', color: '#FAF9F6'}}>2023-2024 Stats</Typography>
                    <Grid sx={{marginTop: '0px', textAlign: 'left'}} spacing={2} container>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>GP</Typography>
                            <Typography sx={{
                                fontSize: 12, color: '#FAF9F6'
                            }}>{playerData.playerStats.gamesPlayed}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>G</Typography>
                            <Typography
                                sx={{fontSize: 12, color: '#FAF9F6'}}>{playerData.playerStats.goals}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>A</Typography>
                            <Typography
                                sx={{fontSize: 12, color: '#FAF9F6'}}>{playerData.playerStats.assists}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>P</Typography>
                            <Typography
                                sx={{fontSize: 12, color: '#FAF9F6'}}>{playerData.playerStats.points}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>PPG</Typography>
                            <Typography sx={{
                                fontSize: 12, color: '#FAF9F6'
                            }}>{playerData.playerStats.powerPlayGoals}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>PPP</Typography>
                            <Typography sx={{
                                fontSize: 12, color: '#FAF9F6'
                            }}>{playerData.playerStats.powerPlayPoints}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>SHG</Typography>
                            <Typography sx={{
                                fontSize: 12, color: '#FAF9F6'
                            }}>{playerData.playerStats.shortHandedGoals}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>SHP</Typography>
                            <Typography sx={{
                                fontSize: 12, color: '#FAF9F6'
                            }}>{playerData.playerStats.shortHandedPoints}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>GWG</Typography>
                            <Typography sx={{
                                fontSize: 12, color: '#FAF9F6'
                            }}>{playerData.playerStats.gameWinningGoals}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>OTG</Typography>
                            <Typography sx={{
                                fontSize: 12, color: '#FAF9F6'
                            }}>{playerData.playerStats.overTimeGoals}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>SH</Typography>
                            <Typography
                                sx={{fontSize: 12, color: '#FAF9F6'}}>{playerData.playerStats.shots}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>SH%</Typography>
                            <Typography sx={{
                                fontSize: 12, color: '#FAF9F6'
                            }}>{playerData.playerStats.shotPercentage}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>HIT</Typography>
                            <Typography
                                sx={{fontSize: 12, color: '#FAF9F6'}}>{playerData.playerStats.hits}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>BLK</Typography>
                            <Typography
                                sx={{fontSize: 12, color: '#FAF9F6'}}>{playerData.playerStats.blocks}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>PIM</Typography>
                            <Typography sx={{
                                fontSize: 12, color: '#FAF9F6'
                            }}>{playerData.playerStats.penaltyMinutes}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>TOI</Typography>
                            <Typography sx={{
                                fontSize: 12, color: '#FAF9F6'
                            }}>{playerData.playerStats.timeOnIcePerGame}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>PP TOI</Typography>
                            <Typography sx={{
                                fontSize: 12, color: '#FAF9F6'
                            }}>{playerData.playerStats.powerPlayTimeOnIcePerGame}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>+/-</Typography>
                            <Typography sx={{
                                fontSize: 12, color: '#FAF9F6'
                            }}>{playerData.playerStats.plusMinus}</Typography>
                        </Grid>
                        <Grid xs={4} sm={3} item>
                            <Typography sx={{fontSize: 12, color: '#FAF9F6'}}>FO%</Typography>
                            <Typography sx={{
                                fontSize: 12, color: '#FAF9F6'
                            }}>{playerData.playerStats.faceoffPercentage}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </div>);
    }
};

export default Player;