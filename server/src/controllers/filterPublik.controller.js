const db = require("../config/database");

const userService = process.env.USER_SERVICE;
const userKey = process.env.USER_KEY;
exports.filterTitikFKTPPublik = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;

     
    // Retrieve headers
    const username = req.headers["username"];
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
    if (!username) {
      return res.status(500).json({
        code: 500,
        status: "error",
        data: "Invalid User parameters.",
      });
    }


    if (username !== userService || userKeyHeader !== userKey){
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized",
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
            'geometry',   ST_AsGeoJSON(coord)::jsonb,
            'properties', to_jsonb(row) - 'coord' - 'id'
          ) AS feature
          FROM (SELECT Distinct fktp.fktpid AS id, ST_Transform(ST_SetSRID(coordinat, 4326), 3857) AS coord
              		FROM fktp
			INNER JOIN wilayahadmindesa ON wilayahadmindesa.wid=fktp.wlid
			INNER JOIN kecamatan ON wilayahadmindesa.kec_id=kecamatan.kcid
			INNER JOIN kabupaten ON wilayahadmindesa.kab_id=kabupaten.kbid
			INNER JOIN provinsi ON wilayahadmindesa.prov_id=provinsi.prid
            INNER JOIN cabang ON cabang.kodecab=kabupaten.kodekc
			WHERE fktp.status='aktif' 
			AND ($1::integer IS NULL OR provinsi.prid=$1)
			AND ($2::integer IS NULL OR kabupaten.kbid=$2)
			AND ($3::integer IS NULL OR kecamatan.kcid=$3)
     
              
          ) AS row
        ) features;
        `,
      [pro, kab, kec]
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

exports.filterFKTPPublik = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;

     
    // Retrieve headers
    const username = req.headers["username"];
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
    if (!username) {
      return res.status(500).json({
        code: 500,
        status: "error",
        data: "Invalid User parameters.",
      });
    }


    if (username !== userService || userKeyHeader !== userKey){
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized",
      });
    }

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
 
			AND ($1::integer IS NULL OR provinsi.prid=$1)
			AND ($2::integer IS NULL OR kabupaten.kbid=$2)
			AND ($3::integer IS NULL OR kecamatan.kcid=$3)

                    
              
        `,
      [pro, kab, kec]
    );
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
exports.filterFKRTLPublik = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;

     
    // Retrieve headers
    const username = req.headers["username"];
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
    if (!username) {
      return res.status(500).json({
        code: 500,
        status: "error",
        data: "Invalid User parameters.",
      });
    }


    if (username !== userService || userKeyHeader !== userKey){
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized",
      });
    }

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

      AND ($1::integer IS NULL OR provinsi.prid=$1)
			AND ($2::integer IS NULL OR kabupaten.kbid=$2)
			AND ($3::integer IS NULL OR kecamatan.kcid=$3)

        `,
      [pro, kab, kec]
      /* ,
        [nmppk,alamatppk,krs,canggih,pro,kab,kec,`%${nmppk}%`,`%${alamatppk}%`,] */
    );

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

exports.filterTitikFKRTLPublik = async (req, res) => {
  try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;

     
    // Retrieve headers
    const username = req.headers["username"];
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
    if (!username) {
      return res.status(500).json({
        code: 500,
        status: "error",
        data: "Invalid User parameters.",
      });
    }


    if (username !== userService || userKeyHeader !== userKey){
      return res.status(401).json({
        code: 401,
        status: "error",
        data: "Unauthorized",
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

          AND ($1::integer IS NULL OR provinsi.prid=$1)
          AND ($2::integer IS NULL OR kabupaten.kbid=$2)
          AND ($3::integer IS NULL OR kecamatan.kcid=$3)

                
                
              ) row
        ) features;
        `,
      [pro, kab, kec]
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
