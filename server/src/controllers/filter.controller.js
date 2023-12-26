const db = require("../config/database");
const bcrypt = require("bcrypt");
const redis = require("ioredis");
const crypto = require("crypto");
const { promisify } = require("util");
const redisClient = redis.createClient();
const hsetAsync = promisify(redisClient.hset).bind(redisClient);
const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);

const userKey = process.env.USER_KEY;
exports.getCabang = async (req, res) => {
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
        `SELECT * FROM cabang WHERE LOWER(namacabang) LIKE LOWER('%' || $1 || '%') limit 10;
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

exports.getCabangDep = async (req, res) => {
  try {
    const id = req.params.id;
    const kddep = req.params.kddep;

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
        `SELECT * FROM cabang WHERE kodedep=$1;
      `,
        [kddep]
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

exports.getKodeDep = async (req, res) => {
  try {
    const id = req.params.kdkc;

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
        `SELECT kodedep FROM cabang WHERE kodecab=$1
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

exports.bboxKabupaten = async (req, res) => {
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
		'geometry',   ST_AsGeoJSON(bbox)::jsonb
	) AS feature
	FROM (SELECT kbid AS id, ST_Transform(ST_Envelope(mpoly::geometry), 3857) AS bbox FROM kabupaten WHERE kbid=$1) row
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

exports.bboxCabang = async (req, res) => {
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
            'geometry',   ST_AsGeoJSON(bbox)::jsonb
        ) AS feature
        FROM (SELECT ST_Transform(ST_Envelope(ST_Union(mpoly::geometry)), 3857) AS bbox FROM kabupaten 
                JOIN cabang ON kabupaten.kodekc=cabang.kodecab
                WHERE cabang.kodecab=$1) row
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

exports.bboxKedeputian = async (req, res) => {
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
          'geometry',   ST_AsGeoJSON(bbox)::jsonb
      ) AS feature
      FROM (SELECT ST_Transform(ST_Envelope(ST_Union(mpoly::geometry)), 3857) AS bbox FROM kabupaten 
              JOIN cabang ON kabupaten.kodekc=cabang.kodecab
              WHERE cabang.kodedep=$1) row
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

exports.centerCabang = async (req, res) => {
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
            'geometry',   ST_AsGeoJSON(bbox)::jsonb
        ) AS feature
        FROM (SELECT ST_Transform(ST_Centroid(ST_Union(mpoly::geometry)), 3857) AS bbox FROM kabupaten 
                JOIN cabang ON kabupaten.kodekc=cabang.kodecab
                WHERE cabang.kodecab=$1) row
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

exports.centerKedeputian = async (req, res) => {
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
          'geometry',   ST_AsGeoJSON(bbox)::jsonb
        ) AS feature
        FROM (SELECT cabang.kodedep AS deputi, ST_Transform(ST_Centroid(ST_Union(mpoly::geometry)), 3857) AS bbox FROM kabupaten 
                JOIN cabang ON kabupaten.kodekc=cabang.kodecab
                WHERE cabang.kodedep=$1
                GROUP BY cabang.kodedep) row
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

exports.autowilayah = async (req, res) => {
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
        `SELECT kecamatan.kcid::integer AS kec_id, kecamatan.kecamatan AS kec, kabupaten.kbid::integer AS kab_id, provinsi.prid::integer AS prov_id, kabupaten.kabupaten AS kab, provinsi.provinsi AS prov, UPPER(CONCAT (kecamatan.kecamatan,', ', kabupaten.kabupaten,', ', provinsi.provinsi)) AS disp FROM kecamatan
      JOIN kabupaten ON kabupaten.kbid = kecamatan.kab_id
      JOIN provinsi ON provinsi.prid = kabupaten.prov_id
      WHERE lower(kecamatan.kecamatan) LIKE LOWER('%' || $1 || '%')
      UNION
      SELECT NULL::integer AS kec_id, NULL::char AS kec, kabupaten.kbid::integer AS kab_id, provinsi.prid::integer AS prov_id, kabupaten.kabupaten AS kab, provinsi.provinsi AS prov, UPPER(CONCAT (kabupaten.kabupaten,', ', provinsi.provinsi)) AS disp FROM kabupaten
            JOIN provinsi ON provinsi.prid = kabupaten.prov_id
            WHERE lower(kabupaten.kabupaten) LIKE LOWER('%' || $1 || '%')
      UNION
      SELECT NULL::integer AS kec_id, NULL::char AS kec, NULL::integer AS kab_id, provinsi.prid::integer AS prov_id, NULL::char AS kab, provinsi.provinsi AS prov, UPPER(provinsi.provinsi) AS disp FROM provinsi
            WHERE lower(provinsi.provinsi) LIKE LOWER('%' || $1 || '%')
      ORDER BY kec_id DESC, kab_id DESC LIMIT 7;
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

exports.wilayahadmin = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;

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

    /*       if (!pro || !kab || !kec) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Code are required parameters.",
        });
      } */
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
            'geometry',   ST_AsGeoJSON(coord)::jsonb,
            'properties', to_jsonb(row) - 'coord' - 'id'
            || jsonb_build_object('jenisfaskes', UPPER(row.jenisfaskes)) 
          ) AS feature
          FROM (SELECT Distinct fktp.fktpid AS id, ST_Transform(ST_SetSRID(coordinat, 4326), 3857) AS coord, fktp.jenisfaskes
              FROM fktp
              INNER JOIN wilayahadmindesa ON wilayahadmindesa.wid=fktp.wlid
              INNER JOIN kecamatan ON wilayahadmindesa.kec_id=kecamatan.kcid
              INNER JOIN kabupaten ON wilayahadmindesa.kab_id=kabupaten.kbid
              INNER JOIN provinsi ON wilayahadmindesa.prov_id=provinsi.prid
              WHERE fktp.status='aktif'
              AND ($1::integer IS NULL OR provinsi.prid=$1)
              AND ($2::integer IS NULL OR kabupaten.kbid=$2)
              AND ($3::integer IS NULL OR kecamatan.kcid=$3)) row
        ) features;
        
        `,
        [pro, kab, kec]
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

exports.wilayahadminCanggih = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;
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

    /*       if (!pro || !kab || !kec) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Code are required parameters.",
        });
      } */

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
            'geometry',   ST_AsGeoJSON(coord)::jsonb,
            'properties', to_jsonb(row) - 'coord' - 'id'
          ) AS feature
          FROM (SELECT Distinct fkrtl.fkrtlid AS id, ST_Transform(ST_SetSRID(coordinat, 4326), 3857) AS coord
              FROM fkrtl
              INNER JOIN wilayahadmindesa ON wilayahadmindesa.wid=fkrtl.wlid
              INNER JOIN kecamatan ON wilayahadmindesa.kec_id=kecamatan.kcid
              INNER JOIN kabupaten ON wilayahadmindesa.kab_id=kabupaten.kbid
              INNER JOIN provinsi ON wilayahadmindesa.prov_id=provinsi.prid
              WHERE fkrtl.status='aktif' 
                    AND (string_to_array(lower(fkrtl.PelayananCanggih), ';') <@ string_to_array(lower($1), ',') AND string_to_array(lower(fkrtl.PelayananCanggih), ';') @> string_to_array(lower($1), ','))
              AND ($2::integer IS NULL OR provinsi.prid=$2)
              AND ($3::integer IS NULL OR kabupaten.kbid=$3)
              AND ($4::integer IS NULL OR kecamatan.kcid=$4)) row
        ) features;
        `,
        [id, pro, kab, kec]
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

exports.filterTitikFKTP = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;
    const kdkc = req.params.kdkc === "null" ? null : req.params.kdkc;
    const kddep = req.params.kddep === "null" ? null : req.params.kddep;
    const nmppk = req.params.nmppk === "null" ? null : req.params.nmppk;
    const alamatppk =
      req.params.alamatppk === "null" ? null : req.params.alamatppk;
    const rmin = req.params.rmin === "null" ? null : req.params.rmin;
    const rmax = req.params.rmax === "null" ? null : req.params.rmax;
    const jenis = req.params.jenis;

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

    /*       if (!pro || !kab || !kec) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Code are required parameters.",
        });
      } */

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
            'geometry',   ST_AsGeoJSON(coord)::jsonb,
            'properties', to_jsonb(row) - 'coord' - 'id'
          || jsonb_build_object('jenisfaskes', UPPER(row.jenisfaskes)) 
          ) AS feature
          FROM (SELECT Distinct fktp.fktpid AS id, ST_Transform(ST_SetSRID(coordinat, 4326), 3857) AS coord, fktp.jenisfaskes
              		FROM fktp
			INNER JOIN wilayahadmindesa ON wilayahadmindesa.wid=fktp.wlid
			INNER JOIN kecamatan ON wilayahadmindesa.kec_id=kecamatan.kcid
			INNER JOIN kabupaten ON wilayahadmindesa.kab_id=kabupaten.kbid
			INNER JOIN provinsi ON wilayahadmindesa.prov_id=provinsi.prid
            INNER JOIN cabang ON cabang.kodecab=kabupaten.kodekc
			WHERE fktp.status='aktif' 
      AND ($1::character IS NULL OR LOWER(fktp.nmppk) LIKE LOWER('%' || $1 || '%'))
      AND ($2::character IS NULL OR LOWER(fktp.alamatppk) LIKE LOWER('%' || $2 || '%'))     
			AND ($3::integer IS NULL OR provinsi.prid=$3)
			AND ($4::integer IS NULL OR kabupaten.kbid=$4)
			AND ($5::integer IS NULL OR kecamatan.kcid=$5)
      AND ($6::character IS NULL OR cabang.kodecab=$6)
			AND ($7::character IS NULL OR cabang.kodedep=$7)
      AND COALESCE(fktp.npeserta/NULLIF(fktp.ndokter,0),0) <$8
      AND COALESCE(fktp.npeserta/NULLIF(fktp.ndokter,0),0)>=$9
      AND ($10::character IS NULL OR 
        TRIM(LOWER(fktp.jenisfaskes)) IN (SELECT * FROM unnest(string_to_array(lower($10), ',')))
           )
              
          ) AS row
        ) features;
        `,
        [nmppk, alamatppk, pro, kab, kec, kdkc, kddep, rmax, rmin, jenis]
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

