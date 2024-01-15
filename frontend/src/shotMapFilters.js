import {getTeamPrimaryColor} from "./helpers";

export const handleShotMapPeriodChangeHelper = (playData, shotMapPeriod, awayEvent, homeEvent, awayPlayer, homePlayer, awayName, homeName) => {
    let eventMapping = {
        "Shots": ["Shot"],
        "Goals": ["Goal"],
        "Penalties": ["Penalty"],
        "Hits": ["Hit"],
        "Blocks": ["Blocked Shot"],
        "All Shots": ["Shot", "Goal"],
        "Clear All Events": [],
        "All Events": ['Shot', 'Goal', 'Hit', 'Penalty', 'Blocked Shot']
    }
    let coordinates = [];
    playData.forEach((play) => {
        if (shotMapPeriod === "All Periods") {
            if (homePlayer === "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer === "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            }
        } else {
            if (homePlayer === "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer === "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            }
        }
    });

    return coordinates;
};

export const handleAwayPlayerChangeHelper = (playData, shotMapPeriod, awayEvent, homeEvent, awayPlayer, homePlayer, awayName, homeName) => {
    let eventMapping = {
        "Shots": ["Shot"],
        "Goals": ["Goal"],
        "Penalties": ["Penalty"],
        "Hits": ["Hit"],
        "Blocks": ["Blocked Shot"],
        "All Shots": ["Shot", "Goal"],
        "Clear All Events": [],
        "All Events": ['Shot', 'Goal', 'Hit', 'Penalty', 'Blocked Shot']
    }
    let coordinates = [];
    playData.forEach((play) => {
        if (shotMapPeriod === "All Periods") {
            if (homePlayer === "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer === "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            }
        } else {
            if (homePlayer === "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer === "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            }
        }
    });

    return coordinates;
};

export const handleHomePlayerChangeHelper = (playData, shotMapPeriod, awayEvent, homeEvent, awayPlayer, homePlayer, awayName, homeName) => {
    let eventMapping = {
        "Shots": ["Shot"],
        "Goals": ["Goal"],
        "Penalties": ["Penalty"],
        "Hits": ["Hit"],
        "Blocks": ["Blocked Shot"],
        "All Shots": ["Shot", "Goal"],
        "Clear All Events": [],
        "All Events": ['Shot', 'Goal', 'Hit', 'Penalty', 'Blocked Shot']
    }
    let coordinates = [];
    playData.forEach((play) => {
        if (shotMapPeriod === "All Periods") {
            if (homePlayer === "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer === "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            }
        } else {
            if (homePlayer === "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer === "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            }
        }
    });

    return coordinates;
};

export const handleAwayEventChangeHelper = (playData, shotMapPeriod, awayEvent, homeEvent, awayPlayer, homePlayer, awayName, homeName) => {
    let eventMapping = {
        "Shots": ["Shot"],
        "Goals": ["Goal"],
        "Penalties": ["Penalty"],
        "Hits": ["Hit"],
        "Blocks": ["Blocked Shot"],
        "All Shots": ["Shot", "Goal"],
        "Clear All Events": [],
        "All Events": ['Shot', 'Goal', 'Hit', 'Penalty', 'Blocked Shot']
    }
    let coordinates = [];
    playData.forEach((play) => {
        if (shotMapPeriod === "All Periods") {
            if (homePlayer === "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer === "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            }
        } else {
            if (homePlayer === "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer === "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            }
        }
    });

    return coordinates;
};

export const handleHomeEventChangeHelper = (playData, shotMapPeriod, awayEvent, homeEvent, awayPlayer, homePlayer, awayName, homeName) => {
    let eventMapping = {
        "Shots": ["Shot"],
        "Goals": ["Goal"],
        "Penalties": ["Penalty"],
        "Hits": ["Hit"],
        "Blocks": ["Blocked Shot"],
        "All Shots": ["Shot", "Goal"],
        "Clear All Events": [],
        "All Events": ['Shot', 'Goal', 'Hit', 'Penalty', 'Blocked Shot']
    }
    let coordinates = [];
    playData.forEach((play) => {
        if (shotMapPeriod === "All Periods") {
            if (homePlayer === "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer === "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            }
        } else {
            if (homePlayer === "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer === "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer === "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            } else if (homePlayer !== "All Players" && awayPlayer !== "All Players") {
                if (play.coordinates !== "N/A" && eventMapping[homeEvent].includes(play.event) && play.fullTeam === homeName && play.player === homePlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
                if (play.coordinates !== "N/A" && eventMapping[awayEvent].includes(play.event) && play.fullTeam === awayName && play.player === awayPlayer && play.period === shotMapPeriod) {
                    coordinates.push({
                        x: play.coordinates.x,
                        y: play.coordinates.y,
                        color: getTeamPrimaryColor(play.fullTeam),
                        description: play.description
                    })
                }
            }
        }
    });

    return coordinates;
};