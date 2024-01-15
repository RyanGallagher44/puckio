const express = require('express');
const router = express.Router();
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const uri = process.env.MONGODB_URI || "mongodb+srv://rgallag1:ZOjkFrMhe1XxU2eG@puckio.oqpfmsb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1
});
const {compare} = require('bcrypt');
const bcrypt = require('bcrypt');
const saltRounds = 16;
const nodemailer = require('nodemailer');
const axios = require('axios');

router.post('/register', async (req, res) => {
    let {firstName, lastName, email, password, favoriteTeam} = req.body;

    const collection = client.db("puckio").collection("users");
    const checkIfUserExists = await collection.findOne({email: email});
    if (checkIfUserExists !== null) return res.json({error: "An account with this email already exists"});

    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'fatchimpgaming44@gmail.com',
    //         pass: 'kmmvhmxqghuggfwp'
    //     }
    // });

    // const mailOptions = {
    //     from: 'puck.io',
    //     to: email,
    //     subject: 'Welcome to puck.io!',
    //     text: `Hi ${firstName},\n\nThis is confirmation that you have created an account with puck.io.\n\nThank you for joining us!`
    // }

    // transporter.sendMail(mailOptions,
    // function(error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let nameSplit = favoriteTeam.split(" ");
    let imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
    nameSplit.forEach((word, index) => {
        if (index === nameSplit.length - 1) {
            imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
        } else {
            imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
        }
    });

    let user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        favoriteTeam: favoriteTeam,
        favoriteTeamImageUrl: imageUrlPrefix,
        predictions: [],
        level: 1,
        nextLevel: 50,
        currentPoints: 0,
        totalPoints: 0
    };

    collection.insertOne(user);

    res.json({user: user, auth: true});
});

router.post('/login', async (req, res) => {
    let {email, password} = req.body;

    const collection = client.db("puckio").collection("users");

    const user = await collection.findOne({email: email});
    if (user === null) return res.json({error: "Either the email or password is invalid"});

    const hashedPassword = await collection.findOne({email: email});

    const hashedPassword2 = hashedPassword.password;

    let compareToMatch = false;

    try {
        compareToMatch = await bcrypt.compare(password, hashedPassword2);
    } catch (e) {
    }

    if (!compareToMatch) return res.json({error: "Either the email or password is invalid"});

    user._id = user._id.toString();

    req.session.user = user;
    req.session.save();

    res.json({user: user, auth: true});
});

router.get('/profile', async (req, res) => {
    if (req.session.user) {
        const collection = client.db("puckio").collection("users");
        const user = await collection.findOne({_id: new ObjectId(req.session.user._id)});

        return res.json({user: user});
    } else {
        return res.json({error: "You are not logged in!"});
    }
});

router.get('/logout', async (req, res) => {
    if (req.session.user) {
        req.session.destroy();
        return res.json({loggedOut: true});
    } else {
        return res.json({error: "You are not logged in!"});
    }
});

router.post('/predictions/calculate', async (req, res) => {
    const collection = client.db("puckio").collection("users");
    const user = await collection.findOne({_id: new ObjectId(req.session.user._id)});

    let userPredictions = user.predictions;

    let status = "";
    let points = 0;
    for (let i = 0; i < userPredictions.length; i++) {
        const {data} = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${userPredictions[i].gameId}/linescore`);
        if (data.currentPeriodTimeRemaining === "Final") {
            if (!userPredictions[i].redeemed) {
                let pointsEarnedForGame = 0;
                if (data.teams.away.goals < data.teams.home.goals && parseInt(userPredictions[i].awayScore) < parseInt(userPredictions[i].homeScore)) {
                    points += 5;
                    pointsEarnedForGame += 5;
                }
                if (data.teams.away.goals > data.teams.home.goals && parseInt(userPredictions[i].awayScore) > parseInt(userPredictions[i].homeScore)) {
                    points += 5;
                    pointsEarnedForGame += 5;
                }
                if (userPredictions[i].awayScore == data.teams.away.goals) {
                    points += 5;
                    pointsEarnedForGame += 5;
                }
                if (userPredictions[i].homeScore == data.teams.home.goals) {
                    points += 5;
                    pointsEarnedForGame += 5;
                }
                if (userPredictions[i].awayScore == data.teams.away.goals && userPredictions[i].homeScore == data.teams.home.goals) {
                    points += 10;
                    pointsEarnedForGame += 10;
                }
                userPredictions[i].redeemed = true;
                userPredictions[i].actualHomeScore = data.teams.home.goals;
                userPredictions[i].actualAwayScore = data.teams.away.goals;
                userPredictions[i].pointsEarned = pointsEarnedForGame;
            }
        }
    }
    if (points > 0) {
        let originalPoints = points;
        await collection.updateOne({_id: new ObjectId(req.session.user._id)}, {$inc: {totalPoints: points}})
        let currentState = await collection.findOne({_id: new ObjectId(req.session.user._id)});
        let numLevels = 0;
        if (currentState.nextLevel > points + currentState.currentPoints) {
            await collection.updateOne({_id: new ObjectId(req.session.user._id)}, {$inc: {currentPoints: points}});
        } else {
            let nextLevelPoints = currentState.nextLevel - currentState.currentPoints;
            while (points >= nextLevelPoints) {
                points -= nextLevelPoints;
                await collection.updateOne({_id: new ObjectId(req.session.user._id)}, {$inc: {level: 1}});
                numLevels++;
                currentState = await collection.findOne({_id: new ObjectId(req.session.user._id)});
                await collection.updateOne({_id: new ObjectId(req.session.user._id)}, {$set: {nextLevel: currentState.nextLevel + 50}});
                nextLevelPoints = (await collection.findOne({_id: new ObjectId(req.session.user._id)})).nextLevel;
            }
            await collection.updateOne({_id: new ObjectId(req.session.user._id)}, {$set: {currentPoints: points}});
        }
        status = `Your predictions have earned you ${originalPoints} points and you leveled up ${numLevels} times!`
    }
    await collection.updateOne({_id: new ObjectId(req.session.user._id)}, {$set: {predictions: userPredictions}});

    if (status.length > 0) {
        res.json({success: status});
    } else {
        res.json({success: 'All of your predictions have already been redeemed!'})
    }
});

router.post('/predict/:gameId', async (req, res) => {
    const gameId = req.params.gameId;

    const prediction = {
        gameId: gameId,
        awayName: req.body.awayName,
        homeName: req.body.homeName,
        awayTriCode: req.body.awayTriCode,
        homeTriCode: req.body.homeTriCode,
        awayImage: req.body.awayImage,
        homeImage: req.body.homeImage,
        awayScore: req.body.awayScore,
        homeScore: req.body.homeScore,
        redeemed: false,
        actualHomeScore: 0,
        actualAwayScore: 0,
        pointsEarned: 0,
        gameDate: req.body.gameDate
    };

    const collection = client.db("puckio").collection("users");
    const user = await collection.updateOne({_id: new ObjectId(req.session.user._id)}, {$push: {predictions: prediction}});

    res.json({submitted: true});
});

module.exports = router;