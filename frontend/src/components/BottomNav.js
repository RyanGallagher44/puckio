import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {useNavigate} from 'react-router-dom';
import SportsHockeyIcon from '@mui/icons-material/SportsHockey';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import InfoIcon from '@mui/icons-material/Info';

const BottomNav = () => {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    const handleScoresClick = () => {
        navigate(`/schedule`);
    };

    const handleStandingsClick = () => {
        navigate('/standings');
    };

    const handleTeamsClick = () => {
        navigate('/teams');
    };

    const handleSearchClick = () => {
        navigate('/search')
    };

    return (<Box sx={{zIndex: 1000, width: '100%', position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
        <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            sx={{
                backgroundColor: '#0C0C0C', paddingBottom: '50px'
            }}
        >
            <BottomNavigationAction
                onClick={handleScoresClick}
                sx={{
                    '.Mui-selected': {
                        color: '#FAF9F6'
                    }, '.MuiBottomNavigationAction-label': {
                        color: '#FAF9F6', fontFamily: 'Outfit'
                    }, color: '#FAF9F6'
                }}
                label="Scores"
                icon={<ScoreboardIcon sx={{color: '#FAF9F6'}}/>}
            />
            <BottomNavigationAction
                onClick={handleStandingsClick}
                sx={{
                    '.Mui-selected': {
                        color: '#FAF9F6'
                    }, '.MuiBottomNavigationAction-label': {
                        color: '#FAF9F6', fontFamily: 'Outfit'
                    }, color: '#FAF9F6'
                }}
                label="Standings"
                icon={<LeaderboardIcon sx={{color: '#FAF9F6'}}/>}
            />
            <BottomNavigationAction
                onClick={handleTeamsClick}
                sx={{
                    '.Mui-selected': {
                        color: '#FAF9F6'
                    }, '.MuiBottomNavigationAction-label': {
                        color: '#FAF9F6', fontFamily: 'Outfit'
                    }, color: '#FAF9F6'
                }}
                label="Teams"
                icon={<SportsHockeyIcon sx={{color: '#FAF9F6'}}/>}
            />
            {/* <BottomNavigationAction
          onClick={handleSearchClick}
          sx={{
            '.Mui-selected': {
              color: '#FAF9F6'
            },
            '.MuiBottomNavigationAction-label': {
              color: '#FAF9F6',
              fontFamily: 'Outfit'
            },
            color: '#FAF9F6'
          }}
          label="Search"
          icon={<SearchIcon sx={{color: '#FAF9F6'}}/>}
        /> */}
            <BottomNavigationAction
                onClick={() => navigate('/about')}
                sx={{
                    '.Mui-selected': {
                        color: '#FAF9F6'
                    }, '.MuiBottomNavigationAction-label': {
                        color: '#FAF9F6', fontFamily: 'Outfit'
                    }, color: '#FAF9F6'
                }}
                label="About"
                icon={<InfoIcon sx={{color: '#FAF9F6'}}/>}
            />
        </BottomNavigation>
    </Box>);
};

export default BottomNav;