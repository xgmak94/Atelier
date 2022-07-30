let axios = require('axios');

test('GET styles', async () => {
  let response = await axios.get('http://localhost:3000/products/1/styles/');
  expect(response.status).toBe(200);
});

test('GET styles are different', async () => {
  let response1 = await axios.get('http://localhost:3000/products/1/styles/');
  let response2 = await axios.get('http://localhost:3000/products/2/styles/');

  expect(response1.status).toEqual(response2.status);

  expect(response1.data).not.toEqual(response2.data);
});

test('GET correct style', async() => {
  let response = await axios.get('http://localhost:3000/products/20/styles/');
  let expected = {
      "product_id": "20",
      "results": [
          {
              "style_id": 74,
              "name": "Orange",
              "original_price": "950",
              "sale_price": null,
              "default?": true,
              "photos": [
                  {
                      "url": "https://images.unsplash.com/photo-1474494819794-90f9664b530d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1652&q=80",
                      "thumbnail_url": "https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                  },
                  {
                      "url": "https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80",
                      "thumbnail_url": "https://images.unsplash.com/photo-1519862170344-6cd5e49cb996?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80"
                  },
                  {
                      "url": "https://images.unsplash.com/photo-1499852848443-3004d6dc4cfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80",
                      "thumbnail_url": "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                  },
                  {
                      "url": "https://images.unsplash.com/photo-1562542096-218d8f9760bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=2057&q=80",
                      "thumbnail_url": "https://images.unsplash.com/photo-1542702942-161ceb2e3d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80"
                  }
              ],
              "skus": {
                  "484": {
                      "quantity": 30,
                      "size": "XS"
                  },
                  "485": {
                      "quantity": 22,
                      "size": "S"
                  },
                  "486": {
                      "quantity": 38,
                      "size": "M"
                  },
                  "487": {
                      "quantity": 58,
                      "size": "L"
                  },
                  "488": {
                      "quantity": 10,
                      "size": "XL"
                  },
                  "489": {
                      "quantity": 56,
                      "size": "XXL"
                  }
              }
          }
      ]
  }

  expect(response.status).toBe(200);
  expect(response.data).toEqual(expected);
})