const db = require("../config/database");

const redis = require("ioredis");
const crypto = require("crypto");
const redisClient = redis.createClient();

const validLevelValues = ["Publik", "Cabang", "Kedeputian", "CalonFaskes"];
const validFaskesValues = ["fktp", "fkrtl"];

exports.getAccess = async (req, res) => {
  try {
    const { level } = req.query;

    if (!validLevelValues.includes(level)) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: "Invalid value for level.",
      });
    }

    if (level === "CalonFaskes") {
      const { lat, lon, faskes } = req.query;

      if (!lat || !lon || !faskes) {
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

  if (lat < validLatRange[0] || lat > validLatRange[1] || lon < validLonRange[0] || lon > validLonRange[1]) {
    return res.status(400).json({
      code: 400,
      status: "error",
      data: "Invalid value for lat or lon. Must be within valid ranges.",
    });
  }
      const token = crypto.randomBytes(32).toString("hex");
      const key = `embed:${token}`;

      redisClient.hmset(key, { level, faskes, lat, lon });

      redisClient.expire(key, 30 * 60); // Expire in 30 minutes

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
        data: "Token are required.",
      });
    }

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
