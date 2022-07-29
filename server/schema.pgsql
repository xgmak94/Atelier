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
  default_price TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
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
  sale_price TEXT NULL,
  original_price TEXT,
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
  size varchar(10),
  quantity INT
);
