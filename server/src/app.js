const express = require("express");
//const compression = require('compression')
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
var bodyParser = require("body-parser");
const Redis = require("ioredis");
const connectRedis = require("connect-redis").default;
const { Pool } = require("pg");

const app = express();
//app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.set("trust proxy", 1);

const IN_PROD = process.env.NODE_ENV === "production";
const EXPIRED = 30 * 60;
const REDIS_PORT = process.env.REDIS_PORT;

// Redis setup
const redisClient = new Redis({
  host: "localhost",
  port: REDIS_PORT,
});

// Use connectRedis as a function
const RedisStore = new connectRedis({
  client: redisClient,
  // Additional options if needed
});

// Session middleware with Redis
app.use(
  session({
    name: process.env.SESS_NAME,
    store: RedisStore,
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: EXPIRED,
      sameSite: true,
      secure: IN_PROD,
    },
  })
);

//Route
const index = require("./routes/index");
const fktpRoute = require("./routes/fktp.routes");
const fkrtlRoute = require("./routes/fkrtl.routes");
const filterRoute = require("./routes/filter.routes");
const authRoute = require("./routes/auth.routes");
const accessRoute = require("./routes/access.routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: "application/vnd.api+json" }));
app.use(cors());

app.use(index);
app.use("/api/", fktpRoute);
app.use("/api/", fkrtlRoute);
app.use("/api/", filterRoute);
app.use("/api/", authRoute);
app.use("/api/", accessRoute);

module.exports = app;
