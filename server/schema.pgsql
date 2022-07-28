-- psql -U postgres
-- \i 'C:/Users/Gary/Desktop/HackReactor/Products/server/schema.pgsql'

DROP DATABASE IF EXISTS products;
CREATE DATABASE products;

\c products;

CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  product_id INT UNIQUE,
  name TEXT,
  slogan TEXT,
  description TEXT,
  category TEXT,
  default_price FLOAT
);

CREATE TABLE related (
  id SERIAL PRIMARY KEY,
  current_product_id INT references product(product_id),
  related_product_id INT references product(product_id)
);

CREATE TABLE feature (
  id SERIAL PRIMARY KEY,
  product_id INT references product(product_id),
  feature TEXT,
  value TEXT
);

CREATE TABLE style (
  id SERIAL PRIMARY KEY,
  product_id INT references product(product_id),
  style_id INT UNIQUE,
  name TEXT,
  sale_price FLOAT NULL,
  original_price FLOAT,
  default_style BOOLEAN
);

CREATE TABLE photo (
  id SERIAL PRIMARY KEY,
  style_id INT references style(style_id),
  url TEXT,
  thumbnail_url TEXT
);

CREATE TABLE sku (
  id SERIAL PRIMARY KEY,
  style_id INT references style(style_id),
  size varchar(2),
  quantity INT
);

CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_session INT,
  product_id INT references product(product_id),
  active BOOLEAN
);

COPY product (product_id, name, slogan, description, category, default_price)
FROM 'C:/Users/Gary/Desktop/HackReactor/Products/data/product.csv'
DELIMITER ','
CSV HEADER;

COPY related (id, current_product_id, related_product_id)
FROM 'C:/Users/Gary/Desktop/HackReactor/Products/data/related.csv'
DELIMITER ','
CSV HEADER
WHERE related_product_id > 0;

COPY feature (id, product_id, feature, value)
FROM 'C:/Users/Gary/Desktop/HackReactor/Products/data/features.csv'
DELIMITER ','
CSV HEADER;

COPY style (style_id, product_id, name, sale_price, original_price, default_style)
FROM 'C:/Users/Gary/Desktop/HackReactor/Products/data/styles.csv'
DELIMITER ','
NULL as 'null'
CSV HEADER;

COPY photo (id, style_id, url, thumbnail_url)
FROM 'C:/Users/Gary/Desktop/HackReactor/Products/data/photos.csv'
DELIMITER ','
CSV HEADER;

COPY sku (id, style_id, size, quantity)
FROM 'C:/Users/Gary/Desktop/HackReactor/Products/data/skus.csv'
DELIMITER ','
CSV HEADER;

COPY cart (id, user_session, product_id, active)
FROM 'C:/Users/Gary/Desktop/HackReactor/Products/data/cart.csv'
DELIMITER ','
CSV HEADER;