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


  exports.autowilayah = async (req, res) => {
    try {
      const id = req.params.id;
  
      if (!id) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Code are required parameters.",
        });
      }
  
      console.log(id);
      const result = await db.query(
        `
        SELECT kecamatan.kcid::integer AS kec_id, kecamatan.kecamatan AS kec, kabupaten.kbid::integer AS kab_id, provinsi.prid::integer AS prov_id, kabupaten.kabupaten AS kab, provinsi.provinsi AS prov, INITCAP(CONCAT (kecamatan.kecamatan,', ', kabupaten.kabupaten,', ', provinsi.provinsi)) AS disp FROM kecamatan
        JOIN kabupaten ON kabupaten.kbid = kecamatan.kab_id
        JOIN provinsi ON provinsi.prid = kabupaten.prov_id
        WHERE lower(kecamatan.kecamatan) LIKE '%${id}%'
UNION
SELECT NULL::integer AS kec_id, NULL::char AS kec, kabupaten.kbid::integer AS kab_id, provinsi.prid::integer AS prov_id, kabupaten.kabupaten AS kab, provinsi.provinsi AS prov, INITCAP(CONCAT (kabupaten.kabupaten,', ', provinsi.provinsi)) AS disp FROM kabupaten
        JOIN provinsi ON provinsi.prid = kabupaten.prov_id
        WHERE lower(kabupaten.kabupaten) LIKE '%${id}%'
UNION
SELECT NULL::integer AS kec_id, NULL::char AS kec, NULL::integer AS kab_id, provinsi.prid::integer AS prov_id, NULL::char AS kab, provinsi.provinsi AS prov, INITCAP(provinsi.provinsi) AS disp FROM provinsi
        WHERE lower(provinsi.provinsi) LIKE '%${id}%' 
ORDER BY kec_id DESC, kab_id DESC LIMIT 7;
        `
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


  exports.wilayahadmin = async (req, res) => {
    try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;
  
/*       if (!pro || !kab || !kec) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Code are required parameters.",
        });
      } */
  
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
              WHERE fktp.status='aktif'
              AND ($1::integer IS NULL OR provinsi.prid=$1)
              AND ($2::integer IS NULL OR kabupaten.kbid=$2)
              AND ($3::integer IS NULL OR kecamatan.kcid=$3)) row
        ) features;
        
        `,
        [pro,kab,kec]
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


  exports.wilayahadminCanggih = async (req, res) => {
    try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;
    const id = req.params.id; 
/*       if (!pro || !kab || !kec) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Code are required parameters.",
        });
      } */
  
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
                    AND (string_to_array(lower(fkrtl.PelayananCanggih), ';') <@ string_to_array(lower('${id}'), ',') AND string_to_array(lower(fkrtl.PelayananCanggih), ';') @> string_to_array(lower('${id}'), ','))
              AND ($1::integer IS NULL OR provinsi.prid=$1)
              AND ($2::integer IS NULL OR kabupaten.kbid=$2)
              AND ($3::integer IS NULL OR kecamatan.kcid=$3)) row
        ) features;
        `,
        [pro,kab,kec]
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


  exports.filterFKTP = async (req, res) => {
    try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;
    const kdkc = req.params.pro === "null" ? null : req.params.kdkc;
    const kddep = req.params.kab === "null" ? null : req.params.kddep;
    const rmax = req.params.kec === "null" ? null : req.params.rmax;
    const rmin = req.params.pro === "null" ? null : req.params.rmin;
    const nmppk = req.params.kab === "null" ? null : req.params.nmppk;
    const alamatppk = req.params.kec === "null" ? null : req.params.alamatppk;
    
/*       if (!pro || !kab || !kec) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Code are required parameters.",
        });
      } */
  
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
                    AND (${nmppk}::integer IS NULL OR fktp.nmppk LIKE '%${nmppk}%')
                    AND (${alamatppk}::integer IS NULL OR fktp.alamatppk LIKE '%${alamatppk}%')
                    AND fktp.npeserta/NULLIF(fktp.ndokter,0)<$1 
                    AND fktp.npeserta/NULLIF(fktp.ndokter,0)>=$2
              AND ($3::integer IS NULL OR provinsi.prid=$3)
              AND ($4::integer IS NULL OR kabupaten.kbid=$4)
              AND ($5::integer IS NULL OR kecamatan.kcid=$5)
              AND ($6::integer IS NULL OR cabang.kodecab=$6)
              AND ($7::integer IS NULL OR cabang.kodedep=$7)
              
          ) AS row
        ) features;
        `,
        [rmax,rmin,pro,kab,kec,kdkc,kddep]
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

  exports.filterFKRTL = async (req, res) => {
    try {
    const pro = req.params.pro === "null" ? null : req.params.pro;
    const kab = req.params.kab === "null" ? null : req.params.kab;
    const kec = req.params.kec === "null" ? null : req.params.kec;
    const kdkc = req.params.pro === "null" ? null : req.params.kdkc;
    const kddep = req.params.kab === "null" ? null : req.params.kddep;
    const krs = req.params.kec === "null" ? null : req.params.krs;
    const canggih = req.params.pro === "null" ? null : req.params.cannggih;
    const nmppk = req.params.kab === "null" ? null : req.params.nmppk;
    const alamatppk = req.params.kec === "null" ? null : req.params.alamatppk;
    
/*       if (!pro || !kab || !kec) {
        return res.status(400).json({
          code: 400,
          status: "error",
          data: "Code are required parameters.",
        });
      } */
  
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
                    AND (${nmppk}::integer IS NULL OR fkrtl.nmppk LIKE '%${nmppk}%')
                    AND (${alamatppk}::integer IS NULL OR fkrtl.alamatppk LIKE '%${alamatppk}%')
                    AND fkrtl.kelasrs IN (${krs})
                    AND (string_to_array(lower(fkrtl.PelayananCanggih), ';') <@ string_to_array(lower('$1'), ',') 
                    AND string_to_array(lower(fkrtl.PelayananCanggih), ';') @> string_to_array(lower('$1'), ','))
              AND ($2::integer IS NULL OR provinsi.prid=$2)
              AND ($3::integer IS NULL OR kabupaten.kbid=$3)
              AND ($4::integer IS NULL OR kecamatan.kcid=$4)
              AND ($5::integer IS NULL OR cabang.kodecab=$5)
              AND ($6::integer IS NULL OR cabang.kodedep=$6))) row
        ) features;
        `,
        [canggih,pro,kab,kec,kdkc,kddep]
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
 

  exports.listJenisFKTP = async (req, res) => {
    try {
     

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
    } catch (error) {
      console.error("Error executing query", error);
      res.status(500).json({
        code: 500,
        status: "error",
        data: "Internal Server Error",
      });
    }
  };
