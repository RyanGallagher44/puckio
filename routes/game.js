const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/linescore/:id', async (req, res) => {
    const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${req.params.id}/linescore`);

    let gameObject = {
        currentPeriod: data.currentPeriodOrdinal, currentPeriodTimeRemaining: data.currentPeriodTimeRemaining, home: {
            shots: data.teams.home.shotsOnGoal, powerplay: data.teams.home.powerplay
        }, away: {
            shots: data.teams.away.shotsOnGoal, powerplay: data.teams.away.powerplay
        }
    };

    res.json(gameObject);
});

router.get('/:id', async (req, res) => {
    const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${req.params.id}/feed/live`);

    let imageUrlPrefixAway = undefined;
    if (data.gameData.teams.away.name === 'Atlanta Thrashers') {
        imageUrlPrefixAway = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
    } else if (data.gameData.teams.away.name === 'Phoenix Coyotes') {
        imageUrlPrefixAway = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
    } else if (data.gameData.teams.away.name === 'Ottawa Senators (1917)') {
        imageUrlPrefixAway = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
    } else if (data.gameData.teams.away.name === 'Hamilton Tigers') {
        imageUrlPrefixAway = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
    } else if (data.gameData.teams.away.name === 'Toronto St. Patricks') {
        imageUrlPrefixAway = 'https://content.sportslogos.net/logos/1/997/full/280.png';
    } else if (data.gameData.teams.away.name === 'Montreal Maroons') {
        imageUrlPrefixAway = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
    } else {
        let nameSplitAway = data.gameData.teams.away.name.split(" ");
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
    if (data.gameData.teams.home.name === 'Atlanta Thrashers') {
        imageUrlPrefixHome = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
    } else if (data.gameData.teams.home.name === 'Phoenix Coyotes') {
        imageUrlPrefixHome = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
    } else if (data.gameData.teams.home.name === 'Ottawa Senators (1917)') {
        imageUrlPrefixHome = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
    } else if (data.gameData.teams.home.name === 'Hamilton Tigers') {
        imageUrlPrefixHome = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
    } else if (data.gameData.teams.home.name === 'Toronto St. Patricks') {
        imageUrlPrefixHome = 'https://content.sportslogos.net/logos/1/997/full/280.png';
    } else if (data.gameData.teams.home.name === 'Montreal Maroons') {
        imageUrlPrefixHome = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
    } else {
        let nameSplitHome = data.gameData.teams.home.name.split(" ");
        imageUrlPrefixHome = 'https://loodibee.com/wp-content/uploads/nhl-';
        nameSplitHome.forEach((word, index) => {
            if (index === nameSplitHome.length - 1) {
                imageUrlPrefixHome += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
            } else {
                imageUrlPrefixHome += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
            }
        });
    }

    let plays = [];
    let goals = [];
    let penalties = [];
    let shootout = [];
    let shootoutPlayers = 0
    let shootoutRound = 1;
    data.liveData.plays.allPlays.forEach((play) => {
        if (play.about.period === 5 && (play.result.event === "Missed Shot" || play.result.event === "Shot")) {
            let imageUrl = undefined;
            if (data.gameData.teams.away.name === play.team.name) {
                imageUrl = imageUrlPrefixAway;
            } else {
                imageUrl = imageUrlPrefixHome;
            }

            if (shootoutPlayers === 0) {
                shootout.push([{
                    player: play.players[0].player.fullName,
                    playerId: play.players[0].player.id,
                    result: 0,
                    imageUrl: imageUrl
                }]);
            }

            if (shootoutPlayers === 1) {
                shootout[shootout.length - 1].push({
                    player: play.players[0].player.fullName,
                    playerId: play.players[0].player.id,
                    result: 0,
                    imageUrl: imageUrl
                });
            }

            shootoutPlayers++;
            if (shootoutPlayers === 2) {
                shootoutPlayers = 0;
                shootoutRound++;
            }
        }

        if (play.about.period === 5 && play.result.event === "Goal") {
            let imageUrl = undefined;
            if (data.gameData.teams.away.name === play.team.name) {
                imageUrl = imageUrlPrefixAway;
            } else {
                imageUrl = imageUrlPrefixHome;
            }

            if (shootoutPlayers === 0) {
                shootout.push([{
                    player: play.players[0].player.fullName,
                    playerId: play.players[0].player.id,
                    result: 1,
                    imageUrl: imageUrl
                }]);
            }

            if (shootoutPlayers === 1) {
                shootout[shootout.length - 1].push({
                    player: play.players[0].player.fullName,
                    playerId: play.players[0].player.id,
                    result: 1,
                    imageUrl: imageUrl
                });
            }

            shootoutPlayers++;
            if (shootoutPlayers === 2) {
                shootoutPlayers = 0;
                shootoutRound++;
            }
        }

        if (play.result.event === "Goal") {
            let imageUrl = undefined;
            if (data.gameData.teams.away.name === play.team.name) {
                imageUrl = imageUrlPrefixAway;
            } else {
                imageUrl = imageUrlPrefixHome;
            }

            let assistName1 = undefined;
            let assistName2 = undefined;
            let assistTotal1 = undefined;
            let assistTotal2 = undefined;
            if (play.players[1] && play.players[1].playerType === 'Assist') {
                assistName1 = play.players[1].player.fullName;
                assistTotal1 = play.players[1].seasonTotal;
            }
            if (play.players[2] && play.players[2].playerType === 'Assist') {
                assistName2 = play.players[2].player.fullName;
                assistTotal2 = play.players[2].seasonTotal;
            }

            let goalObject = {
                playerId: play.players[0].player.id,
                scorerName: play.players[0].player.fullName,
                scorerTotal: play.players[0].seasonTotal,
                assistName1: assistName1,
                assistTotal1: assistTotal1,
                assistName2: assistName2,
                assistTotal2: assistTotal2,
                team: play.team.triCode,
                description: play.result.description,
                period: play.about.ordinalNum,
                time: play.about.periodTime,
                imageUrl: imageUrl
            };
            goals.push(goalObject);
        }

        if (play.result.event === "Penalty") {
            let imageUrl = undefined;
            if (data.gameData.teams.away.name === play.team.name) {
                imageUrl = imageUrlPrefixAway;
            } else {
                imageUrl = imageUrlPrefixHome;
            }

            let penalizedPlayer = "";
            let penalizedPlayerId = undefined;

            if (play.players) {
                play.players.forEach((player) => {
                    if (player.playerType === "PenaltyOn") {
                        penalizedPlayer = player.player.fullName;
                        penalizedPlayerId = player.player.id;
                    }
                });
            }

            let penaltyObject = {
                playerId: penalizedPlayerId,
                team: play.team.triCode,
                player: penalizedPlayer || "Bench",
                description: `${play.result.penaltySeverity} - ${play.result.secondaryType} - ${play.result.penaltyMinutes} minutes`,
                period: play.about.ordinalNum,
                time: play.about.periodTime,
                imageUrl: imageUrl
            };
            penalties.push(penaltyObject);
        }

        let imageUrl = undefined;
        if (play.team && play.team.name) {
            if (data.gameData.teams.away.name === play.team.name) {
                imageUrl = imageUrlPrefixAway;
            } else {
                imageUrl = imageUrlPrefixHome;
            }
        }

        if (play.result.event === "Stoppage") {
            plays.push({
                team: "N/A",
                event: play.result.event,
                description: `${play.result.event} - ${play.result.description}`,
                period: play.about.ordinalNum,
                time: play.about.periodTime,
                imageUrl: undefined,
                coordinates: "N/A"
            })
        } else {
            if (play.team && play.team.triCode && play.players && play.players[0]) {
                if (play.coordinates.x && play.coordinates.y) {
                    plays.push({
                        team: play.team.triCode,
                        fullTeam: play.team.name,
                        event: play.result.event,
                        description: play.result.description,
                        period: play.about.ordinalNum,
                        time: play.about.periodTime,
                        imageUrl: imageUrl,
                        coordinates: {
                            x: play.coordinates.x, y: play.coordinates.y
                        },
                        player: play.players[0].player.fullName
                    })
                } else {
                    plays.push({
                        team: play.team.triCode,
                        fullTeam: play.team.name,
                        event: play.result.event,
                        description: play.result.description,
                        period: play.about.ordinalNum,
                        time: play.about.periodTime,
                        imageUrl: imageUrl,
                        coordinates: "N/A"
                    })
                }
            } else {
                plays.push({
                    team: "N/A",
                    event: play.result.event,
                    description: play.result.description,
                    period: play.about.ordinalNum,
                    time: play.about.periodTime,
                    imageUrl: imageUrl,
                    coordinates: "N/A"
                })
            }
        }
    });

    let officials = [];
    data.liveData.boxscore.officials.forEach((official) => {
        officials.push({
            fullName: official.official.fullName, type: official.officialType
        });
    });

    let homePlayerIds = Object.keys(data.liveData.boxscore.teams.home.players);
    let awayPlayerIds = Object.keys(data.liveData.boxscore.teams.away.players);
    let homePlayers = [];
    let awayPlayers = [];
    homePlayerIds.forEach((id) => {
        if (data.liveData.boxscore.teams.home.players[id].stats.skaterStats) {
            homePlayers.push(data.liveData.boxscore.teams.home.players[id].person.fullName);
        }
    });

    awayPlayerIds.forEach((id) => {
        if (data.liveData.boxscore.teams.away.players[id].stats.skaterStats) {
            awayPlayers.push(data.liveData.boxscore.teams.away.players[id].person.fullName);
        }
    });

    let stars = undefined;
    if (data.liveData && data.liveData.decisions && data.liveData.decisions.firstStar && data.liveData.decisions.secondStar && data.liveData.decisions.thirdStar) {
        stars = {
            firstStar: {
                fullName: data.liveData.decisions.firstStar.fullName,
                imageUrl: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${data.liveData.decisions.firstStar.id}.jpg`
            }, secondStar: {
                fullName: data.liveData.decisions.secondStar.fullName,
                imageUrl: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${data.liveData.decisions.secondStar.id}.jpg`
            }, thirdStar: {
                fullName: data.liveData.decisions.thirdStar.fullName,
                imageUrl: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${data.liveData.decisions.thirdStar.id}.jpg`
            }
        };
    }

    let recap = undefined;
    try {
        recap = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${req.params.id}/content`);
    } catch (e) {
        console.log(e);
    }

    let recapObj = "";
    if (recap) {
        let mediaObj = recap.data.media.epg.filter(obj => {
            return obj.title === "Extended Highlights"
        });

        let videoUrl = undefined;
        if (mediaObj[0].items[0] && mediaObj[0].items[0].playbacks) {
            videoUrl = mediaObj[0].items[0].playbacks.filter(obj => {
                return obj.name === "FLASH_1800K_896x504"
            });
            videoUrl = videoUrl[0].url;
        }

        recapObj = {
            headline: function () {
                if (recap.data.editorial.recap.items[0].headline) {
                    return recap.data.editorial.recap.items[0].headline;
                } else {
                    return undefined;
                }
            }, video: videoUrl
        }
    }

    let object = {
        goals: goals,
        officials: officials,
        plays: plays,
        penalties: penalties,
        stars: stars,
        homeImageUrl: imageUrlPrefixHome,
        awayImageUrl: imageUrlPrefixAway,
        homeTeamName: data.gameData.teams.home.name,
        awayTeamName: data.gameData.teams.away.name,
        homePlayers: homePlayers,
        awayPlayers: awayPlayers,
        shootout: shootout,
        recap: recapObj
    }

    res.json(object);
});

module.exports = router;