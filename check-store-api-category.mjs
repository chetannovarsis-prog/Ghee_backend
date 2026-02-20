const regionId = 'reg_01KH3772YA6KY3KX61HCXWJMBF';
const categoryId = 'pcat_01KH35R76NN4PGW7BNG79G8PZ0';

const url = `http://localhost:9000/store/products?limit=20&offset=0&region_id=${regionId}&category_id%5B0%5D=${categoryId}&fields=*variants.calculated_price`;

const res = await fetch(url);
const data = await res.json();

console.log('Status:', res.status);
console.log('Count:', data.count);
console.log('Products:', data.products?.map(p => ({ id: p.id, title: p.title, variants: p.variants?.length })));