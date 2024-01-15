const express = require('express');
const router = express.Router();
const axios = require('axios');

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

router.get('/randomplayers', async (req, res) => {
    const teamIds = [];
    const {data} = await axios.get('https://statsapi.web.nhl.com/api/v1/teams');

    data.teams.forEach((team) => {
        teamIds.push(team.id);
    });

    let players = [];
    for (let i = 0; i < teamIds.length; i++) {
        let data2 = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${teamIds[i]}?expand=team.roster`);

        data2.data.teams[0].roster.roster.forEach((player) => {
            if (player.position.abbreviation != 'G') {
                let playerObject = {
                    playerId: player.person.id,
                    name: player.person.fullName,
                    jerseyNumber: player.jerseyNumber,
                    position: player.position.abbreviation,
                    imageUrl: `https://assets.nhle.com/mugs/nhl/20232024/${data2.data.teams[0].abbreviation}/${player.person.id}.png`
                };
                players.push(playerObject);
            }
        });
    }

    let firstPlayer = players[randomInteger(0, players.length - 1)];
    let secondPlayer = players[randomInteger(0, players.length - 1)];

    res.json({firstPlayer: firstPlayer, secondPlayer: secondPlayer});
});

module.exports = router;