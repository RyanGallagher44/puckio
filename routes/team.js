const express = require('express');
const router = express.Router();
const axios = require('axios');
const ordinal = require('ordinal');

function convertUTCDateToLocalDate(date) {
    return new Date(Date.parse(date));
}

router.get('/', async (req, res) => {
    const {data} = await axios.get('https://statsapi.web.nhl.com/api/v1/teams');

    let teams = [];
    data.teams.forEach((team) => {
        let nameSplit = team.name.split(" ");
        let imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
        nameSplit.forEach((word, index) => {
            if (index === nameSplit.length - 1) {
                imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
            } else {
                imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
            }
        });

        let teamObject = {
            teamId: team.id,
            name: team.name,
            venue: {
                name: team.venue.name, city: team.venue.city
            },
            abbreviation: team.abbreviation,
            firstYearOfPlay: team.firstYearOfPlay,
            division: team.division.name,
            conference: team.conference.name,
            imageUrl: imageUrlPrefix
        };

        teams.push(teamObject);
    });

    res.json(teams);
});

router.get('/:id', async (req, res) => {
    try {
        const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${req.params.id}?expand=team.roster`);

        const heroImage = (await axios.get(`https://records.nhl.com/site/api/franchise-detail?cayenneExp=mostRecentTeamId=${req.params.id}`)).data.data[0].heroImageUrl;

        const rankings = await axios.get('https://statsapi.web.nhl.com/api/v1/standings');

        let teamRankings = {};
        rankings.data.records.forEach((record) => {
            record.teamRecords.forEach((team) => {
                if (team.team.id == req.params.id) {
                    teamRankings = team;
                }
            });
        });

        let imageUrlPrefix = undefined;
        if (data.teams[0].name === 'Atlanta Thrashers') {
            imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
        } else {
            let nameSplit = data.teams[0].name.split(" ");
            imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
            nameSplit.forEach((word, index) => {
                if (index === nameSplit.length - 1) {
                    imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                } else {
                    imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                }
            });
        }

        let players = [];
        let goalies = [];
        data.teams[0].roster.roster.forEach((player) => {
            if (player.position.abbreviation != 'G') {
                let playerObject = {
                    playerId: player.person.id,
                    name: player.person.fullName,
                    jerseyNumber: player.jerseyNumber,
                    position: player.position.abbreviation,
                    imageUrl: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${player.person.id}.jpg`
                };
                players.push(playerObject);
            } else {
                let goalieObject = {
                    playerId: player.person.id,
                    name: player.person.fullName,
                    jerseyNumber: player.jerseyNumber,
                    position: player.position.abbreviation,
                    imageUrl: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${player.person.id}.jpg`
                };
                goalies.push(goalieObject);
            }
        });

        if (!teamRankings.streak) {
            streakCode = "-";
        } else {
            streakCode = teamRankings.streak.streakCode;
        }

        let teamObject = {
            teamId: data.teams[0].id,
            name: data.teams[0].name,
            venue: {
                name: data.teams[0].venue.name, city: data.teams[0].venue.city
            },
            abbreviation: data.teams[0].abbreviation,
            firstYearOfPlay: data.teams[0].firstYearOfPlay,
            division: data.teams[0].division.name,
            conference: data.teams[0].conference.name,
            divisionRanking: `${ordinal(parseInt(teamRankings.divisionRank))} in the ${data.teams[0].division.name}`,
            conferenceRanking: `${ordinal(parseInt(teamRankings.conferenceRank))} in the ${data.teams[0].conference.name}`,
            leagueRanking: `${ordinal(parseInt(teamRankings.leagueRank))} in the NHL`,
            streak: streakCode,
            record: `${teamRankings.leagueRecord.wins}-${teamRankings.leagueRecord.losses}-${teamRankings.leagueRecord.ot}`,
            imageUrl: imageUrlPrefix,
            heroImage: heroImage,
            players: players,
            goalies: goalies
        };

        console.log(teamObject);

        return res.json(teamObject);
    } catch (e) {
        console.log(e);
        return res.status(404).json({error: `A team with that ID (${req.params.id}) does not exist!`});
    }
});

