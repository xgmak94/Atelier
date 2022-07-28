const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

client.connect();

//TODO
module.exports.getAllProducts = (req, res) => {
  const queryString = 'SELECT * FROM product';
  client
    .query(queryString)
    .then((results) => {
      res.status(200).send(results.rows);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getProduct = (req, res) => {
  let { product_id } = req.params;
  const queryString = `SELECT product_id as id, name, slogan, description, category, default_price, created_at, updated_at
                        FROM product
                        WHERE product_id = ${product_id}`;
  const featureQuery = `SELECT feature, value
                        FROM feature
                        WHERE PRODUCT_ID = ${product_id}`;

  client
    .query(queryString)
    .then((results) => {
      client.query(featureQuery).then((secondResults) => {
        let ret = results.rows[0];
        ret.features = secondResults.rows;

        res.status(200).send(ret);
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

//TODO
module.exports.getStyles = (req, res) => {
  let { product_id } = req.params;
  const queryString = `SELECT style_id, name, original_price, sale_price, default_style as "default?"
                        FROM style
                        WHERE product_id = ${product_id}`;
  const photoQuery = `SELECT photo.style_id, url, thumbnail_url
                        FROM photo
                        WHERE photo.style_id in (SELECT style_id from style
                                                  WHERE product_id = ${product_id});`
  const skuQuery = `SELECT sku.style_id, size, quantity
                        FROM sku
                        WHERE sku.style_id in (SELECT style_id from style
                                                  WHERE product_id = ${product_id});`

  client
    .query(queryString)
    .then((results1) => {
      res.status(200).send(results1.rows);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.getRelated = (req, res) => {
  let { product_id } = req.params;
  const queryString = `SELECT DISTINCT related_product_id
                        FROM related
                        WHERE current_product_id = ${product_id};`;
  client
    .query(queryString)
    .then((results) => {
      let ret = results.rows.map((row) => {
        return row.related_product_id;
      });

      res.status(200).send(ret);
    })
    .catch((err) => {
      console.log(err);
    });
};
