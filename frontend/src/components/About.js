import {Divider, Typography} from '@mui/material';
import {Stack} from '@mui/system';
import React from 'react';

const About = () => {
    return (<Stack
        sx={{
            marginLeft: '25%', width: '50%'
        }}
    >
        <Typography sx={{marginBottom: '10px', color: '#FAF9F6'}}>
            Fair Use Disclaimer
        </Typography>
        <Divider sx={{backgroundColor: '#FAF9F6'}}/>
        <Typography sx={{fontSize: '12px', marginTop: '10px', color: '#FAF9F6'}}>
            This web application was created for the intention it be used for educational
            purposes only. This application is not intended for commercial use and was created
            by a college student in order to gain further understanding of modern web development
            technologies.
        </Typography>
        <Typography sx={{fontSize: '12px', marginTop: '10px', color: '#FAF9F6'}}>
            All National Hockey League (NHL) trademarks being used by the application are completely
            owned by the NHL, including team names, team logos, and player headshots.
        </Typography>
        <Typography sx={{fontSize: '12px', marginTop: '10px', color: '#FAF9F6'}}>
            All data being used by the application, including team stats, player stats, historical team schedules,
            player info, live game feeds, game schedules, linescores, and standings are pulled from the publicly
            accessible portions of the NHL API, for which unofficial documentation curated by Drew Hynes can be
            found here:
            &nbsp;<a target="_blank" href="https://gitlab.com/dword4/nhlapi">NHL API</a>
        </Typography>
        <Typography sx={{marginTop: '10px', marginBottom: '10px', color: '#FAF9F6'}}>
            About the Developer and Tech Stack
        </Typography>
        <Divider sx={{backgroundColor: '#FAF9F6'}}/>
        <Typography sx={{fontSize: '12px', marginTop: '10px', color: '#FAF9F6'}}>
            I'm Ryan Gallagher, a former Computer Science student and alum of
            Stevens Institute of Technology in Hoboken, NJ and I'm currently working as a full-time
            software engineer in the healthcare industry. Over my junior and senior years
            of college, I took on a strong passion for full-stack web development and decided
            to create something that blended two of my favorite things, coding and hockey.
        </Typography>
        <Typography sx={{fontSize: '12px', marginTop: '10px', color: '#FAF9F6'}}>
            Development for puck.io began in the Fall of 2022 and endured a steady pace of development up until
            the Spring of 2023. This web application makes use of the MERN stack (MongoDB, Express.js, React.js, and
            Node.js). The Node.js/Express.js
            server is deployed with the React.js frontend on Heroku. The Express.js server is a host for endpoints
            designed by me
            specifically for this application. These endpoints make calls to the NHL API and sanitizes the data in
            such a way that
            can easily be displayed to the user.
        </Typography>
        <Typography sx={{fontSize: '12px', marginTop: '10px', color: '#FAF9F6'}}>
            The frontend is a React.js SPA that uses React Router for navigation and the React component library
            MaterialUI for
            styling.
        </Typography>
        {/* <Typography sx={{marginTop: '10px', marginBottom: '10px', color: '#FAF9F6'}}>
                Plans for the Future
            </Typography>
            <Divider sx={{backgroundColor: '#FAF9F6'}} />
            <Typography sx={{fontSize: '12px', marginTop: '10px', color: '#FAF9F6'}}>
                I would love to incorporate some sort of gamification to puck.io where perhaps users can register/login and create a profile so they 
                can add friends and such.  It would be nice to have it so that users can submit predictions for NHL games among other things and then award 
                points to users based on how correct they were.  These points could be used for a leaderboard amongst all-time users as well as amongst friends.  
                Users would be able to select their favorite team and participate in challenges that way as well.  This part is not very well thought out yet, but 
                I believe there is potential.
            </Typography>
            <Typography sx={{fontSize: '12px', marginTop: '10px', color: '#FAF9F6'}}>
                Another really big thing that I would love to do is transform the current application to use React Native, so that 
                it is natively supported on Android and iOS devices.  I have tooled around with XCode, trying to mimic the application that I have going here, but 
                without a very strong understanding of Swift and the nature of iOS development, it would take way too much time to replicate. 
            </Typography>
            <Typography sx={{fontSize: '12px', marginTop: '10px', marginBottom: '10px', color: '#FAF9F6'}}>
                If what I am doing interests you in any way or you have any questions about puck.io, please reach out to me through <a target="_blank" href="https://www.linkedin.com/in/ryan-gallagher-1a6a37190/">LinkedIn</a>!
            </Typography> */}
    </Stack>);
};

export default About;