const db = require('../config/database');

// ==> Método responsável por criar um novo 'Product':
exports.createProduct = async (req, res) => {
  const { product_name, quantity, price } = req.body;
  const response = await db.query(
    'INSERT INTO products (product_name, quantity, price) VALUES ($1, $2, $3)',
    [product_name, quantity, price],
  );

  res.status(201).send({
    message: 'Product added successfully!',
    body: {
      product: { product_name, quantity, price },
    },
  });
};

// ==> Método responsável por listar todos os 'Products':
exports.listAllFkrtl = async (req, res) => {
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
          SELECT fkrtl.fkrtlid AS id, ST_Transform(ST_SetSRID(coordinat, 4326), 3857) AS coord
          FROM fkrtl
          WHERE st_dwithin(
            coordinat::geography::geometry,
            ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326),
            0.09
          )
          AND fkrtl.status='aktif'
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

// ==> Método responsável por selecionar 'Product' pelo 'Id':
exports.findProductById = async (req, res) => {
  const productId = parseInt(req.params.id);
  const response = await db.query(
    'SELECT * FROM products WHERE productid = $1',
    [productId],
  );
  res.status(200).send(response.rows);
};

// ==> Método responsável por atualizar um 'Product' pelo 'Id':
exports.updateProductById = async (req, res) => {
  const productId = parseInt(req.params.id);
  const { product_name, quantity, price } = req.body;

  const response = await db.query(
    'UPDATE products SET product_name = $1, quantity = $2, price = $3 WHERE productId = $4',
    [product_name, quantity, price, productId],
  );

  res.status(200).send({ message: 'Product Updated Successfully!' });
};

// ==> Método responsável por excluir um 'Product' pelo 'Id':
exports.deleteProductById = async (req, res) => {
  const productId = parseInt(req.params.id);
  await db.query('DELETE FROM products WHERE productId = $1', [
    productId,
  ]);

  res.status(200).send({ message: 'Product deleted successfully!', productId });
};