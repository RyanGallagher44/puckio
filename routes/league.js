const express = require('express');
const router = express.Router();
const axios = require('axios');

function getTriCode(team) {
    let triCodes = {
        'Anaheim Ducks': 'ANA',
        'Arizona Coyotes': 'ARI',
        'Boston Bruins': 'BOS',
        'Buffalo Sabres': 'BUF',
        'Calgary Flames': 'CGY',
        'Carolina Hurricanes': 'CAR',
        'Chicago Blackhawks': 'CHI',
        'Colorado Avalanche': 'COL',
        'Columbus Blue Jackets': 'CBJ',
        'Dallas Stars': 'DAL',
        'Detroit Red Wings': 'DET',
        'Edmonton Oilers': 'EDM',
        'Florida Panthers': 'FLA',
        'Los Angeles Kings': 'LAK',
        'Minnesota Wild': 'MIN',
        'Montréal Canadiens': 'MTL',
        'Nashville Predators': 'NSH',
        'New Jersey Devils': 'NJD',
        'New York Islanders': 'NYI',
        'New York Rangers': 'NYR',
        'Ottawa Senators': 'OTT',
        'Philadelphia Flyers': 'PHI',
        'Pittsburgh Penguins': 'PIT',
        'St. Louis Blues': 'STL',
        'San Jose Sharks': 'SJS',
        'Seattle Kraken': 'SEA',
        'Tampa Bay Lightning': 'TBL',
        'Toronto Maple Leafs': 'TOR',
        'Vancouver Canucks': 'VAN',
        'Vegas Golden Knights': 'VGK',
        'Washington Capitals': 'WSH',
        'Winnipeg Jets': 'WPG'
    };
    return triCodes[team];
}

function convertUTCDateToLocalDate(date) {
    return new Date(Date.parse(date));
}

async function getHeroImage(id) {
    return (await axios.get(`https://records.nhl.com/site/api/franchise-detail?cayenneExp=mostRecentTeamId=${id}`)).data.data[0].heroImageUrl;
}

