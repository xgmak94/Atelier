import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
    vus: 1000,
    duration: '30s',
};

export default function test() {
  group('GET products', () => {
    const productTest = http.get(`http://localhost:3000/products`);
    check(productTest, { 'status was 200': (r) => r.status === 200 });
    sleep(1);
  });

  group('GET products', () => {
    const productTest = http.get(`http://localhost:3000/products?page=200000`);
    check(productTest, { 'status was 200': (r) => r.status === 200 });
    sleep(1);
  });

  group('GET specific product info', () => {
    const infoTest = http.get(`http://localhost:3000/products/?product_id=1`);
    check(infoTest, { 'status was 200': (r) => r.status === 200 });
    sleep(1);
  })

  group('GET specific product info', () => {
    const infoTest = http.get(`http://localhost:3000/products/?product_id=${Math.floor(Math.random() * (1000000)) + 1}`);
    check(infoTest, { 'status was 200': (r) => r.status === 200 });
    sleep(1);
  })

  group('GET product style info', () => {
    const styleTest = http.get(`http://localhost:3000/products/1/styles`);
    check(styleTest, { 'status was 200': (r) => r.status === 200 });
    sleep(1);
  })

  group('GET product style info', () => {
    const styleTest = http.get(`http://localhost:3000/products/?product_id=${Math.floor(Math.random() * (1000000)) + 1}/styles`);
    check(styleTest, { 'status was 200': (r) => r.status === 200 });
    sleep(1);
  })

  group('GET related info', () => {
    const styleTest = http.get(`http://localhost:3000/products/1/styles`);
    check(styleTest, { 'status was 200': (r) => r.status === 200 });
    sleep(1);
  })

  group('GET related info', () => {
    const styleTest = http.get(`http://localhost:3000/products/${Math.floor(Math.random() * (1000000)) + 1}/styles`);
    check(styleTest, { 'status was 200': (r) => r.status === 200 });
    sleep(1);
  })
}