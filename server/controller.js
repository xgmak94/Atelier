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

//TODO double check page/count works
module.exports.getAllProducts = (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 5;
  const queryString = `SELECT product_id as id, name, slogan, description, category, default_price, created_at, updated_at
                        FROM product
                        offset ${(page - 1) * count}
                        limit ${count};`;
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
  const queryString = `SELECT PRODUCT.PRODUCT_ID, NAME, SLOGAN, DESCRIPTION, CATEGORY, DEFAULT_PRICE, CREATED_AT, UPDATED_AT, FEATURE, VALUE
                        FROM PRODUCT
                        JOIN FEATURE ON PRODUCT.PRODUCT_ID = FEATURE.PRODUCT_ID
                        WHERE PRODUCT.PRODUCT_ID = ${req.params.product_id};`;
  client
    .query(queryString)
    .then((results) => {
      let ret = {
        ...results.rows[0],
      };
      delete ret.feature; delete ret.value;

      let features = [];
      results.rows.forEach((row) => {
        features.push({ feature: row.feature, value: row.value });
      });
      ret.features = features;

      res.status(200).send(ret);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getStyles = (req, res) => {
  let { product_id } = req.params;
  let queryString = `SELECT STYLE.STYLE_ID, NAME, ORIGINAL_PRICE, SALE_PRICE, DEFAULT_STYLE AS "default?", url, thumbnail_url, size, quantity, SKU.ID as SKU_ID
                      FROM STYLE
                      JOIN PHOTO ON STYLE.STYLE_ID = PHOTO.STYLE_ID
                      JOIN SKU ON STYLE.STYLE_ID = SKU.STYLE_ID
                      WHERE PRODUCT_ID = ${product_id};`;

  client
    .query(queryString)
    .then((results) => {
      let styleSet = new Set();
      let photoSet = new Set();
      let ret = {product_id, results: []};

      results.rows.forEach((row) => {
        let sku_id = row.sku_id;
        if(styleSet.has(row.style_id)) {
          let idx = ret.results.findIndex((element) => element.style_id === row.style_id);
          let photo = {
            thumbnail_url: row.thumbnail_url,
            url : row.url
          }
          if(!photoSet.has(JSON.stringify(photo))) {
            photoSet.add(JSON.stringify(photo));
            ret.results[idx].photos.push(photo);
          }
          ret.results[idx].skus[sku_id] = {
            quantity: row.quantity,
            size: row.size
          }
        }
        else {
          let photo = {
            thumbnail_url: row.thumbnail_url,
            url: row.url
          }
          styleSet.add(row.style_id);
          photoSet.add(JSON.stringify(photo));
          row.photos = [photo];
          row.skus = {};
          row.skus[sku_id] = {
            quantity: row.quantity,
            size: row.size
          };
          ret.results.push(row);
          delete row.url; delete row.thumbnail_url; delete row.sku_id;
          delete row.quantity; delete row.size;
        }
      })

      res.status(200).send(ret);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

module.exports.getRelated = (req, res) => {
  const queryString = `SELECT DISTINCT related_product_id
                        FROM related
                        WHERE current_product_id = ${req.params.product_id};`;
  client
    .query(queryString)
    .then((results) => {
      let ret = results.rows.map((row) => {
        return row.related_product_id;
      });

      res.status(200).send(ret);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
