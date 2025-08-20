import React from "react";
import axios from "axios";
import { loadRazorpay } from "../../utills/loadRazorpay";
import api from "../../Services/api";

function Payment() {
  const handlePayment = async () => {
    const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // Call backend to create order
    const orderResponse = await api.post("/create-order", {
      amount: 1, // amount in INR (₹500)
      currency: "INR",
      receipt: "receipt_123"
    });

    const order = orderResponse.data;

    const options = {
      key: "YOUR_KEY_ID", // Enter the Key ID from Razorpay Dashboard
      amount: order.amount,
      currency: order.currency,
      name: "My React App",
      description: "Test Transaction",
      order_id: order.id,
      handler: async function (response) {
        // Verify payment on backend
        const verifyResponse = await axios.post("https://student-management-backend-node-rd8.vercel.app/verify-payment", response);
        if (verifyResponse.data.success) {
          alert("Payment Successful!");
        } else {
          alert("Payment Verification Failed!");
        }
      },
      prefill: {
        name: "Rahul Bhavsar",
        email: "rahul@example.com",
        contact: "9876543210"
      },
      theme: {
        color: "#3399cc"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Razorpay Payment in React</h2>
      <button onClick={handlePayment} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Pay ₹1
      </button>
    </div>
  );
}

export default Payment;
