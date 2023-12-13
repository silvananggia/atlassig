const redis = require("ioredis");
const crypto = require("crypto");
const redisClient = redis.createClient();

exports.getAccess = async (req, res) => {
  try {
    const { level } = req.query;

    if (level === "CalonFaskes") {
      const { lat, lon, faskes } = req.query;

      if (!lat || !lon || !faskes) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Valid parameters are required.",
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
    } else if (level === "Cabang"){
      const { kodeCabang, faskes } = req.query;

      if (!kodeCabang || !faskes) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Valid parameters are required.",
        });
      }

      const token = crypto.randomBytes(32).toString("hex");

      const key = `embed:${token}`;
      redisClient.hmset(key, { level, faskes, kodeCabang });

      redisClient.expire(key, 30 * 60); // Expire in 30 minutes

      res.json({
        code: 200,
        status: "success",
        data: {
          token: token,
        },
      });
    } else if(level === "Kedeputian"){
      const { kodeKedeputian, faskes } = req.query;

      if (!kodeKedeputian || !faskes) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Valid parameters are required.",
        });
      }

      const token = crypto.randomBytes(32).toString("hex");

      const key = `embed:${token}`;
      redisClient.hmset(key, { level,faskes, kodeKedeputian });

      redisClient.expire(key, 30 * 60); // Expire in 30 minutes

      res.json({
        code: 200,
        status: "success",
        data: {
          token: token,
        },
      });
    } else if(level === "Publik"){
      const { faskes } = req.query;

      if (!faskes) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Valid parameters are required.",
        });
      }

      const token = crypto.randomBytes(32).toString("hex");

      const key = `embed:${token}`;
      redisClient.hmset(key, {  level,faskes });

      redisClient.expire(key, 30 * 60); // Expire in 30 minutes

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