exports.filterFKTP = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;
    const kdkc = req.params.kdkc === "null" ? null : req.params.kdkc;
    const kddep = req.params.kddep === "null" ? null : req.params.kddep;
    const nmppk = req.params.nmppk === "null" ? null : req.params.nmppk;
    const alamatppk =
      req.params.alamatppk === "null" ? null : req.params.alamatppk;
    const rmin = req.params.rmin === "null" ? null : req.params.rmin;
    const rmax = req.params.rmax === "null" ? null : req.params.rmax;
    const jenis = req.params.jenis;

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
      SELECT fktp.fktpid AS id, ST_X(ST_SetSRID(fktp.coordinat, 4326)) AS lon, ST_Y(ST_SetSRID(fktp.coordinat, 4326)) AS lat, faskes1id AS faskesid, kwppk, kcppk, alamatppk, nmppk, jenisfaskes
			FROM fktp
			INNER JOIN wilayahadmindesa ON wilayahadmindesa.wid=fktp.wlid
			INNER JOIN kecamatan ON wilayahadmindesa.kec_id=kecamatan.kcid
			INNER JOIN kabupaten ON wilayahadmindesa.kab_id=kabupaten.kbid
			INNER JOIN provinsi ON wilayahadmindesa.prov_id=provinsi.prid
            INNER JOIN cabang ON cabang.kodecab=kabupaten.kodekc
			WHERE fktp.status='aktif' 
      AND ($1::character IS NULL OR LOWER(fktp.nmppk) LIKE LOWER('%' || $1 || '%'))
      AND ($2::character IS NULL OR LOWER(fktp.alamatppk) LIKE LOWER('%' || $2 || '%'))     
			AND ($3::integer IS NULL OR provinsi.prid=$3)
			AND ($4::integer IS NULL OR kabupaten.kbid=$4)
			AND ($5::integer IS NULL OR kecamatan.kcid=$5)
      AND ($6::character IS NULL OR cabang.kodecab=$6)
			AND ($7::character IS NULL OR cabang.kodedep=$7)
      AND COALESCE(fktp.npeserta/NULLIF(fktp.ndokter,0),0) <$8
      AND COALESCE(fktp.npeserta/NULLIF(fktp.ndokter,0),0)>=$9
      AND ($10::character IS NULL OR 
        TRIM(LOWER(fktp.jenisfaskes)) IN (SELECT * FROM unnest(string_to_array(lower($10), ',')))
           )
                    
              
        `,
        [nmppk, alamatppk, pro, kab, kec, kdkc, kddep, rmax, rmin, jenis]
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
exports.filterFKRTL = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;
    const kdkc = req.params.kdkc === "null" ? null : req.params.kdkc;
    const kddep = req.params.kddep === "null" ? null : req.params.kddep;
    const krs = req.params.krs === "null" ? "nan" : req.params.krs;
    const canggih = req.params.canggih;
    "null" ? "nan" : req.params.krs;
    const nmppk = req.params.nmppk === "null" ? null : req.params.nmppk;
    const alamatppk =
      req.params.alamatppk === "null" ? null : req.params.alamatppk;
    const jenis = req.params.jenis;

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
      SELECT fkrtl.fkrtlid AS id, ST_X(ST_SetSRID(fkrtl.coordinat, 4326)) AS lon, ST_Y(ST_SetSRID(fkrtl.coordinat, 4326)) AS lat, faskes2id AS faskesid, kwppk, kcppk, alamatppk, nmppk, jenisfaskes
			FROM fkrtl
			INNER JOIN wilayahadmindesa ON wilayahadmindesa.wid=fkrtl.wlid
			INNER JOIN kecamatan ON wilayahadmindesa.kec_id=kecamatan.kcid
			INNER JOIN kabupaten ON wilayahadmindesa.kab_id=kabupaten.kbid
			INNER JOIN provinsi ON wilayahadmindesa.prov_id=provinsi.prid
            INNER JOIN cabang ON cabang.kodecab=kabupaten.kodekc
			WHERE fkrtl.status='aktif' 
      AND ($1::character IS NULL OR LOWER(fkrtl.nmppk) LIKE LOWER('%' || $1 || '%'))
      AND ($2::character IS NULL OR LOWER(fkrtl.alamatppk) LIKE LOWER('%' || $2 || '%'))
      AND ($3::integer IS NULL OR provinsi.prid=$3)
			AND ($4::integer IS NULL OR kabupaten.kbid=$4)
			AND ($5::integer IS NULL OR kecamatan.kcid=$5)
      AND ($6::character IS NULL OR cabang.kodecab=$6)
			AND ($7::character IS NULL OR cabang.kodedep=$7)
      AND fkrtl.kelasrs IN (SELECT * FROM unnest(string_to_array($8, ',')))
      AND string_to_array(lower(fkrtl.PelayananCanggih), ';') && string_to_array(lower($9), ',')
      AND ($10::character IS NULL OR 
         TRIM(LOWER(fkrtl.jenisfaskes)) IN (SELECT * FROM unnest(string_to_array(lower($10), ',')))
            )
        `,
        [nmppk, alamatppk, pro, kab, kec, kdkc, kddep, krs, canggih, jenis]
        /* ,
        [nmppk,alamatppk,krs,canggih,pro,kab,kec,`%${nmppk}%`,`%${alamatppk}%`,] */
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

