// CategoryPage.js - FIXED VERSION

import React, { useEffect, useState } from "react";
import { getProducts } from "../api";
import { useCart } from "../context/CartContext";

function CategoryPage({ categoryName }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts().then((data) => {
      console.log("Category Page - API Data:", data);
      
      const filtered = data.filter((p) => {
        let catName = "";
        
        // Handle different category formats
        if (p.category && typeof p.category === 'string') {
          catName = p.category.toLowerCase();
        } else if (p.category && p.category.name) {
          catName = p.category.name.toLowerCase();
        } else if (typeof p.category === 'number') {
          // Map category IDs to names
          const categoryMap = {
            1: "shoes",
            2: "clothes",
            3: "bags",
            4: "uncategorized"
          };
          catName = categoryMap[p.category] || "";
        }
        
        return catName === categoryName.toLowerCase();
      });
      
      console.log(`Filtered ${categoryName} products:`, filtered);
      setProducts(filtered.reverse());
    });
  }, [categoryName]);

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: parseInt(value) || 1 }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          textAlign: "center",
          color: "#e65c00",
          marginBottom: "30px",
        }}
      >
        {categoryName} Collection
      </h1>

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>No products found.</p>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Try checking your backend database or API response format.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                width: "220px",
                textAlign: "center",
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                padding: "10px",
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  border: "1px solid #eee",
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150?text=No+Image";
                  e.target.style.backgroundColor = "#f5f5f5";
                  e.target.style.border = "1px solid #ddd";
                }}
                loading="lazy"
              />
              <h3>{p.name}</h3>
              <p style={{ fontSize: "13px", color: "#999", marginTop: "-5px" }}>
                Code: {p.code}
              </p>
              <p style={{ color: "#555", fontSize: "14px" }}>{p.description}</p>
              <p>
                <strong>{p.price} BDT</strong>
              </p>
              <div style={{ marginTop: "10px" }}>
                <input
                  type="number"
                  min="1"
                  value={quantities[p.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(p.id, e.target.value)
                  }
                  style={{ width: "50px", marginRight: "10px" }}
                />
                <button
                  onClick={() => addToCart(p, quantities[p.id] || 1)}
                  style={{
                    backgroundColor: "#be8661",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;