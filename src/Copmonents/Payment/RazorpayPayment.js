import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Box,
} from "@mui/material";

export default function RazorpayPayment() {
  const [amount, setAmount] = useState(1);
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/payments/history");
      setPayments(data.payments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handlePayment = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/payments/create-order", { amount });
      const { order } = data;

      const options = {
        key: "rzp_test_R7GC2ycNjp9T5Z", // Hardcoded test key
        amount: order.amount,
        currency: order.currency,
        name: "Student Payments",
        order_id: order.id,
        handler: async (response) => {
          await axios.post("http://localhost:5000/payments/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          fetchPayments();
        },
        prefill: { name: "John Doe", email: "john@example.com", contact: "9999999999" },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed.");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom align="center">
        Razorpay Payment Gateway
      </Typography>

      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm="auto">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handlePayment}
            sx={{ height: "56px" }}
          >
            Pay Now
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        Payment History
      </Typography>

      <Paper sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Payment ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p._id}>
                <TableCell sx={{ wordBreak: "break-word", maxWidth: 150 }}>{p.orderId}</TableCell>
                <TableCell sx={{ wordBreak: "break-word", maxWidth: 150 }}>{p.paymentId || "-"}</TableCell>
                <TableCell>{p.amount}</TableCell>
                <TableCell
                  sx={{
                    color:
                      p.status === "paid" ? "green" : p.status === "failed" ? "red" : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {p.status.toUpperCase()}
                </TableCell>
                <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
