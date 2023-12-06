const express = require('express');
const cors = require('cors');
const session = require('express-session');
var bodyParser = require('body-parser');
const Redis = require('ioredis');
const connectRedis = require("connect-redis").default;
const { Pool } = require('pg');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set('trust proxy', 1);
/* 
// Redis setup
const redisClient = new Redis({
    host: 'localhost',
    port: 6379,
  });
  
 // Use connectRedis as a function
const RedisStore = new connectRedis({
    client: redisClient,
    // Additional options if needed
  }); */
  /* 
  // Session middleware with Redis
  app.use(
    session({
      store: RedisStore,
      secret: '8f09cd6345567ed1f5a5e5a7949e56099e6c1c295336445787927f93344d300a',
      resave: false,
      saveUninitialized: false,
    })
  );
 */
  

// ==> Rotas da API:
const index = require('./routes/index');
const fktpRoute = require('./routes/fktp.routes');
const fkrtlRoute = require('./routes/fkrtl.routes');
const authRoute = require('./routes/auth.routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(cors());

app.use(index);
app.use('/api/', fktpRoute);
app.use('/api/', fkrtlRoute);
app.use('/api/', authRoute);

module.exports = app;