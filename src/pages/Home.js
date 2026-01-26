// Home.js - FIXED VERSION WITHOUT UNUSED VARIABLE

import React, { useEffect, useState, useMemo } from "react";
import { getProducts } from "../api";
import { useCart } from "../context/CartContext";

function Home() {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [quantities, setQuantities] = useState({});
  const [sizes, setSizes] = useState({});
  const [currentCategory, setCurrentCategory] = useState('all'); // 'all', 'shoes', 'clothes', 'bags'
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts().then((data) => {
      console.log("API Response:", data);
      
      // Group all products by category name
      const grouped = data.reduce((acc, product) => {
        let categoryName = "Uncategorized";
        
        // Get category name from product.category (could be string or object)
        if (product.category && typeof product.category === 'string') {
          categoryName = product.category;
        } else if (product.category && product.category.name) {
          categoryName = product.category.name;
        } else if (product.category) {
          // If category is just an ID, map it to name
          const categoryMap = {
            1: "Shoes",
            2: "Clothes",
            3: "Bags",
            4: "Uncategorized"
          };
          categoryName = categoryMap[product.category] || "Uncategorized";
        }
        
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(product);
        return acc;
      }, {});
      
      setGroupedProducts(grouped);
    });
  }, []);

  // Filter products based on current category
  const filteredProducts = useMemo(() => {
    if (currentCategory === 'all') {
      return groupedProducts;
    }
    
    // Convert currentCategory to match category names
    const categoryMap = {
      'shoes': ['Shoes', 'shoes'],
      'clothes': ['Clothes', 'clothes'],
      'bags': ['Bags', 'bags']
    };
    
    const matchingCategories = categoryMap[currentCategory] || [];
    
    const filtered = {};
    Object.entries(groupedProducts).forEach(([category, products]) => {
      if (matchingCategories.includes(category) || 
          matchingCategories.some(cat => category.toLowerCase() === cat.toLowerCase())) {
        filtered[category] = products;
      }
    });
    
    return filtered;
  }, [currentCategory, groupedProducts]);

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: parseInt(value) || 1 }));
  };

  const handleSizeChange = (id, value) => {
    setSizes((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    const size = sizes[product.id] || "";

    // 🛑 Prevent adding shoes/clothes without selecting size
    if (
      (product?.category?.toLowerCase() === "shoes" ||
       product?.category?.toLowerCase() === "clothes") &&
      !size
    ) {
      alert("Please select a size before adding to cart.");
      return;
    }

    addToCart(product, quantity, size);
  };

  // Handle category navigation
  const navigateToCategory = (category) => {
    setCurrentCategory(category);
  };

  // Get current page title
  const getPageTitle = () => {
    if (currentCategory === 'shoes') return 'Shoes Collection';
    if (currentCategory === 'clothes') return 'Clothes Collection';
    if (currentCategory === 'bags') return 'Bags Collection';
    return 'FT FASHION STORE PRODUCTS';
  };

  return (
    <div style={{ padding: "40px" }}>
      {/* Navigation Bar */}
      <nav style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => navigateToCategory('all')}
          style={{
            margin: '0 10px',
            padding: '8px 16px',
            backgroundColor: currentCategory === 'all' ? '#ff6600' : 'transparent',
            color: currentCategory === 'all' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          All
        </button>
        <button 
          onClick={() => navigateToCategory('shoes')}
          style={{
            margin: '0 10px',
            padding: '8px 16px',
            backgroundColor: currentCategory === 'shoes' ? '#ff6600' : 'transparent',
            color: currentCategory === 'shoes' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Shoes
        </button>
        <button 
          onClick={() => navigateToCategory('clothes')}
          style={{
            margin: '0 10px',
            padding: '8px 16px',
            backgroundColor: currentCategory === 'clothes' ? '#ff6600' : 'transparent',
            color: currentCategory === 'clothes' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clothes
        </button>
        <button 
          onClick={() => navigateToCategory('bags')}
          style={{
            margin: '0 10px',
            padding: '8px 16px',
            backgroundColor: currentCategory === 'bags' ? '#ff6600' : 'transparent',
            color: currentCategory === 'bags' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Bags
        </button>
      </nav>

      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        {getPageTitle()}
      </h2>

      {Object.keys(filteredProducts).length === 0 ? (
        <p style={{ textAlign: "center" }}>No products found.</p>
      ) : (
        Object.entries(filteredProducts).map(([category, products]) => (
          <div key={category} style={{ marginBottom: "40px" }}>
            <h2
              style={{
                color: "#e65c00",
                borderBottom: "2px solid #e65c00",
                paddingBottom: "5px",
                marginBottom: "15px",
              }}
            >
              {category}
            </h2>

            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "20px",
                paddingBottom: "10px",
              }}
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "8px",
                    width: "220px",
                    textAlign: "center",
                    flex: "0 0 auto",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
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
                  <h3 style={{ margin: "10px 0 5px" }}>{p.name}</h3>
                  <p style={{ color: "#555", fontSize: "14px" }}>
                    Code: <strong>{p.code}</strong>
                  </p>
                  <p>
                    <strong>{p.price} BDT</strong>
                  </p>

                  {/* ✅ Size Selector for Shoes and Clothes */}
                  {(p?.category?.toLowerCase() === "shoes" ||
                    p?.category?.toLowerCase() === "clothes") && (
                    <select
                      value={sizes[p.id] || ""}
                      onChange={(e) => handleSizeChange(p.id, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        marginBottom: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="">Select Size</option>
                      {p.category.toLowerCase() === "shoes" ? (
                        <>
                          <option value="36">36</option>
                          <option value="37">37</option>
                          <option value="38">38</option>
                          <option value="39">39</option>
                          <option value="40">40</option>
                        </>
                      ) : (
                        <>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                        </>
                      )}
                    </select>
                  )}

                  {/* Quantity & Add to Cart */}
                  <div style={{ marginTop: "10px" }}>
                    <input
                      type="number"
                      min="1"
                      value={quantities[p.id] || 1}
                      onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                      style={{ width: "50px", marginRight: "10px" }}
                    />
                    <button
                      onClick={() => handleAddToCart(p)}
                      style={{
                        backgroundColor: "#ff6600",
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
          </div>
        ))
      )}
    </div>
  );
}

export default Home;