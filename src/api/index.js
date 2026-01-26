// src/api/index.js
import axios from 'axios';

const API_URL = 'https://web-production-1f7f.up.railway.app/api/products/';

export async function getProducts() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}