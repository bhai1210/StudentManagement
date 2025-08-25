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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import api from "../../Services/api";

const courses = [
  { id: 1, name: "Class 1", fee: 0.01 },
  { id: 2, name: "Class 2", fee: 1 },
  { id: 3, name: "Class 3", fee: 1 },
  { id: 4, name: "Class 4", fee: 1 },
  { id: 5, name: "Class 5", fee: 1 },
  { id: 6, name: "Class 6", fee: 1 },
  { id: 7, name: "Class 7", fee: 1 },
  { id: 8, name: "Class 8", fee: 1 },
  { id: 9, name: "Class 9", fee: 1 },
  { id: 10, name: "Class 10", fee: 1 },
  { id: 11, name: "Class 11 (Science)", fee: 1 },
  { id: 12, name: "Class 11 (Arts)", fee: 1 },
  { id: 13, name: "Class 11 (Information Tech)", fee: 1 },
  { id: 14, name: "Class 12 (Science)", fee: 1 },
  { id: 15, name: "Class 12 (Arts)", fee: 1 },
  { id: 16, name: "Class 12 (Information Tech)", fee: 1 },
];

export default function RazorpayPayment() {
  const [amount, setAmount] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const { data } = await api.get("/payments/history");
      setPayments(data.payments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    const course = courses.find((c) => c.id === courseId);
    if (course) setAmount(course.fee);
  };

  const handlePayment = async () => {
    try {
      const { data } = await api.post("/payments/create-order", { amount });
      const { order } = data;

      const options = {
        key: "rzp_live_R9XuwBFRtEokgL",
        amount: order.amount,
        currency: order.currency,
        name: "Student Payments",
        description: `Payment for ${courses.find(c => c.id === selectedCourse)?.name}`,
        order_id: order.id,
        handler: async (response) => {
          await axios.post("/payments/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          fetchPayments();
        },
        prefill: { name: "John Doe", email: "john@example.com", contact: "9999999999" },
        theme: { color: "#1e88e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 1200,
          mx: "auto",
          borderRadius: "20px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          background: "linear-gradient(135deg, #f9f9f9, #f1f1f1)",
        }}
      >
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Student Fee Payment
        </Typography>

        <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
              <InputLabel>Select Course</InputLabel>
              <Select value={selectedCourse} onChange={handleCourseChange} label="Select Course">
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name} - ₹{course.fee}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

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
              sx={{
                height: "56px",
                borderRadius: "12px",
                fontWeight: "bold",
                px: 4,
                boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
              disabled={!selectedCourse}
            >
              Pay Now
            </Button>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom>
          Payment History
        </Typography>

        <Paper sx={{ width: "100%", overflowX: "auto", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Payment ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Amount</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p._id}>
                  <TableCell sx={{ wordBreak: "break-word", maxWidth: 150 }}>{p.orderId}</TableCell>
                  <TableCell sx={{ wordBreak: "break-word", maxWidth: 150 }}>{p.paymentId || "-"}</TableCell>
                  <TableCell>₹{p.amount}</TableCell>
                  <TableCell
                    sx={{
                      color: p.status === "paid" ? "green" : p.status === "failed" ? "red" : "orange",
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
    </motion.div>
  );
}
