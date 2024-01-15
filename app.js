const express = require('express');
const app = express();
const configRoutes = require('./routes');
const cors = require('cors');
const path = require('path');
const {createClient} = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis').default;

let redisClient = createClient();
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
    client: redisClient
})

app.use(express.static(path.resolve(__dirname, './frontend/build')));
app.use(cors({
    credentials: true, origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    name: 'AuthCookie', secret: 'i am just funny guy, you know', resave: false, saveUninitialized: false, cookie: {
        httpOnly: false, secure: false
    }
}));

configRoutes(app);

let port = process.env.PORT;

if (!process.env.PORT) {
    port = 3030;
}

app.listen(port, async () => {
    console.log(`Your routes will be running on http://localhost:${port}`);
});