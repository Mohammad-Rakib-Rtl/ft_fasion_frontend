import React from "react";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  // ✅ Calculate total safely
  const total = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleCheckout = async () => {
  const email = prompt("Enter your email to receive the invoice:");
  if (!email) {
    alert("⚠️ Please enter a valid email address.");
    return;
  }

  const orderData = {
    customer_email: email,
    items: cart.map((item) => ({
      product: item.product?.id || item.id,
      quantity: item.quantity,
      size: item.size || "",
    })),
  };

  try {
    const response = await fetch(
      "https://web-production-1f7f.up.railway.app/api/checkout/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData), // ✅ FIXED
      }
    );

    if (!response.ok) {
      throw new Error("Checkout failed");
    }

    // 🔽 HANDLE PDF RESPONSE
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "invoice.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

    alert("✅ Order placed & invoice downloaded!");
    clearCart();
  } catch (error) {
    console.error(error);
    alert("⚠️ Something went wrong during checkout!");
  }
};



  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#ff6600", color: "white" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Product
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Quantity
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Size
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Price
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Subtotal
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => {
                const name = item.product?.name || "Unnamed";
                const price = item.product?.price || 0;
                const subtotal = price * item.quantity;

                return (
                  <tr key={index}>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {name}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {item.size || "-"}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {price} BDT
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {subtotal.toFixed(2)} BDT
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      
                      <button
                        onClick={() => removeFromCart(item.product?.id, item.size)}

                        style={{
                          
                          border: "none",
                          color: "white",
                          borderRadius: "4px",
                          padding: "5px 10px",
                          cursor: "pointer",
                        }}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h3 style={{ textAlign: "right" }}>
            Total: <strong>{total.toFixed(2)} BDT</strong>
          </h3>

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={handleCheckout}
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              Checkout & Download Invoice
            </button>
            <button
              onClick={clearCart}
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
