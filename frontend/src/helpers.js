import {DateTime} from 'luxon';
import indicator from 'ordinal/indicator';

export const teams = {
    AnaheimDucks: 'Anaheim Ducks',
    ArizonaCoyotes: 'Arizona Coyotes',
    BostonBruins: 'Boston Bruins',
    BuffaloSabres: 'Buffalo Sabres',
    CalgaryFlames: 'Calgary Flames',
    CarolinaHurricanes: 'Carolina Hurricanes',
    ChicagoBlackhawks: 'Chicago Blackhawks',
    ColoradoAvalanche: 'Colorado Avalanche',
    ColumbusBlueJackets: 'Columbus Blue Jackets',
    DallasStars: 'Dallas Stars',
    DetroitRedWings: 'Detroit Red Wings',
    EdmontonOilers: 'Edmonton Oilers',
    FloridaPanthers: 'Florida Panthers',
    LosAngelesKings: 'Los Angeles Kings',
    MinnesotaWild: 'Minnesota Wild',
    MontrealCanadiens: 'Montréal Canadiens',
    NashvillePredators: 'Nashville Predators',
    NewJerseyDevils: 'New Jersey Devils',
    NewYorkIslanders: 'New York Islanders',
    NewYorkRangers: 'New York Rangers',
    OttawaSenators: 'Ottawa Senators',
    PhiladelphiaFlyers: 'Philadelphia Flyers',
    PittsburghPenguins: 'Pittsburgh Penguins',
    SanJoseSharks: 'San Jose Sharks',
    SeattleKraken: 'Seattle Kraken',
    StLouisBlues: 'St. Louis Blues',
    TampaBayLightning: 'Tampa Bay Lightning',
    TorontoMapleLeafs: 'Toronto Maple Leafs',
    VancouverCanucks: 'Vancouver Canucks',
    VegasGoldenKnights: 'Vegas Golden Knights',
    WashingtonCapitals: 'Washington Capitals',
    WinnipegJets: 'Winnipeg Jets'
};

export const getAvailableYears = () => {
    let years = [];
    for (let i = 1917; i < 2024; i++) {
        years.push(`${i}-${i + 1}`);
    }
    return years.reverse();
}

export const getTeamPrimaryColor = (teamName) => {
    let primaries = {
        'Anaheim Ducks': '#FA5601',
        'Arizona Coyotes': '#8D2633',
        'Boston Bruins': '#FBB514',
        'Buffalo Sabres': '#012554',
        'Calgary Flames': '#B62C35',
        'Carolina Hurricanes': '#B62C35',
        'Chicago Blackhawks': '#CF0A2D',
        'Colorado Avalanche': '#6E263D',
        'Columbus Blue Jackets': '#012554',
        'Dallas Stars': '#006847',
        'Detroit Red Wings': '#CE1026',
        'Edmonton Oilers': '#FF4B01',
        'Florida Panthers': '#051D43',
        'Los Angeles Kings': '#111111',
        'Minnesota Wild': '#014F31',
        'Montréal Canadiens': '#C51330',
        'Nashville Predators': '#FEB81E',
        'New Jersey Devils': '#CE1026',
        'New York Islanders': '#00529B',
        'New York Rangers': '#0338A8',
        'Ottawa Senators': '#E21A37',
        'Philadelphia Flyers': '#F64A03',
        'Pittsburgh Penguins': '#FBB514',
        'St. Louis Blues': '#032E87',
        'San Jose Sharks': '#016C74',
        'Seattle Kraken': '#9AD8D9',
        'Tampa Bay Lightning': '#002868',
        'Toronto Maple Leafs': '#013E7F',
        'Vancouver Canucks': '#001F5C',
        'Vegas Golden Knights': '#B39759',
        'Washington Capitals': '#061D42',
        'Winnipeg Jets': '#061D42'
    }

    return primaries[teamName];
};

export const getDayByDateString = (date) => {
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return days[new Date(date).getDay()];
};

export const checkGoalsInPeriod = (goals, period) => {
    let count = 0;
    if (period === 1) {
        goals.forEach((goal) => {
            if (goal.period === '1st') {
                count++;
            }
        });
    }

    if (period === 2) {
        goals.forEach((goal) => {
            if (goal.period === '2nd') {
                count++;
            }
        });
    }

    if (period === 3) {
        goals.forEach((goal) => {
            if (goal.period === '3rd') {
                count++;
            }
        });
    }

    if (period === 4) {
        goals.forEach((goal) => {
            if (goal.period === 'OT') {
                count++;
            }
        });
    }

    if (period === 5) {
        goals.forEach((goal) => {
            if (goal.period === 'SO') {
                count++;
            }
        });
    }

    return (count > 0);
};

export const getOrdinalNum = (num) => {
    let ordinals = ['st', 'nd', 'rd', 'OT', 'SO'];

    if (num !== 4 && num !== 5) {
        return `${num}${ordinals[num - 1]}`;
    } else {
        return `${ordinals[num - 1]}`;
    }
};

export const buildCurrentDateString = (date) => {
    let dateArr = date.split("-");

    let months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']

    return `${months[parseInt(dateArr[1]) - 1]} ${parseInt(dateArr[2])}${indicator(dateArr[2])}, ${dateArr[0]}`;
};

export const getYesterday = (date) => {
    let yesterday = DateTime.fromISO(date);
    yesterday = (function (d) {
        d.setDate(d.getDate() - 1);
        return d
    })(yesterday.toJSDate());

    let dateString = undefined;
    let day = undefined;
    let month = undefined;
    if (yesterday.getDate() < 10) {
        day = `0${yesterday.getDate()}`;
    } else {
        day = `${yesterday.getDate()}`;
    }

    if (yesterday.getMonth() + 1 < 10) {
        month = `0${yesterday.getMonth() + 1}`;
    } else {
        month = `${yesterday.getMonth() + 1}`;
    }

    dateString = `${yesterday.getFullYear()}-${month}-${day}`;

    return dateString;
};

export const getTomorrow = (date) => {
    let tomorrow = DateTime.fromISO(date);
    tomorrow = (function (d) {
        d.setDate(d.getDate() + 1);
        return d
    })(tomorrow.toJSDate());

    let dateString = undefined;
    let day = undefined;
    let month = undefined;
    if (tomorrow.getDate() < 10) {
        day = `0${tomorrow.getDate()}`;
    } else {
        day = `${tomorrow.getDate()}`;
    }

    if (tomorrow.getMonth() + 1 < 10) {
        month = `0${tomorrow.getMonth() + 1}`;
    } else {
        month = `${tomorrow.getMonth() + 1}`;
    }

    dateString = `${tomorrow.getFullYear()}-${month}-${day}`;

    return dateString;
};