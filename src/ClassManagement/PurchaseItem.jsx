import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spin, message, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from "antd";
import { motion } from "framer-motion";
import api from "../Services/api";

const { Title, Text } = Typography;

function PurchaseItem() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Payment states
  const [payments, setPayments] = useState([]);
  const [successDialog, setSuccessDialog] = useState(false);
  const [failureDialog, setFailureDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/class");
      if (Array.isArray(res.data?.data)) {
        setProducts(res.data.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch products!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Payment History
  const fetchPayments = async () => {
    try {
      const { data } = await api.get("/payments/history");
      setPayments(data.payments || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchPayments();
  }, []);

  // ✅ Payment Handler
  const handlePayment = async (product) => {
    try {
      const { data } = await api.post("/payments/create-order", { amount: product.price });
      const { order } = data;

      const options = {
        key: "rzp_live_R9XuwBFRtEokgL", // ⚠️ replace with test key in dev
        amount: order.amount,
        currency: order.currency,
        name: "Product Purchase",
        description: `Payment for ${product.name}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await api.post("/payments/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              setPaymentDetails({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: product.price,
              });
              setSuccessDialog(true);
              fetchPayments();
            } else {
              setFailureDialog(true);
            }
          } catch (error) {
            console.error(error);
            setFailureDialog(true);
          }
        },
        prefill: { name: "John Doe", email: "john@example.com", contact: "9999999999" },
        theme: { color: "#0d3b66" },
        modal: {
          ondismiss: () => {
            setFailureDialog(true);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setFailureDialog(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", padding: "40px" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: "50px", color: "#0d3b66", fontWeight: "bold" }}>
          🛍️ Our Exclusive Products
        </Title>
      </motion.div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {products.map((item, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                  }}
                  cover={
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                      alt={item.name}
                      src={item.image || "https://via.placeholder.com/300"}
                      style={{
                        height: 220,
                        objectFit: "cover",
                        borderBottom: "1px solid #eee",
                      }}
                    />
                  }
                >
                  <Title level={4} style={{ marginBottom: 8, color: "#0d3b66", fontWeight: 600 }}>
                    {item.name}
                  </Title>
                  <Text strong style={{ fontSize: 18, color: "#ff5722" }}>
                    ₹ {item.price}
                  </Text>
                  <p style={{ margin: "10px 0", color: "#555" }}>{item.description}</p>

                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button
                      type="primary"
                      block
                      style={{
                        marginTop: 12,
                        background: "#0d3b66",
                        border: "none",
                        borderRadius: 10,
                        fontWeight: "600",
                        padding: "10px 0",
                      }}
                      onClick={() => handlePayment(item)}
                    >
                      🛒 Buy Now
                    </Button>
                  </motion.div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}

      {/* ✅ Payment History */}
      <div style={{ marginTop: 60 }}>
        <Title level={3}>Payment History</Title>
        <Paper style={{ width: "100%", overflowX: "auto", borderRadius: 15, padding: 20 }}>
          <Table>
            <TableHead style={{ background: "#0d3b66" }}>
              <TableRow>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>Payment ID</TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>Amount</TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{p.orderId}</TableCell>
                    <TableCell>{p.paymentId || "-"}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 2,
                      }).format(p.amount / 100)}
                    </TableCell>
                    <TableCell style={{ color: p.status === "paid" ? "green" : p.status === "failed" ? "red" : "orange" }}>
                      {p.status === "CREATED" ? "Failed" : p.status}
                    </TableCell>
                    <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No payment history found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </div>

      {/* ✅ Success Dialog */}
      <Dialog open={successDialog} onClose={() => setSuccessDialog(false)}>
        <DialogTitle style={{ color: "green", fontWeight: "bold" }}>Payment Successful 🎉</DialogTitle>
        <DialogContent>
          <p><b>Order ID:</b> {paymentDetails?.orderId}</p>
          <p><b>Payment ID:</b> {paymentDetails?.paymentId}</p>
          <p><b>Amount:</b> ₹{paymentDetails?.amount}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialog(false)} type="primary">OK</Button>
        </DialogActions>
      </Dialog>

      {/* ❌ Failure Dialog */}
      <Dialog open={failureDialog} onClose={() => setFailureDialog(false)}>
        <DialogTitle style={{ color: "red", fontWeight: "bold" }}>Payment Failed ❌</DialogTitle>
        <DialogContent>
          <p>Something went wrong or you cancelled the payment.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFailureDialog(false)} danger type="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PurchaseItem;