router.get('/:id/stats', async (req, res) => {
    const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${req.params.id}/stats`);

    let statsObject = {
        Wins: {
            stat: data.stats[0].splits[0].stat.wins, rank: data.stats[1].splits[0].stat.wins
        }, Losses: {
            stat: data.stats[0].splits[0].stat.losses, rank: data.stats[1].splits[0].stat.losses
        }, OT: {
            stat: data.stats[0].splits[0].stat.ot, rank: data.stats[1].splits[0].stat.ot
        }, Points: {
            stat: data.stats[0].splits[0].stat.pts, rank: data.stats[1].splits[0].stat.pts
        }, "Point %": {
            stat: data.stats[0].splits[0].stat.ptPctg, rank: data.stats[1].splits[0].stat.ptPctg
        }, "Goals per Game": {
            stat: data.stats[0].splits[0].stat.goalsPerGame.toFixed(2), rank: data.stats[1].splits[0].stat.goalsPerGame
        }, "Goals Against per Game": {
            stat: data.stats[0].splits[0].stat.goalsAgainstPerGame.toFixed(2),
            rank: data.stats[1].splits[0].stat.goalsAgainstPerGame
        }, "Even Strength Goals to Goals Against Ratio": {
            stat: data.stats[0].splits[0].stat.evGGARatio.toFixed(2), rank: data.stats[1].splits[0].stat.evGGARatio
        }, "Powerplay %": {
            stat: data.stats[0].splits[0].stat.powerPlayPercentage,
            rank: data.stats[1].splits[0].stat.powerPlayPercentage
        }, "Powerplay Goals": {
            stat: data.stats[0].splits[0].stat.powerPlayGoals, rank: data.stats[1].splits[0].stat.powerPlayGoals
        }, "Powerplay Goals Against": {
            stat: data.stats[0].splits[0].stat.powerPlayGoalsAgainst,
            rank: data.stats[1].splits[0].stat.powerPlayGoalsAgainst
        }, "Powerplay Opportunities": {
            stat: data.stats[0].splits[0].stat.powerPlayOpportunities,
            rank: data.stats[1].splits[0].stat.powerPlayOpportunities
        }, "Penalty Kill %": {
            stat: data.stats[0].splits[0].stat.penaltyKillPercentage,
            rank: data.stats[1].splits[0].stat.penaltyKillPercentage
        }, "Shots per Game": {
            stat: data.stats[0].splits[0].stat.shotsPerGame.toFixed(1), rank: data.stats[1].splits[0].stat.shotsPerGame
        }, "Shots Against per Game": {
            stat: data.stats[0].splits[0].stat.shotsAllowed.toFixed(1), rank: data.stats[1].splits[0].stat.shotsAllowed
        }, "Win % When Scoring First": {
            stat: (data.stats[0].splits[0].stat.winScoreFirst * 100).toFixed(1),
            rank: data.stats[1].splits[0].stat.winScoreFirst
        }, "Win % When Opponent Scores First": {
            stat: (data.stats[0].splits[0].stat.winOppScoreFirst * 100).toFixed(1),
            rank: data.stats[1].splits[0].stat.winOppScoreFirst
        }, "Win % When Leading After 1st Period": {
            stat: (data.stats[0].splits[0].stat.winLeadFirstPer * 100).toFixed(1),
            rank: data.stats[1].splits[0].stat.winLeadFirstPer
        }, "Win % When Leading After 2nd Period": {
            stat: (data.stats[0].splits[0].stat.winLeadSecondPer * 100).toFixed(1),
            rank: data.stats[1].splits[0].stat.winLeadSecondPer
        }, "Win % When Outshooting Opponent": {
            stat: (data.stats[0].splits[0].stat.winOutshootOpp * 100).toFixed(1),
            rank: data.stats[1].splits[0].stat.winOutshootOpp
        }, "Win % When Outshot By Opponent": {
            stat: (data.stats[0].splits[0].stat.winOutshotByOpp * 100).toFixed(1),
            rank: data.stats[1].splits[0].stat.winOutshotByOpp
        }, "Faceoffs Taken": {
            stat: data.stats[0].splits[0].stat.faceOffsTaken, rank: data.stats[1].splits[0].stat.faceOffsTaken
        }, "Faceoffs Won": {
            stat: data.stats[0].splits[0].stat.faceOffsWon, rank: data.stats[1].splits[0].stat.faceOffsWon
        }, "Faceoffs Lost": {
            stat: data.stats[0].splits[0].stat.faceOffsLost, rank: data.stats[1].splits[0].stat.faceOffsLost
        }, "Faceoff Win %": {
            stat: data.stats[0].splits[0].stat.faceOffWinPercentage,
            rank: data.stats[1].splits[0].stat.faceOffWinPercentage
        }, "Shooting %": {
            stat: data.stats[0].splits[0].stat.shootingPctg, rank: data.stats[1].splits[0].stat.shootingPctRank
        }, "Save %": {
            stat: data.stats[0].splits[0].stat.savePctg, rank: data.stats[1].splits[0].stat.savePctRank
        }
    };

    res.json(statsObject);
});

router.get('/:id/schedule/:year', async (req, res) => {
    const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?teamId=${req.params.id}&season=${req.params.year}&expand=schedule.linescore`);

    let games = [];
    let preseasonGames = [];
    let postseasonGames = [];
    data.dates.forEach((date) => {
        if (date.games[0].gameType === "R") {
            let homeOrAway = "";
            let imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
            let opponentName = "";
            if (date.games[0].teams.away.team.id == req.params.id) {
                homeOrAway = "at";
                opponentName = date.games[0].teams.home.team.name;

                let nameSplit = opponentName.split(" ");
                nameSplit.forEach((word, index) => {
                    if (index === nameSplit.length - 1) {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                    } else {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                    }
                });
            } else {
                homeOrAway = "vs";
                opponentName = date.games[0].teams.away.team.name;

                let nameSplit = opponentName.split(" ");
                nameSplit.forEach((word, index) => {
                    if (index === nameSplit.length - 1) {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                    } else {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                    }
                });
            }

            let gameStatus = "";
            if (date.games[0].status.detailedState === "Final") {
                if (homeOrAway === "at") {
                    if (date.games[0].teams.away.score < date.games[0].teams.home.score) {
                        gameStatus = `L ${date.games[0].teams.home.score}-${date.games[0].teams.away.score}`;
                    } else {
                        gameStatus = `W ${date.games[0].teams.away.score}-${date.games[0].teams.home.score}`
                    }
                    if (date.games[0].linescore.currentPeriod === 4) {
                        gameStatus = `OT ${gameStatus}`;
                    }
                    if (date.games[0].linescore.currentPeriod === 5) {
                        gameStatus = `SO ${gameStatus}`;
                    }
                } else {
                    if (date.games[0].teams.home.score < date.games[0].teams.away.score) {
                        gameStatus = `L ${date.games[0].teams.away.score}-${date.games[0].teams.home.score}`;
                    } else {
                        gameStatus = `W ${date.games[0].teams.home.score}-${date.games[0].teams.away.score}`
                    }
                    if (date.games[0].linescore.currentPeriod === 4) {
                        gameStatus = `OT ${gameStatus}`;
                    }
                    if (date.games[0].linescore.currentPeriod === 5) {
                        gameStatus = `SO ${gameStatus}`;
                    }
                }
            }

            if (date.games[0].status.detailedState === "Scheduled") {
                let startTime = convertUTCDateToLocalDate(new Date(date.games[0].gameDate));
                startTimeSplit = startTime.toLocaleTimeString().split(":");
                startTime = `${startTimeSplit[0]}:${startTimeSplit[1]} ${startTime.toLocaleTimeString().substring(startTime.toLocaleTimeString().length - 2)}`
                gameStatus = startTime;
            }

            let gameLink = `${date.date}/${date.games[0].gamePk}`;

            let gameObj = {
                date: date.date,
                opponentName: opponentName,
                opponentImageUrl: imageUrlPrefix,
                homeOrAway: homeOrAway,
                gameStatus: gameStatus,
                gameLink: gameLink
            }

            games.push(gameObj);
        }

        if (date.games[0].gameType === "PR") {
            let homeOrAway = "";
            let imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
            let opponentName = "";
            if (date.games[0].teams.away.team.id == req.params.id) {
                homeOrAway = "at";
                opponentName = date.games[0].teams.home.team.name;

                let nameSplit = opponentName.split(" ");
                nameSplit.forEach((word, index) => {
                    if (index === nameSplit.length - 1) {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                    } else {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                    }
                });
            } else {
                homeOrAway = "vs";
                opponentName = date.games[0].teams.away.team.name;

                let nameSplit = opponentName.split(" ");
                nameSplit.forEach((word, index) => {
                    if (index === nameSplit.length - 1) {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                    } else {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                    }
                });
            }

            let gameStatus = "";
            if (date.games[0].status.detailedState === "Final") {
                if (homeOrAway === "at") {
                    if (date.games[0].teams.away.score < date.games[0].teams.home.score) {
                        gameStatus = `L ${date.games[0].teams.home.score}-${date.games[0].teams.away.score}`;
                    } else {
                        gameStatus = `W ${date.games[0].teams.away.score}-${date.games[0].teams.home.score}`
                    }
                    if (date.games[0].linescore.currentPeriod === 4) {
                        gameStatus = `OT ${gameStatus}`;
                    }
                    if (date.games[0].linescore.currentPeriod === 5) {
                        gameStatus = `SO ${gameStatus}`;
                    }
                } else {
                    if (date.games[0].teams.home.score < date.games[0].teams.away.score) {
                        gameStatus = `L ${date.games[0].teams.away.score}-${date.games[0].teams.home.score}`;
                    } else {
                        gameStatus = `W ${date.games[0].teams.home.score}-${date.games[0].teams.away.score}`
                    }
                    if (date.games[0].linescore.currentPeriod === 4) {
                        gameStatus = `OT ${gameStatus}`;
                    }
                    if (date.games[0].linescore.currentPeriod === 5) {
                        gameStatus = `SO ${gameStatus}`;
                    }
                }
            }

            if (date.games[0].status.detailedState === "Scheduled") {
                let startTime = convertUTCDateToLocalDate(new Date(date.games[0].gameDate));
                startTimeSplit = startTime.toLocaleTimeString().split(":");
                startTime = `${startTimeSplit[0]}:${startTimeSplit[1]} ${startTime.toLocaleTimeString().substring(startTime.toLocaleTimeString().length - 2)}`
                gameStatus = startTime;
            }

            let gameLink = `${date.date}/${date.games[0].gamePk}`;

            let gameObj = {
                date: date.date,
                opponentName: opponentName,
                opponentImageUrl: imageUrlPrefix,
                homeOrAway: homeOrAway,
                gameStatus: gameStatus,
                gameLink: gameLink
            }

            preseasonGames.push(gameObj);
        }

        if (date.games[0].gameType === "P") {
            let homeOrAway = "";
            let imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
            let opponentName = "";
            if (date.games[0].teams.away.team.id == req.params.id) {
                homeOrAway = "at";
                opponentName = date.games[0].teams.home.team.name;

                let nameSplit = opponentName.split(" ");
                nameSplit.forEach((word, index) => {
                    if (index === nameSplit.length - 1) {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                    } else {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                    }
                });
            } else {
                homeOrAway = "vs";
                opponentName = date.games[0].teams.away.team.name;

                let nameSplit = opponentName.split(" ");
                nameSplit.forEach((word, index) => {
                    if (index === nameSplit.length - 1) {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                    } else {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                    }
                });
            }

            let gameStatus = "";
            if (date.games[0].status.detailedState === "Final") {
                if (homeOrAway === "at") {
                    if (date.games[0].teams.away.score < date.games[0].teams.home.score) {
                        gameStatus = `L ${date.games[0].teams.home.score}-${date.games[0].teams.away.score}`;
                    } else {
                        gameStatus = `W ${date.games[0].teams.away.score}-${date.games[0].teams.home.score}`
                    }
                    if (date.games[0].linescore.currentPeriod === 4) {
                        gameStatus = `OT ${gameStatus}`;
                    }
                    if (date.games[0].linescore.currentPeriod === 5) {
                        gameStatus = `SO ${gameStatus}`;
                    }
                } else {
                    if (date.games[0].teams.home.score < date.games[0].teams.away.score) {
                        gameStatus = `L ${date.games[0].teams.away.score}-${date.games[0].teams.home.score}`;
                    } else {
                        gameStatus = `W ${date.games[0].teams.home.score}-${date.games[0].teams.away.score}`
                    }
                    if (date.games[0].linescore.currentPeriod === 4) {
                        gameStatus = `OT ${gameStatus}`;
                    }
                    if (date.games[0].linescore.currentPeriod === 5) {
                        gameStatus = `SO ${gameStatus}`;
                    }
                }
            }

            if (date.games[0].status.detailedState === "Scheduled") {
                let startTime = convertUTCDateToLocalDate(new Date(date.games[0].gameDate));
                startTimeSplit = startTime.toLocaleTimeString().split(":");
                startTime = `${startTimeSplit[0]}:${startTimeSplit[1]} ${startTime.toLocaleTimeString().substring(startTime.toLocaleTimeString().length - 2)}`
                gameStatus = startTime;
            }

            if (gameStatus === "") {
                gameStatus = "TBD";
            }

            let gameLink = `${date.date}/${date.games[0].gamePk}`;

            let gameObj = {
                date: date.date,
                opponentName: opponentName,
                opponentImageUrl: imageUrlPrefix,
                homeOrAway: homeOrAway,
                gameStatus: gameStatus,
                gameLink: gameLink
            }

            postseasonGames.push(gameObj);
        }
    });

    res.json({
        pre: preseasonGames, regular: games, post: postseasonGames
    });
});

module.exports = router;