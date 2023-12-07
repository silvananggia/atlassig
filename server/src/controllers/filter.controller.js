const db = require("../config/database");

exports.bboxKabupaten = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        data: "Code are required parameters.",
      });
    }

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
  
      if (!id) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Code are required parameters.",
        });
      }
  
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
  
      if (!id) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Code are required parameters.",
        });
      }
  
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
    } catch (error) {
      console.error("Error executing query", error);
      res.status(500).json({
        code: 500,
        status: "error",
        data: "Internal Server Error",
      });
    }
  };