exports.filterTitikFKRTL = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;
    const kdkc = req.params.kdkc === "null" ? null : req.params.kdkc;
    const kddep = req.params.kddep === "null" ? null : req.params.kddep;
    const krs = req.params.krs === "null" ? "nan" : req.params.krs;
    const canggih = req.params.canggih;
    "null" ? "nan" : req.params.krs;
    const nmppk = req.params.nmppk === "null" ? null : req.params.nmppk;
    const alamatppk =
      req.params.alamatppk === "null" ? null : req.params.alamatppk;
    const jenis = req.params.jenis;
    /*       if (!pro || !kab || !kec) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Code are required parameters.",
        });
      } */

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
          'geometry',   ST_AsGeoJSON(coord)::jsonb,
          'properties', to_jsonb(row) - 'coord' - 'id'
        ) AS feature
        FROM (SELECT Distinct fkrtl.fkrtlid AS id, ST_Transform(ST_SetSRID(coordinat, 4326), 3857) AS coord
            FROM fkrtl
          INNER JOIN wilayahadmindesa ON wilayahadmindesa.wid=fkrtl.wlid
          INNER JOIN kecamatan ON wilayahadmindesa.kec_id=kecamatan.kcid
          INNER JOIN kabupaten ON wilayahadmindesa.kab_id=kabupaten.kbid
          INNER JOIN provinsi ON wilayahadmindesa.prov_id=provinsi.prid
                INNER JOIN cabang ON cabang.kodecab=kabupaten.kodekc
          WHERE fkrtl.status='aktif' 
          AND ($1::character IS NULL OR LOWER(fkrtl.nmppk) LIKE LOWER('%' || $1 || '%'))
          AND ($2::character IS NULL OR LOWER(fkrtl.alamatppk) LIKE LOWER('%' || $2 || '%'))
          AND ($3::integer IS NULL OR provinsi.prid=$3)
          AND ($4::integer IS NULL OR kabupaten.kbid=$4)
          AND ($5::integer IS NULL OR kecamatan.kcid=$5)
          AND ($6::character IS NULL OR cabang.kodecab=$6)
          AND ($7::character IS NULL OR cabang.kodedep=$7)
          AND fkrtl.kelasrs IN (SELECT * FROM unnest(string_to_array($8, ',')))
          AND string_to_array(lower(fkrtl.PelayananCanggih), ';') && string_to_array(lower($9), ',')
          AND ($10::character IS NULL OR 
             TRIM(LOWER(fkrtl.jenisfaskes)) IN (SELECT * FROM unnest(string_to_array(lower($10), ',')))
                )
                
                
              ) row
        ) features;
        `,
        [nmppk, alamatppk, pro, kab, kec, kdkc, kddep, krs, canggih, jenis]
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

exports.listJenisFKTP = async (req, res) => {
  try {
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
        SELECT DISTINCT fktp.jenisfaskes FROM fktp ;
        `
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

