import React, {useState, useEffect} from 'react';
import {useParams, Link, useLocation} from 'react-router-dom';
import axios from 'axios';
import {styled} from '@mui/material/styles';
import {
    CircularProgress,
    Paper,
    List,
    ListSubheader,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Tabs,
    Tab,
    Typography,
    Box,
    Select,
    MenuItem,
    FormControl,
    Stack,
    Badge,
    Avatar,
    Breadcrumbs
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import {checkGoalsInPeriod, getOrdinalNum, getTeamPrimaryColor} from '../helpers';
import logo from '../img/logo.png';
import {ShotMap} from './ShotMap';
import {
    handleAwayEventChangeHelper,
    handleAwayPlayerChangeHelper,
    handleHomeEventChangeHelper,
    handleHomePlayerChangeHelper,
    handleShotMapPeriodChangeHelper
} from '../shotMapFilters'

const Game = () => {
    const {date, id} = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [gameData, setGameData] = useState(undefined);
    const [linescoreData, setLinescoreData] = useState(undefined);
    const [goalData, setGoalData] = useState(undefined);
    const [playData, setPlayData] = useState(undefined);
    const [endStatus, setEndStatus] = useState("");
    const [officialData, setOfficialData] = useState(undefined);
    const [penaltyData, setPenaltyData] = useState(undefined);
    const [starData, setStarData] = useState(undefined);
    const [shootoutData, setShootoutData] = useState(undefined);
    const [recapData, setRecapData] = useState(undefined);
    const [coordinatesData, setCoordinatesData] = useState([]);
    const [homeLogo, setHomeLogo] = useState("");
    const [awayLogo, setAwayLogo] = useState("");
    const [homeName, setHomeName] = useState("");
    const [awayName, setAwayName] = useState("");
    const [homePlayers, setHomePlayers] = useState([]);
    const [awayPlayers, setAwayPlayers] = useState([])

    /* Shot Map Filters */
    const [shotMapPeriod, setShotMapPeriod] = useState("All Periods");
    const [awayPlayer, setAwayPlayer] = useState("All Players");
    const [homePlayer, setHomePlayer] = useState("All Players");
    const [awayEvent, setAwayEvent] = useState("All Events");
    const [homeEvent, setHomeEvent] = useState("All Events");

    const [periodsPlayed, setPeriodsPlayed] = useState([]);

    const events = ["All Shots", "Goals", "Shots", "Hits", "Penalties", "Blocks", "Clear All Events"];

    const breadcrumbs = [<Link className="dark-breadcrumb-link" color="inherit" key="1"
                               to={localStorage.getItem('schedulePrev').split("|")[0]}>
        {localStorage.getItem('schedulePrev').split("|")[1]}
    </Link>];

    /* Tab Panel */
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

    const SmallAvatar = styled(Avatar)(({theme}) => ({
        width: 22, height: 22, padding: 3, transform: 'translate(5px, -5px)'
    }));

    const SmallAvatarRight = styled(Avatar)(({theme}) => ({
        width: 22, height: 22, padding: 3, transform: 'translate(-5px, -5px)'
    }));

    /* Handling Shot Map Filters */
    const handleShotMapPeriodChange = (event) => {
        setShotMapPeriod(event.target.value);
        setCoordinatesData(handleShotMapPeriodChangeHelper(playData, event.target.value, awayEvent, homeEvent, awayPlayer, homePlayer, awayName, homeName));
    }

    const handleAwayPlayerChange = (event) => {
        setAwayPlayer(event.target.value);
        setCoordinatesData(handleAwayPlayerChangeHelper(playData, shotMapPeriod, awayEvent, homeEvent, event.target.value, homePlayer, awayName, homeName));
    }

    const handleHomePlayerChange = (event) => {
        setHomePlayer(event.target.value);
        setCoordinatesData(handleHomePlayerChangeHelper(playData, shotMapPeriod, awayEvent, homeEvent, awayPlayer, event.target.value, awayName, homeName));
    }

    const handleAwayEventChange = (event) => {
        setAwayEvent(event.target.value);
        setCoordinatesData(handleAwayEventChangeHelper(playData, shotMapPeriod, event.target.value, homeEvent, awayPlayer, homePlayer, awayName, homeName));
    }

    const handleHomeEventChange = (event) => {
        setHomeEvent(event.target.value);
        setCoordinatesData(handleHomeEventChangeHelper(playData, shotMapPeriod, awayEvent, event.target.value, awayPlayer, homePlayer, awayName, homeName));
    }

    const addPreviousPageToLS = (e) => {
        localStorage.setItem('gamePrev', `${location.pathname}|${homeName} vs ${awayName}`);
    };

    useEffect(() => {
        async function fetchData() {
            let {data} = await axios.get(`/league/schedule/${date}`);

            let gameObj = undefined;
            data.forEach((game) => {
                if (game.id == id) {
                    gameObj = game;
                }
                return game;
            });
            setGameData(gameObj);

            try {
                const {data} = await axios.get(`/game/linescore/${id}`);
                setLinescoreData(data);
            } catch (e) {
                console.log(e);
            }

            try {
                const {data} = await axios.get(`/game/${id}`);
                setGoalData(data.goals);
                setOfficialData(data.officials)
                setPlayData(data.plays);
                setPenaltyData(data.penalties);
                setStarData(data.stars);
                setHomeLogo(data.homeImageUrl);
                setAwayLogo(data.awayImageUrl);
                setHomeName(data.homeTeamName);
                setAwayName(data.awayTeamName);
                setHomePlayers(data.homePlayers);
                setAwayPlayers(data.awayPlayers);
                setShootoutData(data.shootout);
                setRecapData(data.recap);

                if (data.plays.length > 0) {
                    setPeriodsPlayed(['1st', '2nd', '3rd', 'OT', 'SO'].splice(0, ['1st', '2nd', '3rd', 'OT', 'SO'].indexOf(data.plays[data.plays.length - 1].period) + 1));
                }

                let coordinates = [];
                data.plays.forEach((play) => {
                    if (play.coordinates !== "N/A" && ['Shot', 'Goal', 'Hit', 'Penalty', 'Blocked Shot'].includes(play.event)) {
                        coordinates.push({
                            x: play.coordinates.x,
                            y: play.coordinates.y,
                            color: getTeamPrimaryColor(play.fullTeam),
                            description: play.description
                        })
                    }
                });
                setCoordinatesData(coordinates);

                if (gameObj.status === 'Final') {
                    if (data.goals[data.goals.length - 1].period === 'OT') {
                        setEndStatus('/OT');
                    }
                    if (data.goals[data.goals.length - 1].period === 'SO') {
                        setEndStatus('/SO');
                    }
                }

                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        fetchData();
    }, [date, id]);

    if (loading) {
        return (<CircularProgress sx={{marginTop: '50%', color: '#FAF9F6'}}/>);
    } else {
        return (<div className="game-body">
            <Divider/>
            <Box
                sx={{
                    alignItems: 'center', justifyContent: 'center', display: 'flex'
                }}
            >
                <Breadcrumbs
                    separator={<NavigateNextIcon sx={{color: '#0C0C0C'}} fontSize="small"/>}
                    aria-label="breadcrumb"
                >
                    {breadcrumbs}
                </Breadcrumbs>
            </Box>
            <Box
                sx={{
                    display: 'flex', justifyContent: 'space-evenly'
                }}
            >
                <Box sx={{display: {xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'flex'}}}>
                    <img style={{borderRadius: '50px'}} height="200px" src={gameData.teams.away.heroImageUrl}/>
                </Box>
                <div>
                    {(gameData.status === 'Scheduled' || gameData.status === 'Pre-Game') &&
                        <h1>{gameData.startTime}</h1>}
                    {gameData.status !== 'Pre-Game' && gameData.status !== 'In Progress' && gameData.status !== 'Scheduled' && gameData.status !== 'In Progress - Critical' &&
                        <h1>{gameData.status}{endStatus}</h1>}
                    {(gameData.status === 'In Progress' || gameData.status === 'In Progress - Critical') && linescoreData.currentPeriod &&
                        <h1>{linescoreData.currentPeriod} - {linescoreData.currentPeriodTimeRemaining}</h1>}
                    <div className="game-div">
                        <div>
                            <Link onClick={addPreviousPageToLS()} className="team-link"
                                  to={`/teams/${gameData.teams.away.teamId}`}>
                                <img
                                    width="50px"
                                    src={`${gameData.teams.away.imageUrl}`}
                                    alt={`${gameData.teams.away.name}`}
                                />
                                {gameData.status !== 'In Progress' && gameData.status !== 'Final' && gameData.status !== 'In Progress - Critical' &&
                                    <h1>{gameData.teams.away.record}</h1>}
                                {gameData.status === 'Final' && gameData.teams.away.score < gameData.teams.home.score &&
                                    <div>
                                        <h1>{gameData.teams.away.score}</h1>
                                        <h5>Shots: {linescoreData.away.shots}</h5>
                                    </div>}
                                {gameData.status === 'Final' && gameData.teams.away.score > gameData.teams.home.score &&
                                    <div>
                                        <h1 className="game-winner">{gameData.teams.away.score}</h1>
                                        <h5 className="game-winner">Shots: {linescoreData.away.shots}</h5>
                                    </div>}
                                {gameData.status === 'Final' && gameData.teams.away.score === gameData.teams.home.score &&
                                    <div>
                                        <h1>{gameData.teams.away.score}</h1>
                                        <h5>Shots: {linescoreData.away.shots}</h5>
                                    </div>}
                                {(gameData.status === 'In Progress' || gameData.status === 'In Progress - Critical') &&
                                    <div>
                                        <h1>{gameData.teams.away.score}</h1>
                                        <h5>Shots: {linescoreData.away.shots}</h5>
                                    </div>}
                            </Link>
                        </div>
                        <div>
                            <h2 className="at-symbol">@</h2>
                        </div>
                        <div>
                            <Link onClick={addPreviousPageToLS()} className="team-link"
                                  to={`/teams/${gameData.teams.home.teamId}`}>
                                <img
                                    width="50px"
                                    src={`${gameData.teams.home.imageUrl}`}
                                    alt={`${gameData.teams.home.name}`}
                                />
                                {gameData.status !== 'In Progress' && gameData.status !== 'Final' && gameData.status !== 'In Progress - Critical' &&
                                    <h1>{gameData.teams.home.record}</h1>}
                                {gameData.status === 'Final' && gameData.teams.home.score < gameData.teams.away.score &&
                                    <div>
                                        <h1>{gameData.teams.home.score}</h1>
                                        <h5>Shots: {linescoreData.home.shots}</h5>
                                    </div>}
                                {gameData.status === 'Final' && gameData.teams.home.score > gameData.teams.away.score &&
                                    <div>
                                        <h1 className="game-winner">{gameData.teams.home.score}</h1>
                                        <h5 className="game-winner">Shots: {linescoreData.home.shots}</h5>
                                    </div>}
                                {gameData.status === 'Final' && gameData.teams.home.score === gameData.teams.away.score &&
                                    <div>
                                        <h1>{gameData.teams.home.score}</h1>
                                        <h5>Shots: {linescoreData.home.shots}</h5>
                                    </div>}
                                {(gameData.status === 'In Progress' || gameData.status === 'In Progress - Critical') &&
                                    <div>
                                        <h1>{gameData.teams.home.score}</h1>
                                        <h5>Shots: {linescoreData.home.shots}</h5>
                                    </div>}
                            </Link>
                        </div>
                    </div>
                </div>
                <Box
                    sx={{
                        display: {xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'flex'}
                    }}
                >
                    <img style={{borderRadius: '50px'}} height="200px" src={gameData.teams.home.heroImageUrl}/>
                </Box>
            </Box>
            <Typography sx={{fontSize: 24}}>{recapData.headline}</Typography>
            <video className="video-recap" controls>
                <source src={recapData.video} type="video/mp4"/>
            </video>
            <Box
                display="flex" justifyContent="center" width="100%"
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                    sx={{
                        "& button.Mui-selected": {
                            color: "#0C0C0C"
                        }
                    }}
                    TabIndicatorProps={{
                        style: {
                            backgroundColor: '#0C0C0C'
                        }
                    }}
                >
                    <Tab label="Goals"/>
                    <Tab label="Plays"/>
                    <Tab label="Penalties"/>
                    <Tab label="Three Stars"/>
                    <Tab label="Officials"/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                {goalData.length > 0 && <div>
                    <Paper style={{
                        maxHeight: '500px', overflow: 'auto', backgroundColor: '#FAF9F6', color: '#0C0C0C'
                    }}>
                        <List
                            dense
                            subheader={<li/>}
                        >
                            {[1, 2, 3, 4, 5].map((period) => {
                                return (<div>
                                    {checkGoalsInPeriod(goalData, period) && <ListSubheader
                                        sx={{
                                            background: '#0C0C0C', color: '#FAF9F6'
                                        }}
                                    >
                                        {getOrdinalNum(period)}
                                    </ListSubheader>}
                                    {getOrdinalNum(period) !== 'SO' && goalData.map((goal) => {
                                        return (<div>
                                            {getOrdinalNum(period) === goal.period && getOrdinalNum(period) !== 'SO' &&
                                                <ListItem key={Math.random()} style={{
                                                    display: 'flex', justifyContent: 'space-evenly'
                                                }} secondaryAction={goal.time}>
                                                    <Badge
                                                        sx={{
                                                            zIndex: 0
                                                        }}
                                                        overlap="circular"
                                                        anchorOrigin={{
                                                            vertical: 'bottom', horizontal: 'left'
                                                        }}
                                                        badgeContent={<SmallAvatar alt="Remy Sharp"
                                                                                   src={goal.imageUrl}/>}
                                                    >
                                                        <ListItemAvatar>
                                                            <img
                                                                style={{
                                                                    margin: '5px', borderRadius: '25px'
                                                                }}
                                                                width="50px"
                                                                src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${goal.playerId}.jpg`}
                                                                alt={`${goal.team} logo`}
                                                            />
                                                        </ListItemAvatar>
                                                    </Badge>
                                                    <ListItemText
                                                        primary={`${goal.scorerName} (${goal.scorerTotal})`}
                                                        secondary={<div>
                                                            {!goal.assistName1 && <div>Unassisted</div>}
                                                            {goal.assistName1 && !goal.assistName2 &&
                                                                <div>{goal.assistName1} ({goal.assistTotal1})</div>}
                                                            {goal.assistName1 && goal.assistName2 &&
                                                                <div>{goal.assistName1} ({goal.assistTotal1}), {goal.assistName2} ({goal.assistTotal2})</div>}
                                                        </div>}/>
                                                </ListItem>}
                                        </div>);
                                    })}
                                    {getOrdinalNum(period) === 'SO' && shootoutData.map((shootout) => {
                                        return (<ListItem key={Math.random()}
                                                          secondaryAction={shootout[1] &&
                                                              <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                                  <ListItemText
                                                                      primary={<Typography
                                                                          sx={{fontSize: '10px'}}>{shootout[1].player}</Typography>}
                                                                      secondary={<div
                                                                          style={{textAlign: 'right'}}>
                                                                          {shootout[1].result === 0 && <CancelIcon
                                                                              sx={{color: '#F82629'}}/>}
                                                                          {shootout[1].result === 1 && <CheckCircleIcon
                                                                              sx={{color: '#40C001'}}/>}
                                                                      </div>}
                                                                  />
                                                                  <Badge
                                                                      sx={{
                                                                          zIndex: 0
                                                                      }}
                                                                      overlap="circular"
                                                                      anchorOrigin={{
                                                                          vertical: 'bottom', horizontal: 'right'
                                                                      }}
                                                                      badgeContent={<SmallAvatarRight
                                                                          alt="Remy Sharp"
                                                                          src={shootout[1].imageUrl}/>}
                                                                  >
                                                                      <ListItemAvatar>
                                                                          <img style={{
                                                                              margin: '5px', borderRadius: '25px'
                                                                          }} width="50px" alt={` logo`}
                                                                               src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${shootout[1].playerId}.jpg`}/>
                                                                      </ListItemAvatar>
                                                                  </Badge>
                                                              </Box>}
                                        >
                                            <Badge
                                                sx={{
                                                    zIndex: 0
                                                }}
                                                overlap="circular"
                                                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                                                badgeContent={<SmallAvatar alt="Remy Sharp"
                                                                           src={shootout[0].imageUrl}/>}
                                            >
                                                <ListItemAvatar>
                                                    <img
                                                        style={{margin: '5px', borderRadius: '25px'}}
                                                        width="50px"
                                                        src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${shootout[0].playerId}.jpg`}
                                                        alt={` logo`}
                                                    />
                                                </ListItemAvatar>
                                            </Badge>
                                            <ListItemText
                                                primary={<Typography
                                                    sx={{fontSize: '10px'}}>{shootout[0].player}</Typography>}
                                                secondary={<div>
                                                    {shootout[0].result === 0 && <CancelIcon sx={{color: '#F82629'}}/>}
                                                    {shootout[0].result === 1 &&
                                                        <CheckCircleIcon sx={{color: '#40C001'}}/>}
                                                </div>}
                                            />
                                        </ListItem>);
                                    })}
                                </div>);
                            })}
                        </List>
                    </Paper>
                </div>}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {playData.length > 0 && <div>
                    <Stack>
                        <FormControl sx={{m: 1, minWidth: 120}} size="small">
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={shotMapPeriod}
                                onChange={handleShotMapPeriodChange}
                                sx={{
                                    borderRadius: '50px'
                                }}
                            >
                                <MenuItem value="All Periods">
                                    All Periods
                                </MenuItem>
                                {periodsPlayed.map((period) => {
                                    return <MenuItem value={period}>{period}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <Box
                            sx={{
                                display: 'flex', justifyContent: 'space-evenly'
                            }}
                        >
                            <Stack
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <Box sx={{height: '25px', display: 'flex', alignItems: 'center'}}>
                                    <img width="25px" height="25px" src={awayLogo} alt={`${awayName} logo`}/>
                                    <h6 style={{marginLeft: '5px'}}>{awayName}</h6>
                                </Box>
                                <FormControl sx={{mr: 1, minWidth: 120}} size="small">
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={awayPlayer}
                                        onChange={handleAwayPlayerChange}
                                        sx={{
                                            borderRadius: '50px'
                                        }}
                                    >
                                        <MenuItem value="All Players">
                                            All Players
                                        </MenuItem>
                                        {awayPlayers.map((player) => {
                                            return <MenuItem value={player}>{player}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{mr: 1, mt: 0.5, mb: 1, minWidth: 120}} size="small">
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={awayEvent}
                                        onChange={handleAwayEventChange}
                                        sx={{
                                            borderRadius: '50px'
                                        }}
                                    >
                                        <MenuItem value="All Events">
                                            All Events
                                        </MenuItem>
                                        {events.map((event) => {
                                            return <MenuItem value={event}>{event}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Stack>
                            <Stack
                                sx={{
                                    width: '100%'
                                }}
                            >
                                <Box sx={{
                                    marginLeft: '10px', height: '25px', display: 'flex', alignItems: 'center'
                                }}>
                                    <img width="25px" height="25px" src={homeLogo} alt={`${homeName} logo`}/>
                                    <h6 style={{marginLeft: '5px'}}>{homeName}</h6>
                                </Box>
                                <FormControl sx={{ml: 1, minWidth: 120}} size="small">
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={homePlayer}
                                        onChange={handleHomePlayerChange}
                                        sx={{
                                            borderRadius: '50px'
                                        }}
                                    >
                                        <MenuItem value="All Players">
                                            All Players
                                        </MenuItem>
                                        {homePlayers.map((player) => {
                                            return <MenuItem value={player}>{player}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ml: 1, mt: 0.5, mb: 1, minWidth: 120}} size="small">
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={homeEvent}
                                        onChange={handleHomeEventChange}
                                        sx={{
                                            borderRadius: '50px'
                                        }}
                                    >
                                        <MenuItem value="All Events">
                                            All Events
                                        </MenuItem>
                                        {events.map((event) => {
                                            return <MenuItem value={event}>{event}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Box>
                    </Stack>
                    <ShotMap data={coordinatesData} centerIceLogo={homeLogo} width={345} height={200}/>
                    <Paper style={{
                        maxHeight: '500px', overflow: 'auto', backgroundColor: '#FAF9F6', color: '#0C0C0C'
                    }}>
                        <List
                            dense
                            subheader={<li/>}
                        >
                            {[1, 2, 3, 4, 5].map((period) => {
                                return (<div>
                                    {checkGoalsInPeriod(playData, period) && <ListSubheader
                                        sx={{
                                            background: '#0C0C0C', color: '#FAF9F6'
                                        }}
                                    >
                                        {getOrdinalNum(period)}
                                    </ListSubheader>}
                                    {playData.map((play) => {
                                        return (<div>
                                            {getOrdinalNum(period) === play.period &&
                                                <ListItem key={Math.random()} style={{display: 'flex'}}>
                                                    <ListItemAvatar>
                                                        {play.imageUrl && <img
                                                            className="goal-img"
                                                            width="25px"
                                                            src={play.imageUrl}
                                                            alt={`${play.team} logo`}
                                                        />}
                                                    </ListItemAvatar>
                                                    <ListItemText primary={play.description}
                                                                  secondary={play.time}/>
                                                </ListItem>}
                                        </div>);
                                    })}
                                </div>);
                            })}
                        </List>
                    </Paper>
                </div>}
                {playData.length === 0 && <h3>This game has no plays or the game has not started yet!</h3>}
            </TabPanel>
            <TabPanel value={value} index={2}>
                {penaltyData.length > 0 && <Paper style={{
                    maxHeight: '500px', overflow: 'auto', backgroundColor: '#FAF9F6', color: '#0C0C0C'
                }}>
                    <List
                        dense
                        subheader={<li/>}
                    >
                        {[1, 2, 3, 4, 5].map((period) => {
                            return (<div>
                                {checkGoalsInPeriod(penaltyData, period) && <ListSubheader
                                    sx={{
                                        background: '#0C0C0C', color: '#FAF9F6'
                                    }}
                                >
                                    {getOrdinalNum(period)}
                                </ListSubheader>}
                                {penaltyData.map((penalty) => {
                                    return (<div>
                                        {getOrdinalNum(period) === penalty.period &&
                                            <ListItem key={Math.random()} style={{display: 'flex'}}>
                                                <Badge
                                                    sx={{
                                                        zIndex: 0
                                                    }}
                                                    overlap="circular"
                                                    anchorOrigin={{
                                                        vertical: 'bottom', horizontal: 'left'
                                                    }}
                                                    badgeContent={<SmallAvatar alt="Remy Sharp"
                                                                               src={penalty.imageUrl}/>}
                                                >
                                                    <ListItemAvatar>
                                                        {penalty.imageUrl && <img
                                                            style={{
                                                                margin: '5px', borderRadius: '25px'
                                                            }}
                                                            width="50px"
                                                            src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${penalty.playerId}.jpg`}
                                                            alt={`${penalty.team} logo`}
                                                        />}
                                                    </ListItemAvatar>
                                                </Badge>
                                                <ListItemText primary={penalty.player}
                                                              secondary={penalty.description}/>
                                            </ListItem>}
                                    </div>);
                                })}
                            </div>);
                        })}
                    </List>
                </Paper>}
                {penaltyData.length === 0 && <h3>This game has no penalties or the game has not started yet!</h3>}
            </TabPanel>
            <TabPanel value={value} index={3}>
                {starData && <List dense sx={{marginTop: '-20px'}}>
                    <ListItem key={Math.random()}>
                        <ListItemAvatar>
                            <img
                                className="star-img"
                                width="50px"
                                src={starData.firstStar.imageUrl}
                                alt={`${starData.firstStar.fullName}`}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={starData.firstStar.fullName}
                            secondary={<StarIcon/>}
                        />
                    </ListItem>
                    <ListItem key={Math.random()}>
                        <ListItemAvatar>
                            <img
                                className="star-img"
                                width="50px"
                                src={starData.secondStar.imageUrl}
                                alt={`${starData.secondStar.fullName}`}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={starData.secondStar.fullName}
                            secondary={<div>
                                <StarIcon/>
                                <StarIcon/>
                            </div>}
                        />
                    </ListItem>
                    <ListItem key={Math.random()}>
                        <ListItemAvatar>
                            <img
                                className="star-img"
                                width="50px"
                                src={starData.thirdStar.imageUrl}
                                alt={`${starData.thirdStar.fullName}`}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={starData.thirdStar.fullName}
                            secondary={<div>
                                <StarIcon/>
                                <StarIcon/>
                                <StarIcon/>
                            </div>}
                        />
                    </ListItem>
                </List>}
                {!starData && <h3>Check back after the game for the three stars!</h3>}
            </TabPanel>
            <TabPanel value={value} index={4}>
                <List dense sx={{marginTop: '-20px'}}>
                    {officialData.map((official) => {
                        return (<ListItem key={Math.random()}>
                            <ListItemAvatar>
                                <img
                                    className="goal-img"
                                    width="50px"
                                    src={logo}
                                    alt={` logo`}
                                />
                            </ListItemAvatar>
                            <ListItemText primary={official.fullName} secondary={official.type}/>
                        </ListItem>);
                    })}
                </List>
            </TabPanel>
        </div>);
    }
};

export default Game;