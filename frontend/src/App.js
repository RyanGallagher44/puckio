import './App.css';
import React, {createContext} from 'react';
import {HashRouter as Router, Routes, Route, Link, Navigate} from 'react-router-dom';
import Teams from './components/Teams';
import Team from './components/Team';
import Schedule from './components/Schedule';
import Standings from './components/Standings';
import Player from './components/Player';
import Game from './components/Game';
import BottomNav from './components/BottomNav';
import About from './components/About';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Search from './components/Search';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import Navigation from './components/Navigation';

const theme = createTheme({
    typography: {
        allVariants: {
            fontFamily: 'Outfit', textTransform: 'none'
        }
    }
});

function App() {
    return (<ThemeProvider theme={theme}>
        <Router>
            <div className="App">
                <Navigation/>
            </div>
            <div className="App-body">
                <Routes>
                    <Route path="/" element={<Navigate replace to={`/schedule`}/>}/>
                    <Route path="/teams" element={<Teams/>}/>
                    <Route path="/teams/:id" element={<Team/>}/>
                    <Route path="/schedule" element={<Schedule/>}/>
                    <Route path="/standings" element={<Standings/>}/>
                    <Route path="/player/:id" element={<Player/>}/>
                    <Route path="/game/:date/:id" element={<Game/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/search" element={<Search/>}/>
                </Routes>
            </div>
            <BottomNav/>
        </Router>
    </ThemeProvider>);
}

export default App;