router.get('/schedule/:date', async (req, res) => {
    try {
        const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?expand=schedule.broadcasts&date=${req.params.date}`);

        let games = [];
        if (data.dates.length > 0) {
            for (let game of data.dates[0].games) {
                let imageUrlPrefixAway = undefined;
                if (game.teams.away.team.name === 'Atlanta Thrashers') {
                    imageUrlPrefixAway = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
                } else if (game.teams.away.team.name === 'Phoenix Coyotes') {
                    imageUrlPrefixAway = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
                } else if (game.teams.away.team.name === 'Ottawa Senators (1917)') {
                    imageUrlPrefixAway = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
                } else if (game.teams.away.team.name === 'Hamilton Tigers') {
                    imageUrlPrefixAway = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
                } else if (game.teams.away.team.name === 'Toronto St. Patricks') {
                    imageUrlPrefixAway = 'https://content.sportslogos.net/logos/1/997/full/280.png';
                } else if (game.teams.away.team.name === 'Montreal Maroons') {
                    imageUrlPrefixAway = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
                } else {
                    let nameSplitAway = game.teams.away.team.name.split(" ");
                    imageUrlPrefixAway = 'https://loodibee.com/wp-content/uploads/nhl-';
                    nameSplitAway.forEach((word, index) => {
                        if (index === nameSplitAway.length - 1) {
                            imageUrlPrefixAway += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                        } else {
                            imageUrlPrefixAway += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                        }
                    });
                }

                let imageUrlPrefixHome = undefined;
                if (game.teams.home.team.name === 'Atlanta Thrashers') {
                    imageUrlPrefixHome = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
                } else if (game.teams.home.team.name === 'Phoenix Coyotes') {
                    imageUrlPrefixHome = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
                } else if (game.teams.home.team.name === 'Ottawa Senators (1917)') {
                    imageUrlPrefixHome = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
                } else if (game.teams.home.team.name === 'Hamilton Tigers') {
                    imageUrlPrefixHome = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
                } else if (game.teams.home.team.name === 'Toronto St. Patricks') {
                    imageUrlPrefixHome = 'https://content.sportslogos.net/logos/1/997/full/280.png';
                } else if (game.teams.home.team.name === 'Montreal Maroons') {
                    imageUrlPrefixHome = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
                } else {
                    let nameSplitHome = game.teams.home.team.name.split(" ");
                    imageUrlPrefixHome = 'https://loodibee.com/wp-content/uploads/nhl-';
                    nameSplitHome.forEach((word, index) => {
                        if (index === nameSplitHome.length - 1) {
                            imageUrlPrefixHome += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                        } else {
                            imageUrlPrefixHome += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                        }
                    });
                }

                let broadcasts = [];
                if (game.broadcasts) {
                    game.broadcasts.forEach((broadcast) => {
                        broadcasts.push(broadcast.name);
                    });
                }

                let broadcastString = '';
                broadcasts.forEach((broadcast, index) => {
                    if (index === broadcasts.length - 1) {
                        broadcastString += broadcast;
                    } else {
                        broadcastString += `${broadcast}, `;
                    }
                });

                let startTime = convertUTCDateToLocalDate(new Date(game.gameDate));
                startTimeSplit = startTime.toLocaleTimeString().split(":");
                startTime = `${startTimeSplit[0]}:${startTimeSplit[1]} ${startTime.toLocaleTimeString().substring(startTime.toLocaleTimeString().length - 2)}`

                const awayHeroImage = await getHeroImage(game.teams.away.team.id);
                const homeHeroImage = await getHeroImage(game.teams.home.team.id);

                let seriesStatus = "";
                let roundGameStatus = "";
                if (game.gameType === "P") {
                    let seriesInfo = await axios.get('https://statsapi.web.nhl.com/api/v1/tournaments/playoffs?expand=round.series,schedule.game.seriesSummary&season=20222023');
                    let seriesFound = false;
                    for (let i = 0; i < seriesInfo.data.rounds.length; i++) {
                        seriesInfo.data.rounds[i].series.forEach((serie) => {
                            if ((serie.matchupTeams[0].team.id === game.teams.home.team.id && serie.matchupTeams[1].team.id === game.teams.away.team.id) || (serie.matchupTeams[0].team.id === game.teams.away.team.id && serie.matchupTeams[1].team.id === game.teams.home.team.id)) {
                                if (serie.matchupTeams[0].seriesRecord.wins > serie.matchupTeams[1].seriesRecord.wins) {
                                    seriesStatus = `${getTriCode(serie.matchupTeams[0].team.name)} leads ${serie.matchupTeams[0].seriesRecord.wins}-${serie.matchupTeams[1].seriesRecord.wins}`
                                }
                                if (serie.matchupTeams[0].seriesRecord.wins < serie.matchupTeams[1].seriesRecord.wins) {
                                    seriesStatus = `${getTriCode(serie.matchupTeams[1].team.name)} leads ${serie.matchupTeams[1].seriesRecord.wins}-${serie.matchupTeams[0].seriesRecord.wins}`
                                }
                                if (serie.matchupTeams[0].seriesRecord.wins === serie.matchupTeams[1].seriesRecord.wins) {
                                    seriesStatus = `Tied ${serie.matchupTeams[0].seriesRecord.wins}-${serie.matchupTeams[1].seriesRecord.wins}`
                                }
                                roundGameStatus = `Round ${seriesInfo.data.rounds[i].number}, ${serie.currentGame.seriesSummary.gameLabel}`
                                seriesFound = true;
                            }
                        });
                        if (seriesFound) break;
                    }
                }

                let gameObject = {
                    id: game.gamePk,
                    startTime: startTime,
                    teams: {
                        away: {
                            teamId: game.teams.away.team.id,
                            name: game.teams.away.team.name,
                            triCode: getTriCode(game.teams.away.team.name),
                            imageUrl: imageUrlPrefixAway,
                            score: game.teams.away.score,
                            heroImageUrl: awayHeroImage
                        }, home: {
                            teamId: game.teams.home.team.id,
                            name: game.teams.home.team.name,
                            triCode: getTriCode(game.teams.home.team.name),
                            imageUrl: imageUrlPrefixHome,
                            score: game.teams.home.score,
                            heroImageUrl: homeHeroImage
                        }
                    },
                    venue: game.venue.name,
                    seriesStatus: seriesStatus,
                    roundGameStatus: roundGameStatus,
                    status: game.status.detailedState,
                    broadcasts: broadcastString || 'TBD'
                }

                games.push(gameObject);
            }
            return res.json(games);
        } else {
            return res.json([]);
        }
    } catch (e) {
        console.log(e);
        return res.json([]);
    }
});

router.get('/standings/division', async (req, res) => {
    const {data} = await axios.get('https://statsapi.web.nhl.com/api/v1/standings');

    let standings = [];
    data.records.forEach((record) => {
        let divisionStandings = [];
        record.teamRecords.forEach((teamRecord) => {
            let imageUrlPrefix = undefined;
            if (teamRecord.team.name === 'Atlanta Thrashers') {
                imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
            } else if (teamRecord.team.name === 'Phoenix Coyotes') {
                imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
            } else if (teamRecord.team.name === 'Ottawa Senators (1917)') {
                imageUrlPrefix = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
            } else if (teamRecord.team.name === 'Hamilton Tigers') {
                imageUrlPrefix = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
            } else if (teamRecord.team.name === 'Toronto St. Patrick') {
                imageUrlPrefix = 'https://content.sportslogos.net/logos/1/997/full/280.png';
            } else if (teamRecord.team.name === 'Montreal Maroons') {
                imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
            } else {
                let nameSplit = teamRecord.team.name.split(" ");
                imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
                nameSplit.forEach((word, index) => {
                    if (index === nameSplit.length - 1) {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                    } else {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                    }
                });
            }

            if (!teamRecord.streak) {
                streakCode = "-";
            } else {
                streakCode = teamRecord.streak.streakCode;
            }

            let recordObject = {
                id: teamRecord.team.id,
                division: record.division.name,
                name: teamRecord.team.name,
                wins: teamRecord.leagueRecord.wins,
                losses: teamRecord.leagueRecord.losses,
                ot: teamRecord.leagueRecord.ot,
                goalsAgainst: teamRecord.goalsAgainst,
                goalsScored: teamRecord.goalsScored,
                goalDifferential: teamRecord.goalsScored - teamRecord.goalsAgainst,
                points: teamRecord.points,
                divisionRank: teamRecord.divisionRank,
                conferenceRank: teamRecord.conferenceRank,
                leagueRank: teamRecord.leagueRank,
                gamesPlayed: teamRecord.gamesPlayed,
                streak: streakCode,
                pointsPercentage: teamRecord.pointsPercentage.toFixed(3),
                clinchIndicator: teamRecord.clinchIndicator,
                imageUrl: imageUrlPrefix
            };
            divisionStandings.push(recordObject);
        });
        standings.push(divisionStandings);
    });

    res.json(standings);
});

router.get('/standings/conference', async (req, res) => {
    const {data} = await axios.get('https://statsapi.web.nhl.com/api/v1/standings?standingsType=byConference');

    let standings = [];
    data.records.forEach((record) => {
        let conferenceStandings = [];
        record.teamRecords.forEach((teamRecord) => {
            let imageUrlPrefix = undefined;
            if (teamRecord.team.name === 'Atlanta Thrashers') {
                imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
            } else if (teamRecord.team.name === 'Phoenix Coyotes') {
                imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
            } else if (teamRecord.team.name === 'Ottawa Senators (1917)') {
                imageUrlPrefix = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
            } else if (teamRecord.team.name === 'Hamilton Tigers') {
                imageUrlPrefix = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
            } else if (teamRecord.team.name === 'Toronto St. Patrick') {
                imageUrlPrefix = 'https://content.sportslogos.net/logos/1/997/full/280.png';
            } else if (teamRecord.team.name === 'Montreal Maroons') {
                imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
            } else {
                let nameSplit = teamRecord.team.name.split(" ");
                imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
                nameSplit.forEach((word, index) => {
                    if (index === nameSplit.length - 1) {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                    } else {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                    }
                });
            }

            if (!teamRecord.streak) {
                streakCode = "-";
            } else {
                streakCode = teamRecord.streak.streakCode;
            }

            let recordObject = {
                id: teamRecord.team.id,
                conference: record.conference.name,
                name: teamRecord.team.name,
                wins: teamRecord.leagueRecord.wins,
                losses: teamRecord.leagueRecord.losses,
                ot: teamRecord.leagueRecord.ot,
                goalsAgainst: teamRecord.goalsAgainst,
                goalsScored: teamRecord.goalsScored,
                goalDifferential: teamRecord.goalsScored - teamRecord.goalsAgainst,
                points: teamRecord.points,
                divisionRank: teamRecord.divisionRank,
                conferenceRank: teamRecord.conferenceRank,
                leagueRank: teamRecord.leagueRank,
                gamesPlayed: teamRecord.gamesPlayed,
                streak: streakCode,
                pointsPercentage: teamRecord.pointsPercentage.toFixed(3),
                clinchIndicator: teamRecord.clinchIndicator,
                imageUrl: imageUrlPrefix
            };
            conferenceStandings.push(recordObject);
        });
        standings.push(conferenceStandings);
    });

    res.json(standings);
});

router.get('/standings/league', async (req, res) => {
    const {data} = await axios.get('https://statsapi.web.nhl.com/api/v1/standings?standingsType=byLeague');

    let standings = [];
    data.records[0].teamRecords.forEach((teamRecord) => {
        let imageUrlPrefix = undefined;
        if (teamRecord.team.name === 'Atlanta Thrashers') {
            imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
        } else if (teamRecord.team.name === 'Phoenix Coyotes') {
            imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
        } else if (teamRecord.team.name === 'Ottawa Senators (1917)') {
            imageUrlPrefix = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
        } else if (teamRecord.team.name === 'Hamilton Tigers') {
            imageUrlPrefix = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
        } else if (teamRecord.team.name === 'Toronto St. Patrick') {
            imageUrlPrefix = 'https://content.sportslogos.net/logos/1/997/full/280.png';
        } else if (teamRecord.team.name === 'Montreal Maroons') {
            imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
        } else {
            let nameSplit = teamRecord.team.name.split(" ");
            imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
            nameSplit.forEach((word, index) => {
                if (index === nameSplit.length - 1) {
                    imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                } else {
                    imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                }
            });
        }

        if (!teamRecord.streak) {
            streakCode = "-";
        } else {
            streakCode = teamRecord.streak.streakCode;
        }

        let recordObject = {
            id: teamRecord.team.id,
            name: teamRecord.team.name,
            wins: teamRecord.leagueRecord.wins,
            losses: teamRecord.leagueRecord.losses,
            ot: teamRecord.leagueRecord.ot,
            goalsAgainst: teamRecord.goalsAgainst,
            goalsScored: teamRecord.goalsScored,
            goalDifferential: teamRecord.goalsScored - teamRecord.goalsAgainst,
            points: teamRecord.points,
            divisionRank: teamRecord.divisionRank,
            conferenceRank: teamRecord.conferenceRank,
            leagueRank: teamRecord.leagueRank,
            gamesPlayed: teamRecord.gamesPlayed,
            streak: streakCode,
            pointsPercentage: teamRecord.pointsPercentage.toFixed(3),
            clinchIndicator: teamRecord.clinchIndicator,
            imageUrl: imageUrlPrefix
        };
        standings.push(recordObject);
    });

    res.json(standings);
});

router.get('/topscorers/:date', async (req, res) => {
    try {
        const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?date=${req.params.date}`);

        let gameIds = [];
        if (data.dates.length > 0) {
            data.dates[0].games.forEach((game) => {
                gameIds.push(game.gamePk);
            })
        }

        let scorers = {};
        for (let i = 0; i < gameIds.length; i++) {
            const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${gameIds[i]}/feed/live`);

            data.liveData.plays.allPlays.forEach((play) => {
                if (play.result.event === "Goal") {
                    play.players.forEach((player) => {
                        if (player.playerType === "Scorer" || player.playerType === "Assist") {
                            let playerName = player.player.fullName;
                            if (scorers[playerName]) {
                                scorers[playerName].points = scorers[playerName].points + 1;
                                if (player.playerType === "Scorer") {
                                    scorers[playerName].goals = scorers[playerName].goals + 1;
                                } else {
                                    scorers[playerName].assists = scorers[playerName].assists + 1;
                                }
                            } else {
                                if (player.playerType === "Scorer") {
                                    scorers[playerName] = {
                                        id: player.player.id,
                                        points: 1,
                                        goals: 1,
                                        assists: 0,
                                        team: play.team.name,
                                        triCode: play.team.triCode
                                    };
                                } else {
                                    scorers[playerName] = {
                                        id: player.player.id,
                                        points: 1,
                                        goals: 0,
                                        assists: 1,
                                        team: play.team.name,
                                        triCode: play.team.triCode
                                    };
                                }
                            }
                        }
                    });
                }
            });
        }

        let top = [];
        for (let player in scorers) {
            top.push([player, scorers[player].points, scorers[player].team, scorers[player].goals, scorers[player].assists, scorers[player].id, scorers[player].triCode]);
        }

        top.sort(function (a, b) {
            return b[1] - a[1] || b[3] - a[3] || b[4] - a[4]
        });

        for (let i = 0; i < top.length; i++) {
            let imageUrlPrefix = undefined;
            if (top[i][2] === 'Atlanta Thrashers') {
                imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
            } else if (top[i][2] === 'Phoenix Coyotes') {
                imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
            } else if (top[i][2] === 'Ottawa Senators (1917)') {
                imageUrlPrefix = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
            } else if (top[i][2] === 'Hamilton Tigers') {
                imageUrlPrefix = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
            } else if (top[i][2] === 'Toronto St. Patricks') {
                imageUrlPrefix = 'https://content.sportslogos.net/logos/1/997/full/280.png';
            } else if (top[i][2] === 'Montreal Maroons') {
                imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
            } else {
                let nameSplit = top[i][2].split(" ");
                imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
                nameSplit.forEach((word, index) => {
                    if (index === nameSplit.length - 1) {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                    } else {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                    }
                });
            }
            top[i].push(imageUrlPrefix);
        }

        res.json(top.splice(0, 5));
    } catch (e) {
        res.json([]);
    }
});

router.get('/topgoalies/:date', async (req, res) => {
    try {
        const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?date=${req.params.date}`);

        let gameIds = [];
        if (data.dates.length > 0) {
            data.dates[0].games.forEach((game) => {
                gameIds.push(game.gamePk);
            })
        }

        let goalies = [];
        for (let i = 0; i < gameIds.length; i++) {
            const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${gameIds[i]}/feed/live`);

            let homePlayerIds = Object.keys(data.liveData.boxscore.teams.home.players);
            let awayPlayerIds = Object.keys(data.liveData.boxscore.teams.away.players);
            homePlayerIds.forEach((id) => {
                let stats = data.liveData.boxscore.teams.home.players[id].stats.goalieStats;
                if (stats && stats.timeOnIce.split(":")[0] >= 30) {
                    goalies.push({
                        team: data.liveData.boxscore.teams.home.team.name,
                        id: data.liveData.boxscore.teams.home.players[id].person.id,
                        name: data.liveData.boxscore.teams.home.players[id].person.fullName,
                        goalsAgainstAverage: (((stats.shots - stats.saves) * 60) / (parseInt(stats.timeOnIce.split(":")[0]))).toFixed(2),
                        savePercentage: ((stats.savePercentage) / 100).toFixed(3)
                    })
                }
            });

            awayPlayerIds.forEach((id) => {
                let stats = data.liveData.boxscore.teams.away.players[id].stats.goalieStats;
                if (stats && stats.timeOnIce.split(":")[0] >= 30) {
                    goalies.push({
                        team: data.liveData.boxscore.teams.away.team.name,
                        id: data.liveData.boxscore.teams.away.players[id].person.id,
                        name: data.liveData.boxscore.teams.away.players[id].person.fullName,
                        goalsAgainstAverage: (((stats.shots - stats.saves) * 60) / (parseInt(stats.timeOnIce.split(":")[0]))).toFixed(2),
                        savePercentage: ((stats.savePercentage) / 100).toFixed(3)
                    })
                }
            });
        }

        goalies.sort(function (a, b) {
            return a.goalsAgainstAverage - b.goalsAgainstAverage || b.savePercentage - a.savePercentage
        });

        for (let i = 0; i < goalies.length; i++) {
            let imageUrlPrefix = undefined;
            if (goalies[i].team === 'Atlanta Thrashers') {
                imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
            } else if (goalies[i].team === 'Phoenix Coyotes') {
                imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
            } else if (goalies[i].team === 'Ottawa Senators (1917)') {
                imageUrlPrefix = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
            } else if (goalies[i].team === 'Hamilton Tigers') {
                imageUrlPrefix = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
            } else if (goalies[i].team === 'Toronto St. Patricks') {
                imageUrlPrefix = 'https://content.sportslogos.net/logos/1/997/full/280.png';
            } else if (goalies[i].team === 'Montreal Maroons') {
                imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
            } else {
                let nameSplit = goalies[i].team.split(" ");
                imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
                nameSplit.forEach((word, index) => {
                    if (index === nameSplit.length - 1) {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                    } else {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                    }
                });
            }
            goalies[i].imageUrl = imageUrlPrefix;
        }

        res.json(goalies.splice(0, 5));
    } catch (e) {
        res.json([]);
    }
});

module.exports = router;