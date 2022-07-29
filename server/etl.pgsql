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

CREATE INDEX product_pid ON product(product_id);

CREATE INDEX related_current_id ON related(current_product_id);
CREATE INDEX related_related_id ON related(related_product_id);

CREATE INDEX feature_pid ON feature(product_id);

CREATE INDEX style_pid ON style(product_id);
CREATE INDEX style_sid ON style(style_id);

CREATE INDEX photo_sid ON photo(style_id);

CREATE INDEX sku_sid ON sku(style_id);