exports.listJenisFKRTL = async (req, res) => {
  try {
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
        SELECT DISTINCT fkrtl.jenisfaskes FROM fkrtl ;
        `
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

exports.listCanggih = async (req, res) => {
  try {
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
        SELECT DISTINCT fkrtl.pelayanancanggih FROM fkrtl ;
        `
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

exports.countJenisFKRTL = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;
    const kdkc = req.params.kdkc === "null" ? null : req.params.kdkc;
    const kddep = req.params.kddep === "null" ? null : req.params.kddep;

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
      SELECT DISTINCT jenisfaskes, COUNT(*) FROM fkrtl 
      INNER JOIN wilayahadmindesa ON wilayahadmindesa.wid=fkrtl.wlid
      INNER JOIN kecamatan ON wilayahadmindesa.kec_id=kecamatan.kcid
      INNER JOIN kabupaten ON wilayahadmindesa.kab_id=kabupaten.kbid
      INNER JOIN provinsi ON wilayahadmindesa.prov_id=provinsi.prid
      INNER JOIN cabang ON cabang.kodecab=kabupaten.kodekc
      WHERE fkrtl.status='aktif' 
      AND ($1::integer IS NULL OR provinsi.prid=$1)
      AND ($2::integer IS NULL OR kabupaten.kbid=$2)
      AND ($3::integer IS NULL OR kecamatan.kcid=$3)
      AND ($4::character IS NULL OR cabang.kodecab=$4)
      AND ($5::character IS NULL OR cabang.kodedep=$5)
      GROUP BY jenisfaskes;
    `,
        [pro, kab, kec, kdkc, kddep]
        /* ,
        [nmppk,alamatppk,krs,canggih,pro,kab,kec,`%${nmppk}%`,`%${alamatppk}%`,] */
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

exports.countJenisFKTP = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;
    const kdkc = req.params.kdkc === "null" ? null : req.params.kdkc;
    const kddep = req.params.kddep === "null" ? null : req.params.kddep;

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
      SELECT DISTINCT jenisfaskes, COUNT(*) FROM fktp 
      INNER JOIN wilayahadmindesa ON wilayahadmindesa.wid=fktp.wlid
      INNER JOIN kecamatan ON wilayahadmindesa.kec_id=kecamatan.kcid
      INNER JOIN kabupaten ON wilayahadmindesa.kab_id=kabupaten.kbid
      INNER JOIN provinsi ON wilayahadmindesa.prov_id=provinsi.prid
      INNER JOIN cabang ON cabang.kodecab=kabupaten.kodekc
      WHERE fktp.status='aktif' 
      AND ($1::integer IS NULL OR provinsi.prid=$1)
      AND ($2::integer IS NULL OR kabupaten.kbid=$2)
      AND ($3::integer IS NULL OR kecamatan.kcid=$3)
      AND ($4::character IS NULL OR cabang.kodecab=$4)
      AND ($5::character IS NULL OR cabang.kodedep=$5)
      GROUP BY jenisfaskes;
    `,
        [pro, kab, kec, kdkc, kddep]
        /* ,
        [nmppk,alamatppk,krs,canggih,pro,kab,kec,`%${nmppk}%`,`%${alamatppk}%`,] */
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

exports.countFKRTL = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;
    const kdkc = req.params.kdkc === "null" ? null : req.params.kdkc;
    const kddep = req.params.kddep === "null" ? null : req.params.kddep;

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
      SELECT COUNT(*) FROM fkrtl 
      INNER JOIN wilayahadmindesa ON wilayahadmindesa.wid=fkrtl.wlid
      INNER JOIN kecamatan ON wilayahadmindesa.kec_id=kecamatan.kcid
      INNER JOIN kabupaten ON wilayahadmindesa.kab_id=kabupaten.kbid
      INNER JOIN provinsi ON wilayahadmindesa.prov_id=provinsi.prid
      INNER JOIN cabang ON cabang.kodecab=kabupaten.kodekc
      WHERE fkrtl.status='aktif' 
      AND ($1::integer IS NULL OR provinsi.prid=$1)
      AND ($2::integer IS NULL OR kabupaten.kbid=$2)
      AND ($3::integer IS NULL OR kecamatan.kcid=$3)
      AND ($4::character IS NULL OR cabang.kodecab=$4)
      AND ($5::character IS NULL OR cabang.kodedep=$5)
     
    `,
        [pro, kab, kec, kdkc, kddep]
        /* ,
        [nmppk,alamatppk,krs,canggih,pro,kab,kec,`%${nmppk}%`,`%${alamatppk}%`,] */
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

exports.countFKTP = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;
    const kdkc = req.params.kdkc === "null" ? null : req.params.kdkc;
    const kddep = req.params.kddep === "null" ? null : req.params.kddep;

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
      SELECT  COUNT(*) FROM fktp 
      INNER JOIN wilayahadmindesa ON wilayahadmindesa.wid=fktp.wlid
      INNER JOIN kecamatan ON wilayahadmindesa.kec_id=kecamatan.kcid
      INNER JOIN kabupaten ON wilayahadmindesa.kab_id=kabupaten.kbid
      INNER JOIN provinsi ON wilayahadmindesa.prov_id=provinsi.prid
      INNER JOIN cabang ON cabang.kodecab=kabupaten.kodekc
      WHERE fktp.status='aktif' 
      AND ($1::integer IS NULL OR provinsi.prid=$1)
      AND ($2::integer IS NULL OR kabupaten.kbid=$2)
      AND ($3::integer IS NULL OR kecamatan.kcid=$3)
      AND ($4::character IS NULL OR cabang.kodecab=$4)
      AND ($5::character IS NULL OR cabang.kodedep=$5)
     
    `,
        [pro, kab, kec, kdkc, kddep]
        /* ,
        [nmppk,alamatppk,krs,canggih,pro,kab,kec,`%${nmppk}%`,`%${alamatppk}%`,] */
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

exports.autowilayahcadep = async (req, res) => {
  try {
    const kdkc = req.params.kdkc;
    const kddep = req.params.kddep;
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
      SELECT
      kecamatan.kcid::integer AS kec_id,
      kecamatan.kecamatan AS kec,
      kabupaten.kbid::integer AS kab_id,
      kabupaten.kabupaten AS kab,
      UPPER(CONCAT(kecamatan.kecamatan, ', ', kabupaten.kabupaten)) AS disp
    FROM
      kecamatan
    JOIN
      kabupaten ON kabupaten.kbid = kecamatan.kab_id
  
    JOIN
      cabang ON kabupaten.kodekc = cabang.kodecab
    WHERE
      lower(kecamatan.kecamatan) LIKE LOWER('%' || $3 || '%')
      AND ($1::character IS NULL OR cabang.kodedep = $1)
      AND ($2::character IS NULL OR cabang.kodecab = $2)
      UNION
      SELECT NULL::integer AS kec_id, NULL::char AS kec, kabupaten.kbid::integer AS kab_id,  kabupaten.kabupaten AS kab,  UPPER(CONCAT (kabupaten.kabupaten)) AS disp FROM kabupaten
            JOIN provinsi ON provinsi.prid = kabupaten.prov_id
            JOIN  kecamatan ON kabupaten.kbid = kecamatan.kab_id
            JOIN  cabang ON kabupaten.kodekc = cabang.kodecab
            WHERE lower(kabupaten.kabupaten) LIKE LOWER('%' || $3 || '%')
            AND ($1::character IS NULL OR cabang.kodedep = $1)
            AND ($2::character IS NULL OR cabang.kodecab = $2)
     
      ORDER BY kec_id DESC, kab_id DESC ;
`,
        [kddep, kdkc, id]
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

exports.autowilayahdep = async (req, res) => {
  try {
    const kddep = req.params.kddep;
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
      SELECT
      kecamatan.kcid::integer AS kec_id,
      kecamatan.kecamatan AS kec,
      kabupaten.kbid::integer AS kab_id,
      provinsi.prid::integer AS prov_id,
      kabupaten.kabupaten AS kab,
      provinsi.provinsi AS prov,
      UPPER(CONCAT(kecamatan.kecamatan, ', ', kabupaten.kabupaten, ', ', provinsi.provinsi)) AS disp
    FROM
      kecamatan
    JOIN
      kabupaten ON kabupaten.kbid = kecamatan.kab_id
    JOIN
      provinsi ON provinsi.prid = kabupaten.prov_id
    JOIN
      cabang ON kabupaten.kodekc = cabang.kodecab
    WHERE
      lower(kecamatan.kecamatan) LIKE LOWER('%' || $2 || '%')
      AND ($1::character IS NULL OR cabang.kodedep = $1)
      UNION
      SELECT NULL::integer AS kec_id, NULL::char AS kec, kabupaten.kbid::integer AS kab_id, provinsi.prid::integer AS prov_id, kabupaten.kabupaten AS kab, provinsi.provinsi AS prov, UPPER(CONCAT (kabupaten.kabupaten,', ', provinsi.provinsi)) AS disp FROM kabupaten
            JOIN provinsi ON provinsi.prid = kabupaten.prov_id
            JOIN  kecamatan ON kabupaten.kbid = kecamatan.kab_id
            JOIN  cabang ON kabupaten.kodekc = cabang.kodecab
            WHERE lower(kabupaten.kabupaten) LIKE LOWER('%' || $2 || '%')
            AND ($1::character IS NULL OR cabang.kodedep = $1)
      UNION
      SELECT NULL::integer AS kec_id, NULL::char AS kec, NULL::integer AS kab_id, provinsi.prid::integer AS prov_id, NULL::char AS kab, provinsi.provinsi AS prov, UPPER(provinsi.provinsi) AS disp FROM provinsi
            JOIN  kabupaten ON provinsi.prid = kabupaten.prov_id
            JOIN  cabang ON kabupaten.kodekc = cabang.kodecab
            WHERE lower(provinsi.provinsi) LIKE LOWER('%' || $2 || '%')
            AND ($1::character IS NULL OR cabang.kodedep = $1)
      ORDER BY kec_id DESC, kab_id DESC 
`,
        [kddep, id]
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
