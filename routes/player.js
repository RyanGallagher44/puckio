const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:id/skater', async (req, res) => {
    try {
        let currentSeason = undefined;
        if (new Date().getMonth() + 1 >= 1 && new Date().getMonth() + 1 <= 9) {
            currentSeason = `${(new Date().getFullYear()) - 1}${new Date().getFullYear()}`;
        } else {
            currentSeason = `${new Date().getFullYear()}${(new Date().getFullYear()) + 1}`;
        }
        const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/people/${req.params.id}/stats/?stats=statsSingleSeason&season=${currentSeason}`);

        if (data.stats && data.stats.length > 0 && data.stats[0].splits && data.stats[0].splits.length > 0) {
            let statsObject = {
                playerId: req.params.id,
                games: data.stats[0].splits[0].stat.games || 0,
                goals: data.stats[0].splits[0].stat.goals || 0,
                assists: data.stats[0].splits[0].stat.assists || 0,
                points: data.stats[0].splits[0].stat.points || 0,
                pim: data.stats[0].splits[0].stat.pim || 0,
                shots: data.stats[0].splits[0].stat.shots || 0,
                shotPercentage: data.stats[0].splits[0].stat.shotPct || 0,
                hits: data.stats[0].splits[0].stat.hits || 0,
                powerPlayGoals: data.stats[0].splits[0].stat.powerPlayGoals || 0,
                blocks: data.stats[0].splits[0].stat.blocked || 0,
                plusMinus: data.stats[0].splits[0].stat.plusMinus || 0,
                timeOnIcePerGame: data.stats[0].splits[0].stat.timeOnIcePerGame || '00:00'
            };

            res.json(statsObject);
        } else {
            res.json({
                playerId: req.params.id,
                games: 0,
                goals: 0,
                assists: 0,
                points: 0,
                pim: 0,
                shots: 0,
                shotPercentage: 0,
                hits: 0,
                powerPlayGoals: 0,
                blocks: 0,
                plusMinus: 0,
                timeOnIcePerGame: '00:00'
            });
        }
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id/goalie', async (req, res) => {
    try {
        let currentSeason = undefined;
        if (new Date().getMonth() + 1 >= 1 && new Date().getMonth() + 1 <= 9) {
            currentSeason = `${(new Date().getFullYear()) - 1}${new Date().getFullYear()}`;
        } else {
            currentSeason = `${new Date().getFullYear()}${(new Date().getFullYear()) + 1}`;
        }
        const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/people/${req.params.id}/stats/?stats=statsSingleSeason&season=${currentSeason}`);

        if (data.stats && data.stats.length > 0 && data.stats[0].splits && data.stats[0].splits.length > 0) {
            let statsObject = {
                playerId: req.params.id,
                games: data.stats[0].splits[0].stat.games || 0,
                gamesStarted: data.stats[0].splits[0].stat.gamesStarted || 0,
                goalsAgainst: data.stats[0].splits[0].stat.goalsAgainst || 0,
                saves: data.stats[0].splits[0].stat.saves || 0,
                wins: data.stats[0].splits[0].stat.wins || 0,
                losses: data.stats[0].splits[0].stat.losses || 0,
                ot: data.stats[0].splits[0].stat.ot || 0,
                shutouts: data.stats[0].splits[0].stat.so || 0,
                goalsAgainstAverage: data.stats[0].splits[0].stat.goalAgainstAverage.toFixed(2) || Number(0).toFixed(2),
                savePercentage: data.stats[0].splits[0].stat.savePercentage.toFixed(3) || Number(0).toFixed(3),
                timeOnIcePerGame: data.stats[0].splits[0].stat.timeOnIcePerGame || '00:00'
            };

            res.json(statsObject);
        } else {
            res.json({
                playerId: req.params.id,
                games: 0,
                gamesStarted: 0,
                goalsAgainst: 0,
                saves: 0,
                wins: 0,
                losses: 0,
                ot: 0,
                shutouts: 0,
                goalsAgainstAverage: Number(0).toFixed(2),
                savePercentage: Number(0).toFixed(3),
                timeOnIcePerGame: '00:00'
            });
        }
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id/details', async (req, res) => {
    try {
        const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/people/${req.params.id}`);

        let playerStats = undefined;
        try {
            let stats = await axios.get(`https://statsapi.web.nhl.com/api/v1/people/${req.params.id}/stats?stats=statsSingleSeason&season=20232024`);
            stats = stats.data.stats[0].splits[0].stat;
            playerStats = {
                goals: stats.goals,
                assists: stats.assists,
                gamesPlayed: stats.games,
                penaltyMinutes: stats.pim,
                shots: stats.shots,
                hits: stats.hits,
                powerPlayGoals: stats.powerPlayGoals,
                powerPlayPoints: stats.powerPlayPoints,
                faceoffPercentage: stats.faceOffPct,
                shotPercentage: stats.shotPct,
                gameWinningGoals: stats.gameWinningGoals,
                overTimeGoals: stats.overTimeGoals,
                shortHandedGoals: stats.shortHandedGoals,
                shortHandedPoints: stats.shortHandedPoints,
                blocks: stats.blocked,
                plusMinus: stats.plusMinus,
                points: stats.points,
                timeOnIcePerGame: stats.timeOnIcePerGame,
                powerPlayTimeOnIcePerGame: stats.powerPlayTimeOnIcePerGame
            }
        } catch (e) {
            console.log(e);
            playerStats = {
                goals: 0,
                assists: 0,
                gamesPlayed: 0,
                penaltyMinutes: 0,
                shots: 0,
                hits: 0,
                powerPlayGoals: 0,
                powerPlayPoints: 0,
                faceoffPercentage: 0,
                shotPercentage: 0,
                gameWinningGoals: 0,
                overTimeGoals: 0,
                shortHandedGoals: 0,
                shortHandedPoints: 0,
                blocks: 0,
                plusMinus: 0,
                points: 0,
                timeOnIcePerGame: 0,
                powerPlayTimeOnIcePerGame: 0
            }
        }

        let nameSplit = data.people[0].currentTeam.name.split(" ");
        let imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
        nameSplit.forEach((word, index) => {
            if (index === nameSplit.length - 1) {
                imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
            } else {
                imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
            }
        });

        let currentTeamAbrv = (await axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${data.people[0].currentTeam.id}`)).data.teams[0].abbreviation;

        console.log(currentTeamAbrv);

        let playerDetailsObject = {
            fullName: data.people[0].fullName,
            number: data.people[0].primaryNumber,
            birthDate: data.people[0].birthDate,
            currentAge: data.people[0].currentAge,
            birthCity: data.people[0].birthCity,
            birthStateProvince: data.people[0].birthStateProvince,
            birthCountry: data.people[0].birthCountry,
            height: data.people[0].height,
            weight: data.people[0].weight,
            alternateCaptain: data.people[0].alternateCaptain,
            captain: data.people[0].captain,
            handedness: data.people[0].shootsCatches,
            currentTeam: data.people[0].currentTeam.name,
            currentTeamId: data.people[0].currentTeam.id,
            position: data.people[0].primaryPosition.name,
            imageUrl: `https://assets.nhle.com/mugs/nhl/20232024/${currentTeamAbrv}/${req.params.id}.png`,
            teamImageUrl: imageUrlPrefix,
            playerStats: playerStats
        };

        console.log(playerDetailsObject);

        return res.json(playerDetailsObject);
    } catch (e) {
        console.log(e);
    }
});

router.get('/search/:name', async (req, res) => {
    const {data} = await axios.get(`https://suggest.svc.nhl.com/svc/suggest/v1/minactiveplayers/${req.params.name}/10`)

    let results = [];

    data.suggestions.forEach((result) => {
        let resultArr = result.split("|");

        console.log(resultArr);

        let playerObject = {
            id: resultArr[0],
            name: `${resultArr[2]} ${resultArr[1]}`,
            team: resultArr[11],
            imageUrl: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${resultArr[0]}.jpg`
        };
        results.push(playerObject);
    });

    res.json(results);
});

module.exports = router;