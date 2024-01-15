const leagueRoutes = require('./league');
const teamRoutes = require('./team');
const gameRoutes = require('./game');
const playerRoutes = require('./player');
const userRoutes = require('./user');
const quizRoutes = require('./quiz');

const constructorMethod = (app) => {
    app.use('/league', leagueRoutes);
    app.use('/team', teamRoutes);
    app.use('/game', gameRoutes);
    app.use('/player', playerRoutes);
    app.use('/user', userRoutes);
    app.use('/quiz', quizRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({error: 'This endpoint does not exist!'});
    });
};

module.exports = constructorMethod;