import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Box,
    Typography,
    Tabs,
    Tab,
    ListItem,
    List,
    ListItemAvatar,
    ListItemText,
    FormControl,
    Select,
    MenuItem,
    Stack,
    Divider
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {buildCurrentDateString, getAvailableYears, getTeamPrimaryColor} from '../helpers';

const Team = () => {
    const {id} = useParams();
    const [teamData, setTeamData] = useState(undefined);
    const [players, setPlayers] = useState([]);
    const [goalies, setGoalies] = useState([]);
    const [playerStats] = useState([]);
    const [goalieStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scheduleData, setScheduleData] = useState(undefined);
    const [regularScheduleData, setRegularScheduleData] = useState(undefined);
    const [preScheduleData, setPreScheduleData] = useState(undefined);
    const [postScheduleData, setPostScheduleData] = useState(undefined);
    const [teamStats, setTeamStats] = useState(undefined);
    const [scheduleYear, setScheduleYear] = useState("20232024");
    const [availableYears, setAvailableYears] = useState([]);
    const [loadingSchedule, setLoadingSchedule] = useState(false);

    function TabPanel(props) {
        const {children, value, index, ...other} = props;

        return (<div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (<Box>
                <Typography>{children}</Typography>
            </Box>)}
        </div>);
    }

    TabPanel.propTypes = {
        children: PropTypes.node, index: PropTypes.number.isRequired, value: PropTypes.number.isRequired,
    };

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleScheduleYearChange = async (event) => {
        setScheduleYear(event.target.value);
        setRegularScheduleData([]);
        setPreScheduleData([]);
        setPostScheduleData([]);
        setLoadingSchedule(true);
        try {
            const {data} = await axios.get(`/team/${id}/schedule/${event.target.value}`);
            setRegularScheduleData(data.regular);
            setPreScheduleData(data.pre);
            setPostScheduleData(data.post);
            setLoadingSchedule(false);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            setAvailableYears(getAvailableYears());

            try {
                const {data} = await axios.get(`/team/${id}`);
                setTeamData(data);
                setPlayers(data.players);
                setGoalies(data.goalies);

                let playerIds = [];
                data.players.forEach((player) => {
                    playerIds.push(player.playerId);
                    return player;
                });

                for (let i = 0; i < playerIds.length; i++) {
                    try {
                        const {data} = await axios.get(`/player/${playerIds[i]}/skater`);
                        playerStats.push(data);
                    } catch (e) {
                        console.log(e);
                    }
                }

                playerStats.sort((a, b) => b.points - a.points);

                let sortedPlayers = [];
                for (let i = 0; i < playerStats.length; i++) {
                    sortedPlayers.push(data.players[data.players.findIndex(x => x.playerId == playerStats[i].playerId)]);
                }
                setPlayers(sortedPlayers);

                let goalieIds = [];
                data.goalies.forEach((goalie) => {
                    goalieIds.push(goalie.playerId);
                    return goalie;
                });

                for (let i = 0; i < goalieIds.length; i++) {
                    try {
                        const {data} = await axios.get(`/player/${goalieIds[i]}/goalie`);
                        goalieStats.push(data);
                    } catch (e) {
                        console.log(e);
                    }
                }

                goalieStats.sort((a, b) => b.games - a.games);

                let sortedGoalies = [];
                for (let i = 0; i < goalieStats.length; i++) {
                    sortedGoalies.push(data.goalies[data.goalies.findIndex(x => x.playerId == goalieStats[i].playerId)]);
                }
                setGoalies(sortedGoalies);
            } catch (e) {
                console.log(e);
            }

            try {
                const {data} = await axios.get(`/team/${id}/schedule/${scheduleYear}`);
                setRegularScheduleData(data.regular);
                setPreScheduleData(data.pre);
                setPostScheduleData(data.post);
            } catch (e) {
                console.log(e);
            }

            try {
                const {data} = await axios.get(`/team/${id}/stats`);
                setTeamStats(data);

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
            <div className="team-header">
                <div>
                    <div style={{border: `solid 3px ${getTeamPrimaryColor(teamData.name)}`}}
                         className="team-hero-container">
                        <img style={{width: '100%'}} src={teamData.heroImage}/>
                        <h5 className="team-hero-child-left">Est. {teamData.firstYearOfPlay}</h5>
                        <h5 className="team-hero-child-right">{teamData.record}</h5>
                        <h5 className="team-hero-child-middle">{teamData.divisionRanking} | {teamData.conferenceRanking} | {teamData.leagueRanking}</h5>
                    </div>
                </div>
            </div>
            <Box
                sx={{
                    marginTop: '10px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    marginBottom: '10px'
                }}
            >
                <h1 className="team-page-name">{teamData.name}</h1>
            </Box>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="scrollable auto tabs example"
                sx={{
                    "& button.Mui-selected": {
                        color: "#FAF9F6"
                    }
                }}
                TabIndicatorProps={{
                    style: {
                        backgroundColor: '#FAF9F6'
                    }
                }}
                centered
            >
                <Tab sx={{color: '#FAF9F6'}} label="Team Stats"/>
                <Tab sx={{color: '#FAF9F6'}} label="Player Stats"/>
                <Tab sx={{color: '#FAF9F6'}} label="Schedule"/>
            </Tabs>
            <TabPanel value={value} index={0}>
                <List
                    dense
                    sx={{
                        marginTop: '10px', backgroundColor: '#FAF9F6'
                    }}
                >
                    <ListItem sx={{mb: 1}} key={Math.random()} secondaryAction={<h5>League Rank</h5>}>
                        <ListItemText primary="Stat"/>
                    </ListItem>
                    <Divider/>
                    {Object.keys(teamStats).map((key) => {
                        return (<ListItem key={Math.random()} secondaryAction={<h5>{teamStats[key].rank}</h5>}>
                            <ListItemText primary={key} secondary={teamStats[key].stat}/>
                        </ListItem>);
                    })}
                </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <h2 className="player-stats">Skater Stats</h2>
                <TableContainer
                    sx={{
                        ['@media (min-width:780px)']: {
                            margin: '10px', width: '50%', marginLeft: '25%'
                        }, background: '#FAF9F6', ['@media (max-width:780px)']: {
                            width: '100%'
                        }
                    }}
                >
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableCell sx={{position: "sticky", left: 0, color: '#0C0C0C', background: '#FAF9F6'}}
                                       align='left'>Name</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>Number</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>Position</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>GP</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>G</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>A</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>PTS</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>+/-</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>S</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>S%</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>PIM</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>TOI/G</TableCell>
                        </TableHead>
                        <TableBody>
                            {players.map((player, index) => {
                                return (<TableRow
                                    key={player.name}
                                    sx={{
                                        '&:last-child td, &:last-child th': {border: 0}
                                    }}
                                >
                                    <TableCell sx={{
                                        position: "sticky", left: 0, color: '#0C0C0C', background: '#FAF9F6'
                                    }} component='th' scope='row'>
                                        <Link className="player-link" to={`/player/${player.playerId}`}>
                                            {player.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{player.jerseyNumber}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{player.position}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{playerStats[index].games}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{playerStats[index].goals}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{playerStats[index].assists}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{playerStats[index].points}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{playerStats[index].plusMinus}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{playerStats[index].shots}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{playerStats[index].shotPercentage}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{playerStats[index].pim}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{playerStats[index].timeOnIcePerGame}</TableCell>
                                </TableRow>);
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider/>
                <h2 className="player-stats">Goalie Stats</h2>
                <TableContainer
                    sx={{
                        ['@media (min-width:780px)']: {
                            margin: '10px', width: '50%', marginLeft: '25%'
                        }, background: '#FAF9F6', ['@media (max-width:780px)']: {
                            width: '100%'
                        }
                    }}
                >
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableCell
                                sx={{
                                    position: "sticky", left: 0, color: '#0C0C0C', background: '#FAF9F6'
                                }}
                                align='left'
                            >
                                Name
                            </TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>Number</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>Position</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>GP</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>GS</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>GA</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>SV</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>W</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>L</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>OTL</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>SO</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>GAA</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>SV%</TableCell>
                            <TableCell sx={{color: '#0C0C0C'}} align='left'>TOI/G</TableCell>
                        </TableHead>
                        <TableBody>
                            {goalies.map((player, index) => {
                                return (<TableRow
                                    key={player.name}
                                    sx={{
                                        '&:last-child td, &:last-child th': {border: 0}
                                    }}
                                >
                                    <TableCell sx={{
                                        position: "sticky", left: 0, color: '#0C0C0C', background: '#FAF9F6'
                                    }} component='th' scope='row'>
                                        <Link className="player-link" to={`/player/${player.playerId}`}>
                                            {player.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{player.jerseyNumber}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{player.position}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{goalieStats[index].games}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{goalieStats[index].gamesStarted}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{goalieStats[index].goalsAgainst}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{goalieStats[index].saves}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{goalieStats[index].wins}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{goalieStats[index].losses}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{goalieStats[index].ot}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{goalieStats[index].shutouts}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{goalieStats[index].goalsAgainstAverage}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{goalieStats[index].savePercentage}</TableCell>
                                    <TableCell sx={{color: '#0C0C0C'}}
                                               align='left'>{goalieStats[index].timeOnIcePerGame}</TableCell>
                                </TableRow>);
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Stack>
                    <FormControl sx={{m: 1, minWidth: 120}} size="small">
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={scheduleYear}
                            onChange={handleScheduleYearChange}
                            sx={{
                                borderRadius: '50px', backgroundColor: '#FAF9F6'
                            }}
                        >
                            {availableYears.map((year) => {
                                return <MenuItem
                                    value={`${year.split("-")[0]}${year.split("-")[1]}`}>{year}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    {loadingSchedule &&
                        <CircularProgress sx={{marginTop: '20px', marginLeft: '42.5%', color: '#FAF9F6'}}/>}
                </Stack>
                {scheduleYear !== "20042005" && !loadingSchedule && <Box>
                    <Typography
                        sx={{textAlign: 'left', margin: '10px', color: '#FAF9F6'}}>Preseason</Typography>
                    <List
                        dense
                        sx={{
                            marginTop: '10px', backgroundColor: '#FAF9F6', ['@media (max-width:780px)']: {
                                width: '100%'
                            }
                        }}
                    >
                        {preScheduleData.map((game) => {
                            return (<Link className="team-schedule-link" to={`/game/${game.gameLink}`}>
                                <ListItem key={Math.random()} secondaryAction={<h5>{game.gameStatus}</h5>}>
                                    <ListItemAvatar>
                                        <img
                                            className="goal-img"
                                            width="25px"
                                            src={game.opponentImageUrl}
                                            alt={` logo`}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={`${game.homeOrAway} ${game.opponentName}`}
                                                  secondary={buildCurrentDateString(game.date)}/>
                                </ListItem>
                            </Link>);
                        })}
                    </List>
                    <Typography sx={{textAlign: 'left', margin: '10px', color: '#FAF9F6'}}>Regular
                        Season</Typography>
                    <List
                        dense
                        sx={{
                            marginTop: '10px', backgroundColor: '#FAF9F6', ['@media (max-width:780px)']: {
                                width: '100%'
                            }
                        }}
                    >
                        {regularScheduleData.map((game) => {
                            return (<Link className="team-schedule-link" to={`/game/${game.gameLink}`}>
                                <ListItem key={Math.random()} secondaryAction={<h5>{game.gameStatus}</h5>}>
                                    <ListItemAvatar>
                                        <img
                                            className="goal-img"
                                            width="25px"
                                            src={game.opponentImageUrl}
                                            alt={` logo`}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={`${game.homeOrAway} ${game.opponentName}`}
                                                  secondary={buildCurrentDateString(game.date)}/>
                                </ListItem>
                            </Link>);
                        })}
                    </List>
                    <Typography
                        sx={{textAlign: 'left', margin: '10px', color: '#FAF9F6'}}>Postseason</Typography>
                    <List
                        dense
                        sx={{
                            marginTop: '10px', backgroundColor: '#FAF9F6', ['@media (max-width:780px)']: {
                                width: '100%'
                            }
                        }}
                    >
                        {postScheduleData.map((game) => {
                            return (<Link className="team-schedule-link" to={`/game/${game.gameLink}`}>
                                <ListItem key={Math.random()} secondaryAction={<h5>{game.gameStatus}</h5>}>
                                    <ListItemAvatar>
                                        <img
                                            className="goal-img"
                                            width="25px"
                                            src={game.opponentImageUrl}
                                            alt={` logo`}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={`${game.homeOrAway} ${game.opponentName}`}
                                                  secondary={buildCurrentDateString(game.date)}/>
                                </ListItem>
                            </Link>);
                        })}
                    </List>
                </Box>}
                {scheduleYear === "20042005" && !loadingSchedule && <h3 style={{color: '#FAF9F6'}}>Lockout :(</h3>}
            </TabPanel>
        </div>);
    }
};

export default Team;