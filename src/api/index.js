import axios from 'axios';

const API_URL = 'https://web-production-1f7f.up.railway.app/api/products/';

export async function getProducts() {
  const res = await axios.get(API_URL);
  return res.data;
}
