const db = require("../config/database");
const bcrypt = require("bcrypt");
const redis = require("ioredis");
const crypto = require("crypto");
const { promisify } = require("util");
const redisClient = redis.createClient();
const hsetAsync = promisify(redisClient.hset).bind(redisClient);
const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);


const userKey = process.env.USER_KEY;
exports.listAllFkrtl = async (req, res) => {
  try {
    const lat = req.params.lat;
    const lon = req.params.lon;

    // Retrieve headers

    const userKeyHeader = req.headers["userkey"];
    // Validate headers
    if (!userKeyHeader) {
      return res.status(500).json({
        code: 500,
        status: "error",
        data: "Authentication parameters are required headers.",
      });
    }

    if (userKeyHeader !== userKey) {
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized",
      });
    }

    if (!lat || !lon) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: "Latitude and longitude are required parameters.",
      });
    }

    // Validate the token
    const token = req.headers["token"];
    if (!token) {
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized - Token missing",
      });
    }

    const hashedToken = await bcrypt.hash(token, 10);

    // Check if the token exists in Redis
    const userData = await hgetallAsync(`token:${token}`);

    if (userData) {
      const result = await db.query(
        `
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(feature)
      )
      FROM (
        SELECT jsonb_build_object(
          'type', 'Feature',
          'id', id,
          'geometry', ST_AsGeoJSON(coord)::jsonb
        ) AS feature
        FROM (
          SELECT fkrtl.fkrtlid AS id, ST_Transform(ST_SetSRID(coordinat, 4326), 3857) AS coord
          FROM fkrtl
          WHERE st_dwithin(
            coordinat::geography::geometry,
            ST_SetSRID(ST_MakePoint($1,$2), 4326),
            0.09
          )
          AND fkrtl.status='aktif'
        ) row
      ) features;
    `,
        [lon, lat]
      );

      res.json({
        code: 200,
        status: "success",
        data: result.rows[0].jsonb_build_object,
      });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({
      code: 500,
      status: "error",
      data: "Internal Server Error",
    });
  }
};

exports.listCabangFKRTL = async (req, res) => {
  try {
    const id = req.params.id;

    // Retrieve headers

    const userKeyHeader = req.headers["userkey"];
    // Validate headers
    if (!userKeyHeader) {
      return res.status(500).json({
        code: 500,
        status: "error",
        data: "Authentication parameters are required headers.",
      });
    }

    if (userKeyHeader !== userKey) {
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: "Code are required parameters.",
      });
    }

    // Validate the token
    const token = req.headers["token"];
    if (!token) {
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized - Token missing",
      });
    }

    const hashedToken = await bcrypt.hash(token, 10);

    // Check if the token exists in Redis
    const userData = await hgetallAsync(`token:${token}`);

    if (userData) {
      const result = await db.query(
        `
    SELECT jsonb_build_object(
      'type',     'FeatureCollection',
      'features', jsonb_agg(feature)
    )
    FROM (
    SELECT jsonb_build_object(
      'type',       'Feature',
      'id',         id,
      'geometry',   ST_AsGeoJSON(coord)::jsonb
    ) AS feature
    FROM (SELECT fkrtl.fkrtlid AS id, ST_Transform(ST_SetSRID(coordinat, 4326), 3857) AS coord
      FROM fkrtl
      JOIN kabupaten ON kabupaten.kbid=fkrtl.kab_id
      JOIN cabang ON kabupaten.kodekc=cabang.kodecab
      WHERE cabang.kodecab=$1 AND fkrtl.status='aktif') row
    ) features;
    `,
        [id]
      );

      res.json({
        code: 200,
        status: "success",
        data: result.rows[0].jsonb_build_object,
      });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({
      code: 500,
      status: "error",
      data: "Internal Server Error",
    });
  }
};

exports.listKedeputianFKRTL = async (req, res) => {
  try {
    const id = req.params.id;

    // Retrieve headers

    const userKeyHeader = req.headers["userkey"];
    // Validate headers
    if (!userKeyHeader) {
      return res.status(500).json({
        code: 500,
        status: "error",
        data: "Authentication parameters are required headers.",
      });
    }

    if (userKeyHeader !== userKey) {
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: "Code are required parameters.",
      });
    }
    // Validate the token
    const token = req.headers["token"];
    if (!token) {
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized - Token missing",
      });
    }

    const hashedToken = await bcrypt.hash(token, 10);

    // Check if the token exists in Redis
    const userData = await hgetallAsync(`token:${token}`);

    if (userData) {
      const result = await db.query(
        `
    SELECT jsonb_build_object(
      'type',     'FeatureCollection',
      'features', jsonb_agg(feature)
    )
    FROM (
    SELECT jsonb_build_object(
      'type',       'Feature',
      'id',         id,
      'geometry',   ST_AsGeoJSON(coord)::jsonb
    ) AS feature
    FROM (SELECT fkrtl.fkrtlid AS id, ST_Transform(ST_SetSRID(coordinat, 4326), 3857) AS coord
      FROM fkrtl
      JOIN kabupaten ON kabupaten.kbid=fkrtl.kab_id
      JOIN cabang ON kabupaten.kodekc=cabang.kodecab
      WHERE cabang.kodedep=$1 AND fkrtl.status='aktif') row
    ) features;
    `,
        [id]
      );

      res.json({
        code: 200,
        status: "success",
        data: result.rows[0].jsonb_build_object,
      });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({
      code: 500,
      status: "error",
      data: "Internal Server Error",
    });
  }
};

exports.detailFKRTL = async (req, res) => {
  try {
    const id = req.params.id;

    // Retrieve headers

    const userKeyHeader = req.headers["userkey"];
    // Validate headers
    if (!userKeyHeader) {
      return res.status(500).json({
        code: 500,
        status: "error",
        data: "Authentication parameters are required headers.",
      });
    }

    if (userKeyHeader !== userKey) {
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: "Parameters required.",
      });
    }

    // Validate the token
    const token = req.headers["token"];
    if (!token) {
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized - Token missing",
      });
    }

    const hashedToken = await bcrypt.hash(token, 10);

    // Check if the token exists in Redis
    const userData = await hgetallAsync(`token:${token}`);

    if (userData) {
      const result = await db.query(
        `
    SELECT fkrtl.fkrtlid AS id, ST_X(ST_SetSRID(coordinat, 4326)) AS lon, ST_Y(ST_SetSRID(coordinat, 4326)) AS lat, faskes2id AS faskesid,kwppk,kcppk,pelayanancanggih, alamatppk, nmppk, kelasrs
    FROM fkrtl
    WHERE fkrtl.fkrtlid=$1 AND fkrtl.status='aktif'
    `,
        [id]
      );

      res.json({
        code: 200,
        status: "success",
        data: result.rows,
      });
    }
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({
      code: 500,
      status: "error",
      data: "Internal Server Error",
    });
  }
};
