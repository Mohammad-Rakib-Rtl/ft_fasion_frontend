// src/api/index.js - MORE ROBUST VERSION

import axios from 'axios';

const API_URL = 'https://web-production-1f7f.up.railway.app/api/products/';

export async function getProducts() {
  try {
    const response = await axios.get(API_URL);
    
    // Try to return response.data first
    if (response && response.data) {
      // If response.data is an array, return it directly
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // If response.data has a 'results' property (common in paginated responses)
      if (response.data.results && Array.isArray(response.data.results)) {
        return response.data.results;
      }
      
      // If response.data is an object with items, return those
      if (response.data.items && Array.isArray(response.data.items)) {
        return response.data.items;
      }
    }
    
    // Fallback: return empty array if nothing found
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Return empty array on error
  }
}