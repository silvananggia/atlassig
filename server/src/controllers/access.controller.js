const db = require("../config/database");

const redis = require("ioredis");
const crypto = require("crypto");
const redisClient = redis.createClient();

const validLevelValues = ["Publik", "Cabang", "Kedeputian", "CalonFaskes"];
const validFaskesValues = ["fktp", "fkrtl"];
const validPotensiValues = ["0", "1"];

const userService = process.env.USER_SERVICE;
const userPassword = process.env.USER_PASSWORD;
const userKey = process.env.USER_KEY;

exports.getAccess = async (req, res) => {
  try {
    const { level } = req.query;

    // Retrieve headers
    const username = req.headers["username"];
    const password = req.headers["password"];
    const userKeyHeader = req.headers["userkey"];

    // Validate headers
    if (!userKeyHeader) {
      return res.status(500).json({
        code: 500,
        status: "error",
        data: "Authentication parameters are required headers.",
      });
    }

        // Validate headers
        if (!username || !password ) {
          return res.status(500).json({
            code: 500,
            status: "error",
            data: "Invalid headers parameters.",
          });
        }

    // Validate username, password, and user key against environment variables
    if (
      username !== userService ||
      password !== userPassword ||
      userKeyHeader !== userKey
    ) {
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Invalid username, password, or user key.",
      });
    }

    if (!validLevelValues.includes(level)) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: "Invalid value for level.",
      });
    }

    if (level === "CalonFaskes") {
      const { lat, lon, faskes, potensi } = req.query;

      if (!lat || !lon || !faskes || !potensi) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Valid parameters are required.",
        });
      }

      if (!validFaskesValues.includes(faskes)) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Invalid value for faskes.",
        });
      }
      // Validate lat and lon as numeric values
      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Invalid value for lat or lon. Numeric values are required.",
        });
      }

      // Validate lat and lon within valid ranges
      const validLatRange = [-90, 90];
      const validLonRange = [-180, 180];

      if (
        lat < validLatRange[0] ||
        lat > validLatRange[1] ||
        lon < validLonRange[0] ||
        lon > validLonRange[1]
      ) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Invalid value for lat or lon. Must be within valid ranges.",
        });
      }

      if (!validPotensiValues.includes(potensi)) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Invalid value for potensi.",
        });
      }


      const token = crypto.randomBytes(32).toString("hex");
      const key = `embed:${token}`;

      redisClient.hmset(key, { level, faskes, lat, lon , potensi});

      redisClient.expire(key, 30 * 60); // Expire in 30 minutes

      //req.session.user = username;

      res.json({
        code: 200,
        status: "success",
        data: {
          token: token,
        },
      });
    } else if (level === "Cabang") {
      const { kodeCabang, faskes } = req.query;

      if (!kodeCabang || !faskes) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Valid parameters are required.",
        });
      }

      if (!validFaskesValues.includes(faskes)) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Invalid value for faskes.",
        });
      }

      //cek kode cabang
      if (kodeCabang.length != 4) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Invalid value for kode cabang length.",
        });
      }

      const result = await db.query(
        `SELECT kodecab FROM cabang WHERE kodecab=$1;
        `,
        [kodeCabang]
      );

      if (result.rows && result.rows.length > 0) {
        const token = crypto.randomBytes(32).toString("hex");

        const key = `embed:${token}`;
        redisClient.hmset(key, { level, faskes, kodeCabang });

        redisClient.expire(key, 30 * 60); // Expire in 3 minutes
       // req.session.user = username;

        return res.json({
          code: 200,
          status: "success",
          data: {
            token: token,
          },
        });
      }

      return res.status(400).json({
        code: 400,
        status: "error",
        data: "Invalid value for kode cabang",
      });
    } else if (level === "Kedeputian") {
      const { kodeKedeputian, faskes } = req.query;

      if (!kodeKedeputian || !faskes) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Valid parameters are required.",
        });
      }

      if (!validFaskesValues.includes(faskes)) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Invalid value for faskes",
        });
      }

      if (kodeKedeputian.length != 2) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Invalid value for kode kedeputian length.",
        });
      }

      const result = await db.query(
        `SELECT kodedep FROM cabang WHERE kodedep=$1
        `,
        [kodeKedeputian]
      );

      if (result.rows && result.rows.length > 0) {
        const token = crypto.randomBytes(32).toString("hex");

        const key = `embed:${token}`;
        redisClient.hmset(key, { level, faskes, kodeKedeputian });

        redisClient.expire(key, 30 * 60); // Expire in 3 minutes
        //req.session.user = username;

        res.json({
          code: 200,
          status: "success",
          data: {
            token: token,
          },
        });
      } else {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Invalid value for kode kedeputian.",
        });
      }
    } else if (level === "Publik") {
      const { faskes } = req.query;

      if (!faskes) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Valid parameters are required.",
        });
      }

      if (!validFaskesValues.includes(faskes)) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Invalid value for faskes",
        });
      }

      const token = crypto.randomBytes(32).toString("hex");

      const key = `embed:${token}`;
      redisClient.hmset(key, { level, faskes });

      redisClient.expire(key, 30 * 60); // Expire in 3 minutes
      //req.session.user = username;

      res.json({
        code: 200,
        status: "success",
        data: {
          token: token,
        },
      });
    } else {
      res.status(400).json({
        code: 400,
        status: "error",
        data: "Invalid access level",
      });
    }
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({
      code: 500,
      status: "error",
      data: "Internal Server Error",
    });
  }
};
exports.getEmbed = async (req, res) => {
  try {
    const token = req.params.token;

    if (!token) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: "Token is required.",
      });
    }


/*     if (!req.session.user) {
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized",
      });
    } */
  

    redisClient.hgetall(`embed:${token}`, (err, data) => {
      if (err) {
        console.error("Error retrieving data from Redis:", err);
        res.status(400).json({
          code: 400,
          status: "error",
          data: "Invalid Token",
        });
      } else if (!data || Object.keys(data).length === 0) {
        res.json({
          code: 404,
          status: "error",
          data: "Data not found for the given token.",
        });
      } else {
        req.session.user = token;
        res.json({
          code: 200,
          status: "success",
          data: data,
        });
      }
    });
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({
      code: 500,
      status: "error",
      data: "Internal Server Error",
    });
  }
};