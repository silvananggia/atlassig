const db = require("../config/database");

exports.listFktp = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  try {
   


    const result = await db.query(`
    SELECT * FROM fktp LIMIT $1 OFFSET $2
    `,[limit, offset]);

    res.json({
      code: 200,
      status: "success",
      data: result.rows,
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

exports.listAllFktp = async (req, res) => {
  try {
   
    const lat = req.params.lat;
    const lon = req.params.lon;

    if (!lat || !lon) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: "Latitude and longitude are required parameters.",
      });
    }

    const result = await db.query(`
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
          SELECT fktp.fktpid AS id, ST_Transform(ST_SetSRID(coordinat, 4326), 3857) AS coord
          FROM fktp
          WHERE st_dwithin(
            coordinat::geography::geometry,
            ST_SetSRID(ST_MakePoint($1, $2), 4326),
            0.09
          )
          AND fktp.status='aktif'
        ) row
      ) features;
    `,[lon,lat]);

    res.json({
      code: 200,
      status: "success",
      data: result.rows[0].jsonb_build_object,
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

exports.listCabangFKTP = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: "Code are required parameters.",
      });
    }

    const result = await db.query(`
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
    FROM (SELECT fktp.fktpid AS id, ST_Transform(ST_SetSRID(coordinat, 4326), 3857) AS coord
      FROM fktp
      JOIN kabupaten ON kabupaten.kbid=fktp.kab_id
      JOIN cabang ON kabupaten.kodekc=cabang.kodecab
      WHERE cabang.kodecab=$1 AND fktp.status='aktif') row
    ) features;
    `,[id]);

    res.json({
      code: 200,
      status: "success",
      data: result.rows[0].jsonb_build_object,
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

exports.listKedeputianFKTP = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: "Code are required parameters.",
      });
    }

    const result = await db.query(`
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
    FROM (SELECT fktp.fktpid AS id, ST_Transform(ST_SetSRID(coordinat, 4326), 3857) AS coord
      FROM fktp
      JOIN kabupaten ON kabupaten.kbid=fktp.kab_id
      JOIN cabang ON kabupaten.kodekc=cabang.kodecab
      WHERE cabang.kodedep=$1 AND fktp.status='aktif') row
    ) features;
    `,[id]);

    res.json({
      code: 200,
      status: "success",
      data: result.rows[0].jsonb_build_object,
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

exports.detailFKTP = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: "Code are required parameters.",
      });
    }

    const result = await db.query(`
    SELECT fktp.fktpid AS id, ST_X(ST_SetSRID(coordinat, 4326)) AS lon, ST_Y(ST_SetSRID(coordinat, 4326)) AS lat, faskes1id AS faskesid, kwppk, kcppk, alamatppk, nmppk, jenisfaskes
    FROM fktp
    WHERE fktp.fktpid=$1 AND fktp.status='aktif'
    `,[id]);

    res.json({
      code: 200,
      status: "success",
      data: result.rows,
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
