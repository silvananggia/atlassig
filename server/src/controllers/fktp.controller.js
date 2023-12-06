const db = require("../config/database");

exports.listAllFktp = async (req, res) => {
  try {
    const { lat, lon } = req.query;

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
            ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326),
            0.09
          )
          AND fktp.status='aktif'
        ) row
      ) features;
    `);

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
