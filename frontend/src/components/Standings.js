import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    CircularProgress,
    Box,
    Typography,
    Tabs,
    Tab
} from '@mui/material';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

const Standings = () => {
    const [divisionStandingsData, setDivisionStandingsData] = useState(undefined);
    const [conferenceStandingsData, setConferenceStandingsData] = useState(undefined);
    const [leagueStandingsData, setLeagueStandingsData] = useState(undefined);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await axios.get('/league/standings/division');
                setDivisionStandingsData(data);
            } catch (e) {
                console.log(e);
            }

            try {
                const {data} = await axios.get('/league/standings/conference');
                setConferenceStandingsData(data);
            } catch (e) {
                console.log(e);
            }

            try {
                const {data} = await axios.get('/league/standings/league');
                setLeagueStandingsData(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        fetchData();
    }, [loading])

    if (loading) {
        return (<CircularProgress sx={{marginTop: '50%', color: '#FAF9F6'}}/>);
    } else {
        return (<div>
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
                <Tab sx={{color: '#FAF9F6'}} label="Division"/>
                <Tab sx={{color: '#FAF9F6'}} label="Conference"/>
                <Tab sx={{color: '#FAF9F6'}} label="League"/>
            </Tabs>
            <TabPanel value={value} index={0}>
                <Grid container justifyContent='center' spacing={0}>
                    {divisionStandingsData.map((division) => {
                        return (<Grid xs={12} sm={12} md={12} lg={6} item>
                            <Box
                                sx={{
                                    marginLeft: '15px', marginRight: '15px', borderRadius: '20px'
                                }}
                            >
                                <Box>
                                    <Typography sx={{fontSize: 14, margin: '5px'}}
                                                className="division-name">{division[0].division} Division</Typography>
                                </Box>
                                <TableContainer
                                    sx={{
                                        backgroundColor: '#FAF9F6', ['@media (max-width:780px)']: {
                                            width: '100%', borderRadius: '20px'
                                        }
                                    }}
                                    key={`${division[0].id}`}
                                >
                                    <Table
                                        aria-label="simple table"
                                    >
                                        <TableHead>
                                            <TableCell sx={{
                                                borderRadius: '20px',
                                                position: "sticky",
                                                left: 0,
                                                color: '#0C0C0C',
                                                background: '#FAF9F6'
                                            }} align='left'>Rank</TableCell>
                                            <TableCell sx={{
                                                position: "sticky", left: 63, color: '#0C0C0C', background: '#FAF9F6'
                                            }} align='left'>Team</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>GP</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>W</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>L</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>OT</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>PTS</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>P%</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>GF</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>GA</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>DIFF</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>STRK</TableCell>
                                        </TableHead>
                                        <TableBody>
                                            {division.map((team) => {
                                                return (<TableRow
                                                    key={team.name}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': {border: 0}
                                                    }}
                                                >
                                                    <TableCell sx={{
                                                        borderRadius: '20px',
                                                        position: "sticky",
                                                        left: 0,
                                                        color: '#0C0C0C',
                                                        background: '#FAF9F6'
                                                    }} component='th'
                                                               scope='row'>{team.divisionRank}</TableCell>
                                                    <TableCell sx={{
                                                        position: "sticky",
                                                        left: 63,
                                                        color: '#0C0C0C',
                                                        background: '#FAF9F6'
                                                    }} align='left'>
                                                        <Box
                                                            sx={{
                                                                display: 'flex', alignItems: 'center'
                                                            }}
                                                        >
                                                            {team.clinchIndicator && <p>{team.clinchIndicator}-</p>}
                                                            <Link to={`/teams/${team.id}`}>
                                                                <img
                                                                    width="25px"
                                                                    src={`${team.imageUrl}`}
                                                                    alt={`${team.name} logo`}
                                                                />
                                                            </Link>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.gamesPlayed}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.wins}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.losses}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.ot}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.points}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.pointsPercentage}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.goalsScored}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.goalsAgainst}</TableCell>
                                                    {team.goalDifferential > 0 && <TableCell sx={{color: '#0C0C0C'}}
                                                                                             align='left'>+{team.goalDifferential}</TableCell>}
                                                    {team.goalDifferential <= 0 && <TableCell sx={{color: '#0C0C0C'}}
                                                                                              align='left'>{team.goalDifferential}</TableCell>}
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.streak}</TableCell>
                                                </TableRow>);
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Grid>);
                    })}
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid container justifyContent='center' spacing={0}>
                    {conferenceStandingsData.map((conference) => {
                        return (<Grid xs={12} sm={12} md={12} lg={6} item>
                            <Box
                                sx={{
                                    marginLeft: '15px', marginRight: '15px', borderRadius: '20px'
                                }}
                            >
                                <Box>
                                    <Typography sx={{fontSize: 14, margin: '5px'}}
                                                className="division-name">{conference[0].conference} Conference</Typography>
                                </Box>
                                <TableContainer
                                    sx={{
                                        backgroundColor: '#FAF9F6', ['@media (max-width:780px)']: {
                                            width: '100%'
                                        }, borderRadius: '20px'
                                    }}
                                    key={`${conference[0].id}`}
                                >
                                    <Table
                                        aria-label="simple table"
                                    >
                                        <TableHead>
                                            <TableCell sx={{
                                                borderRadius: '20px',
                                                position: "sticky",
                                                left: 0,
                                                color: '#0C0C0C',
                                                background: '#FAF9F6'
                                            }} align='left'>Rank</TableCell>
                                            <TableCell sx={{
                                                position: "sticky", left: 63, color: '#0C0C0C', background: '#FAF9F6'
                                            }} align='left'>Team</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>GP</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>W</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>L</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>OT</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>PTS</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>P%</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>GF</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>GA</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>DIFF</TableCell>
                                            <TableCell sx={{color: '#0C0C0C'}} align='left'>STRK</TableCell>
                                        </TableHead>
                                        <TableBody>
                                            {conference.map((team) => {
                                                return (<TableRow
                                                    key={team.name}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': {border: 0}
                                                    }}
                                                >
                                                    <TableCell sx={{
                                                        borderRadius: '20px',
                                                        position: "sticky",
                                                        left: 0,
                                                        color: '#0C0C0C',
                                                        background: '#FAF9F6'
                                                    }} component='th'
                                                               scope='row'>{team.conferenceRank}</TableCell>
                                                    <TableCell sx={{
                                                        position: "sticky",
                                                        left: 63,
                                                        color: '#0C0C0C',
                                                        background: '#FAF9F6'
                                                    }} align='left'>
                                                        <Box
                                                            sx={{
                                                                display: 'flex', alignItems: 'center'
                                                            }}
                                                        >
                                                            {team.clinchIndicator && <p>{team.clinchIndicator}-</p>}
                                                            <Link to={`/teams/${team.id}`}>
                                                                <img
                                                                    width="25px"
                                                                    src={`${team.imageUrl}`}
                                                                    alt={`${team.name} logo`}
                                                                />
                                                            </Link>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.gamesPlayed}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.wins}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.losses}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.ot}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.points}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.pointsPercentage}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.goalsScored}</TableCell>
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.goalsAgainst}</TableCell>
                                                    {team.goalDifferential > 0 && <TableCell sx={{color: '#0C0C0C'}}
                                                                                             align='left'>+{team.goalDifferential}</TableCell>}
                                                    {team.goalDifferential <= 0 && <TableCell sx={{color: '#0C0C0C'}}
                                                                                              align='left'>{team.goalDifferential}</TableCell>}
                                                    <TableCell sx={{color: '#0C0C0C'}}
                                                               align='left'>{team.streak}</TableCell>
                                                </TableRow>);
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Grid>);
                    })}
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Box
                    sx={{
                        marginLeft: '15px', marginRight: '15px', borderRadius: '20px'
                    }}
                >
                    <Box>
                        <Typography sx={{fontSize: 14, margin: '5px'}} className="division-name">National Hockey
                            League</Typography>
                    </Box>
                    <TableContainer
                        sx={{
                            backgroundColor: '#FAF9F6', ['@media (max-width:780px)']: {
                                width: '100%'
                            }, borderRadius: '20px'
                        }}
                        key={`${leagueStandingsData[0].id}`}
                    >
                        <Table
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableCell sx={{
                                    borderRadius: '20px',
                                    position: "sticky",
                                    left: 0,
                                    color: '#0C0C0C',
                                    background: '#FAF9F6'
                                }} align='left'>Rank</TableCell>
                                <TableCell
                                    sx={{position: "sticky", left: 63, color: '#0C0C0C', background: '#FAF9F6'}}
                                    align='left'>Team</TableCell>
                                <TableCell sx={{color: '#0C0C0C'}} align='left'>GP</TableCell>
                                <TableCell sx={{color: '#0C0C0C'}} align='left'>W</TableCell>
                                <TableCell sx={{color: '#0C0C0C'}} align='left'>L</TableCell>
                                <TableCell sx={{color: '#0C0C0C'}} align='left'>OT</TableCell>
                                <TableCell sx={{color: '#0C0C0C'}} align='left'>PTS</TableCell>
                                <TableCell sx={{color: '#0C0C0C'}} align='left'>P%</TableCell>
                                <TableCell sx={{color: '#0C0C0C'}} align='left'>GF</TableCell>
                                <TableCell sx={{color: '#0C0C0C'}} align='left'>GA</TableCell>
                                <TableCell sx={{color: '#0C0C0C'}} align='left'>DIFF</TableCell>
                                <TableCell sx={{color: '#0C0C0C'}} align='left'>STRK</TableCell>
                            </TableHead>
                            <TableBody>
                                {leagueStandingsData.map((team) => {
                                    return (<TableRow
                                        key={team.name}
                                        sx={{
                                            '&:last-child td, &:last-child th': {border: 0}
                                        }}
                                    >
                                        <TableCell sx={{
                                            borderRadius: '20px',
                                            position: "sticky",
                                            left: 0,
                                            color: '#0C0C0C',
                                            background: '#FAF9F6'
                                        }} component='th' scope='row'>{team.leagueRank}</TableCell>
                                        <TableCell sx={{
                                            position: "sticky", left: 63, color: '#0C0C0C', background: '#FAF9F6'
                                        }} align='left'>
                                            <Box
                                                sx={{
                                                    display: 'flex', alignItems: 'center'
                                                }}
                                            >
                                                {team.clinchIndicator && <p>{team.clinchIndicator}-</p>}
                                                <Link to={`/teams/${team.id}`}>
                                                    <img
                                                        width="25px"
                                                        src={`${team.imageUrl}`}
                                                        alt={`${team.name} logo`}
                                                    />
                                                </Link>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{color: '#0C0C0C'}}
                                                   align='left'>{team.gamesPlayed}</TableCell>
                                        <TableCell sx={{color: '#0C0C0C'}} align='left'>{team.wins}</TableCell>
                                        <TableCell sx={{color: '#0C0C0C'}}
                                                   align='left'>{team.losses}</TableCell>
                                        <TableCell sx={{color: '#0C0C0C'}} align='left'>{team.ot}</TableCell>
                                        <TableCell sx={{color: '#0C0C0C'}}
                                                   align='left'>{team.points}</TableCell>
                                        <TableCell sx={{color: '#0C0C0C'}}
                                                   align='left'>{team.pointsPercentage}</TableCell>
                                        <TableCell sx={{color: '#0C0C0C'}}
                                                   align='left'>{team.goalsScored}</TableCell>
                                        <TableCell sx={{color: '#0C0C0C'}}
                                                   align='left'>{team.goalsAgainst}</TableCell>
                                        {team.goalDifferential > 0 && <TableCell sx={{color: '#0C0C0C'}}
                                                                                 align='left'>+{team.goalDifferential}</TableCell>}
                                        {team.goalDifferential <= 0 && <TableCell sx={{color: '#0C0C0C'}}
                                                                                  align='left'>{team.goalDifferential}</TableCell>}
                                        <TableCell sx={{color: '#0C0C0C'}}
                                                   align='left'>{team.streak}</TableCell>
                                    </TableRow>);
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </TabPanel>
        </div>);
    }
};

export default Standings;