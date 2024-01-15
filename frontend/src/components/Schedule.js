import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams, useLocation} from 'react-router-dom';
import {
    Card,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    CircularProgress,
    Divider,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    Button,
    Box,
    Tab,
    Tabs
} from '@mui/material';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    buildCurrentDateString, getTomorrow
} from '../helpers';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Schedule = () => {
    const [scheduleData, setScheduleData] = useState(undefined);
    const [gameData, setGameData] = useState([]);
    const [goalData, setGoalData] = useState([]);
    const [topData, setTopData] = useState([]);
    const [topGoalieData, setTopGoalieData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(undefined);
    const [predictionsData, setPredictionsData] = useState(undefined);
    const {date} = useParams();
    const location = useLocation();
    const MakePredictionSwal = withReactContent(Swal);

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

    const [value, setValue] = useState(`${new Date().getFullYear()}-${('0' + (new Date().getMonth() + 1)).slice(-2)}-${('0' + (new Date().getDate())).slice(-2)}`);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let currentDate = "2023-10-10";
    let season = [];
    while (currentDate !== "2024-04-18") {
        season.push({
            value: currentDate, str: buildCurrentDateString(currentDate)
        });
        currentDate = getTomorrow(currentDate);
    }

    useEffect(() => {
        setLoading(true);

        async function fetchData() {
            try {
                let {data} = await axios.get('/user/profile');
                if (!data.error) {
                    setProfileData(data);
                    let predictions = [];
                    data.user.predictions.forEach((prediction) => {
                        predictions.push(parseInt(prediction.gameId));
                    });
                    setPredictionsData(predictions);
                }

                ({data} = await axios.get(`/league/schedule/${value}`));
                setScheduleData(data);

                let gameIds = [];
                data.forEach((game) => {
                    gameIds.push(game.id);
                    return game;
                });

                let games = [];
                for (let i = 0; i < gameIds.length; i++) {
                    try {
                        const {data} = await axios.get(`/game/linescore/${gameIds[i]}`);
                        games.push(data);
                    } catch (e) {
                        console.log(e);
                    }
                }
                setGameData(games);

                let goals = [];
                for (let i = 0; i < gameIds.length; i++) {
                    try {
                        const {data} = await axios.get(`/game/${gameIds[i]}`);
                        console.log(data);
                        goals.push(data.goals);
                    } catch (e) {
                        console.log(e);
                    }
                }
                setGoalData(goals);

                ({data} = await axios.get(`/league/topscorers/${value}`));
                setTopData(data);

                ({data} = await axios.get(`/league/topgoalies/${value}`));
                setTopGoalieData(data);

                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        if (value) {
            fetchData();
        }
    }, [value]);

    const addPreviousPageToLS = (e) => {
        localStorage.setItem('schedulePrev', `${location.pathname}|${buildCurrentDateString(value)}`);
    };

    const handleMakePredictions = (gameId, away, home, homeTriCode, awayTriCode, homeImage, awayImage) => {
        MakePredictionSwal.fire({
            text: `How many goals will the ${away} score?`,
            confirmButtonColor: '#0C0C0C',
            input: 'text',
            inputPlaceholder: '# of goals',
            confirmButtonText: 'Next'
        }).then((result) => {
            if (result.isConfirmed) {
                MakePredictionSwal.fire({
                    text: `How many goals will the ${home} score?`,
                    confirmButtonColor: '#0C0C0C',
                    input: 'text',
                    inputPlaceholder: '# of goals',
                    confirmButtonText: 'Submit'
                }).then(async (result2) => {
                    if (result2.isConfirmed) {
                        MakePredictionSwal.fire({
                            text: `Submitting Prediction...`, didOpen: () => {
                                MakePredictionSwal.showLoading()
                            }, allowOutsideClick: false
                        });

                        await axios.post(`/user/predict/${gameId}`, {
                            awayName: away,
                            homeName: home,
                            homeTriCode: homeTriCode,
                            awayTriCode: awayTriCode,
                            homeImage: homeImage,
                            awayImage: awayImage,
                            awayScore: result.value,
                            homeScore: result2.value,
                            gameDate: buildCurrentDateString(value)
                        });

                        await MakePredictionSwal.fire({
                            text: 'Prediction Submitted!', icon: 'success', confirmButtonColor: '#0C0C0C'
                        });

                        window.location.reload();
                    }
                });
            }
        });
    };

    const buildGame = (game, linescore, goals, endStatus) => {
        return (
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={`${game.teams.away.teamId}${game.teams.home.teamId}`}>
                <Card
                    sx={{
                        background: '#FAF9F6',
                        minHeight: '200px',
                        borderRadius: '20px',
                        marginLeft: '15px',
                        marginRight: '15px'
                    }}
                >
                    <Link onClick={addPreviousPageToLS()} className="game-link" to={`/game/${value}/${game.id}`}>
                        {(game.status === 'Scheduled' || game.status === 'Pre-Game') && <h3>{game.startTime}</h3>}
                        {game.status !== 'Pre-Game' && game.status !== 'In Progress' && game.status !== 'Scheduled' && game.status !== 'In Progress - Critical' &&
                            <h3>{game.status}{endStatus}</h3>}
                        {(game.status === 'In Progress' || game.status === 'In Progress - Critical') && linescore.currentPeriod &&
                            <h3>{linescore.currentPeriod} - {linescore.currentPeriodTimeRemaining}</h3>}
                        <div className="game-div">
                            <div>
                                <img
                                    width="35px"
                                    src={`${game.teams.away.imageUrl}`}
                                    alt={`${game.teams.away.name}`}
                                />
                                {game.status !== 'In Progress' && game.status !== 'Final' && game.status !== 'In Progress - Critical' &&
                                    <h3>{game.teams.away.record}</h3>}
                                {game.status === 'Final' && game.teams.away.score < game.teams.home.score && <div>
                                    <h3>{game.teams.away.score}</h3>
                                    <h5>Shots: {linescore.away.shots}</h5>
                                </div>}
                                {game.status === 'Final' && game.teams.away.score > game.teams.home.score && <div>
                                    <h3 className="game-winner">{game.teams.away.score}</h3>
                                    <h5 className="game-winner">Shots: {linescore.away.shots}</h5>
                                </div>}
                                {game.status === 'Final' && game.teams.away.score === game.teams.home.score && <div>
                                    <h3>{game.teams.away.score}</h3>
                                    <h5>Shots: {linescore.away.shots}</h5>
                                </div>}
                                {(game.status === 'In Progress' || game.status === 'In Progress - Critical') && <div>
                                    <h3>{game.teams.away.score}</h3>
                                    <h5>Shots: {linescore.away.shots}</h5>
                                </div>}
                            </div>
                            <div>
                                <h3 className="at-symbol">@</h3>
                            </div>
                            <div>
                                <img
                                    width="35px"
                                    src={`${game.teams.home.imageUrl}`}
                                    alt={`${game.teams.home.name}`}
                                />
                                {game.status !== 'In Progress' && game.status !== 'Final' && game.status !== 'In Progress - Critical' &&
                                    <h3>{game.teams.home.record}</h3>}
                                {game.status === 'Final' && game.teams.home.score < game.teams.away.score && <div>
                                    <h3>{game.teams.home.score}</h3>
                                    <h5>Shots: {linescore.home.shots}</h5>
                                </div>}
                                {game.status === 'Final' && game.teams.home.score > game.teams.away.score && <div>
                                    <h3 className="game-winner">{game.teams.home.score}</h3>
                                    <h5 className="game-winner">Shots: {linescore.home.shots}</h5>
                                </div>}
                                {game.status === 'Final' && game.teams.home.score === game.teams.away.score && <div>
                                    <h3>{game.teams.home.score}</h3>
                                    <h5>Shots: {linescore.home.shots}</h5>
                                </div>}
                                {(game.status === 'In Progress' || game.status === 'In Progress - Critical') && <div>
                                    <h3>{game.teams.home.score}</h3>
                                    <h5>Shots: {linescore.home.shots}</h5>
                                </div>}
                            </div>
                        </div>
                    </Link>
                    {predictionsData && !predictionsData.includes(game.id) && profileData && game.status !== 'In Progress' && game.status !== 'Final' && game.status !== 'In Progress - Critical' &&
                        <Button
                            sx={{
                                backgroundColor: '#0C0C0C', color: '#FAF9F6', borderRadius: '50px', fontSize: 12
                            }}
                            onClick={() => handleMakePredictions(game.id, game.teams.away.name, game.teams.home.name, game.teams.home.triCode, game.teams.away.triCode, game.teams.home.imageUrl, game.teams.away.imageUrl)}
                        >
                            Predict Score
                        </Button>}
                    {predictionsData && predictionsData.includes(game.id) && <div>
                        <Typography sx={{fontSize: 14}}>
                            Your prediction:
                        </Typography>
                        {profileData.user.predictions.find(element => parseInt(element.gameId) === game.id).awayScore > profileData.user.predictions.find(element => parseInt(element.gameId) === game.id).homeScore &&
                            <Typography sx={{fontSize: 12}}>
                                {game.teams.away.triCode} {profileData.user.predictions.find(element => parseInt(element.gameId) === game.id).awayScore} - {game.teams.home.triCode} {profileData.user.predictions.find(element => parseInt(element.gameId) === game.id).homeScore}
                            </Typography>}
                        {profileData.user.predictions.find(element => parseInt(element.gameId) === game.id).awayScore < profileData.user.predictions.find(element => parseInt(element.gameId) === game.id).homeScore &&
                            <Typography sx={{fontSize: 12}}>
                                {game.teams.home.triCode} {profileData.user.predictions.find(element => parseInt(element.gameId) === game.id).homeScore} - {game.teams.away.triCode} {profileData.user.predictions.find(element => parseInt(element.gameId) === game.id).awayScore}
                            </Typography>}
                    </div>}
                    {/* <h3>Location: {game.venue}</h3>
                    {game.status !== 'Final' &&
                        <div>
                            <h3>Watch on: {game.broadcasts}</h3>
                        </div>
                    } */}
                    {game.seriesStatus && <div>
                        <h3>{game.seriesStatus}</h3>
                    </div>}
                    {game.roundGameStatus && <div>
                        <h3>({game.roundGameStatus})</h3>
                    </div>}
                </Card>
                <Divider/>
            </Grid>);
    };

    return (<div>
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
                        color: "#FAF9F6"
                    }
                }}
                TabIndicatorProps={{
                    style: {
                        backgroundColor: '#FAF9F6'
                    }
                }}
            >
                {season.map((date) => {
                    return <Tab sx={{color: '#FAF9F6'}} value={date.value} label={date.str.split(',')[0]}></Tab>
                })}
            </Tabs>
        </Box>
        {!loading && <div>
            {topData.length > 0 && <div>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{color: '#FAF9F6'}}/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{
                            backgroundColor: '#0C0C0C'
                        }}
                    >
                        <Typography sx={{color: '#FAF9F6'}}>Today's Top Skaters</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List dense>
                            {topData.map((player) => {
                                return (<ListItem key={Math.random()}
                                                  secondaryAction={<img width="35px" alt={` logo`}
                                                                        src={`${player[7]}`}/>}>
                                    <ListItemAvatar>
                                        <img
                                            style={{borderRadius: '25px'}}
                                            width="50px"
                                            src={`https://assets.nhle.com/mugs/nhl/20232024/${player[6]}/${player[5]}.png`}
                                            alt={` logo`}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={player[0]}
                                                  secondary={`${player[1]} points (${player[3]} G, ${player[4]} A)`}/>
                                </ListItem>);
                            })}
                        </List>
                    </AccordionDetails>
                </Accordion>
            </div>}
            <Divider/>
            {topGoalieData.length > 0 && <div>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{color: '#FAF9F6'}}/>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{
                            backgroundColor: '#0C0C0C'
                        }}
                    >
                        <Typography sx={{color: '#FAF9F6'}}>Today's Top Goalies (at least 30 mins.
                            TOI)</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List dense>
                            {topGoalieData.map((player) => {
                                return (<ListItem key={Math.random()}
                                                  secondaryAction={<img width="35px" alt={` logo`}
                                                                        src={player.imageUrl}/>}>
                                    <ListItemAvatar>
                                        <img
                                            style={{borderRadius: '25px'}}
                                            width="50px"
                                            src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${player.id}.jpg`}
                                            alt={` logo`}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={player.name}
                                                  secondary={`${player.goalsAgainstAverage} GAA, ${player.savePercentage} SV%`}/>
                                </ListItem>);
                            })}
                        </List>
                    </AccordionDetails>
                </Accordion>
            </div>}
            <br/>
            {scheduleData.length > 0 && <Grid container justifyContent='center' spacing={3}>
                {scheduleData && scheduleData.map((game, index) => {
                    let endStatus = '';
                    if (game.status === 'Final') {
                        if (goalData[index][goalData[index].length - 1].period === 'OT') {
                            endStatus = '/OT';
                        }
                        if (goalData[index][goalData[index].length - 1].period === 'SO') {
                            endStatus = '/SO';
                        }
                    }
                    return buildGame(game, gameData[index], goalData[index], endStatus);
                })}
            </Grid>}
            {scheduleData.length === 0 &&
                <Typography sx={{color: '#FAF9F6'}}>There are no games scheduled on this date!</Typography>}
        </div>}
        {loading && <CircularProgress sx={{marginTop: '15%', color: '#FAF9F6'}}/>}
    </div>);
};

export default Schedule;