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

module.exports.getAllProducts = (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 5;
  const queryString = `SELECT PRODUCT_ID AS ID, NAME, SLOGAN, DESCRIPTION, CATEGORY, DEFAULT_PRICE, CREATED_AT, UPDATED_AT
                        FROM product
                        OFFSET ${(page - 1) * count}
                        LIMIT ${count};`;
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
  const queryString = `SELECT
                          PRODUCT.PRODUCT_ID,
                          NAME,
                          SLOGAN,
                          DESCRIPTION,
                          CATEGORY,
                          DEFAULT_PRICE,
                          CREATED_AT,
                          UPDATED_AT,
                          JSON_AGG(JSON_BUILD_OBJECT(
                            'feature', FEATURE,
                            'value', VALUE
                          )) as FEATURES
                          FROM PRODUCT
                          JOIN FEATURE ON PRODUCT.PRODUCT_ID = FEATURE.PRODUCT_ID
                          WHERE PRODUCT.PRODUCT_ID = ${req.params.product_id}
                          GROUP BY PRODUCT.ID;`;

  client
    .query(queryString)
    .then((results) => {
      res.status(200).send(results.rows[0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getStyles = (req, res) => {
  let queryString = `SELECT
                      STYLE.STYLE_ID,
                      NAME,
                      ORIGINAL_PRICE,
                      SALE_PRICE,
                      DEFAULT_STYLE AS "default?",
                      JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                        'thumbnail_url', THUMBNAIL_URL,
                        'url', URL
                      )) as PHOTOS,
                      JSON_OBJECT_AGG(
                        SKU.ID, JSON_BUILD_OBJECT(
                          'quantity', QUANTITY,
                          'size', SIZE
                        )) as skus
                      FROM STYLE
                      JOIN PHOTO ON STYLE.STYLE_ID = PHOTO.STYLE_ID
                      JOIN SKU ON STYLE.STYLE_ID = SKU.STYLE_ID
                      WHERE PRODUCT_ID = ${req.params.product_id}
                      GROUP BY STYLE.ID
                      ORDER BY STYLE.STYLE_ID;`;

  client
    .query(queryString)
    .then((results) => {
      let ret = {
        product_id: req.params.product_id,
        results: results.rows
      }
      res.status(200).send(ret);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getRelated = (req, res) => {
  const queryString = `SELECT ARRAY_AGG(RELATED_PRODUCT_ID)
                        FROM RELATED
                        WHERE CURRENT_PRODUCT_ID = ${req.params.product_id};`;

  client
    .query(queryString)
    .then((results) => {
      res.status(200).send(results.rows[0].array_agg);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
