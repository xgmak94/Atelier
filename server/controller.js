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
  const queryString = `SELECT product_id as id, name, slogan, description, category, default_price
                        FROM product
                        WHERE product_id = ${product_id}`;
  const secondQuery = `SELECT feature, value
                        FROM feature
                        WHERE PRODUCT_ID = ${product_id}`;

  client
    .query(queryString)
    .then((results) => {
      client.query(secondQuery).then((secondResults) => {
        let ret = results.rows;
        ret[0].features = secondResults.rows;

        res.status(200).send(ret);
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getStyles = (req, res) => {
  let { product_id } = req.params;
  const queryString = `Select style_id from style
                      where product_id = ${product_id}`;
  client
    .query(queryString)
    .then((results) => {
      let styles = results.rows.map((row) => {
        return row.style_id;
      })
      console.log(styles);
      res.status(200).send(styles);
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
