import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Spin,
  message,
  Typography,
  Modal,
  Input,
  Slider,
} from "antd";
import { motion } from "framer-motion";
import api from "../Services/api";

const { Title, Text } = Typography;
const { Search } = Input;

function PurchaseItem() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [priceLimits, setPriceLimits] = useState([0, 10000]); // min/max available

  // ✅ Payment states
  const [successDialog, setSuccessDialog] = useState(false);
  const [failureDialog, setFailureDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // ✅ Fetch Products (with filters)
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (priceRange[0] !== priceLimits[0]) params.minPrice = priceRange[0];
      if (priceRange[1] !== priceLimits[1]) params.maxPrice = priceRange[1];

      const res = await api.get("/class", { params });

      if (Array.isArray(res.data?.data)) {
        setProducts(res.data.data);

        // set slider min/max only once when products exist
        if (res.data.data.length > 0) {
          const prices = res.data.data.map((p) => p.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceLimits([min, max]);
          if (priceRange[0] === 0 && priceRange[1] === 10000) {
            setPriceRange([min, max]); // initialize range on first load
          }
        }
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

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, priceRange]);

  // ✅ Payment Handler (same as before)
  const handlePayment = async (product) => {
    try {
      const { data } = await api.post("/payments/create-order", {
        amount: product.price,
      });
      const { order } = data;

      const options = {
        key: "rzp_live_R9XuwBFRtEokgL",
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
            } else {
              setFailureDialog(true);
            }
          } catch (error) {
            console.error(error);
            setFailureDialog(true);
          }
        },
        theme: { color: "#0d3b66" },
        modal: { ondismiss: () => setFailureDialog(true) },
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
     

      {/* ✅ Filters Section */}
      <Row
        gutter={[24, 24]}
        justify="center"
        style={{ marginBottom: "30px", textAlign: "center" }}
      >
        <Col xs={24} md={8}>
          <Search
            placeholder="Search products..."
            allowClear
            enterButton
            onSearch={(val) => setSearchQuery(val)}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
     
      </Row>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "40px auto" }} />
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {products.length > 0 ? (
            products.map((item, index) => (
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
                    <Title
                      level={4}
                      style={{
                        marginBottom: 8,
                        color: "#0d3b66",
                        fontWeight: 600,
                      }}
                    >
                      {item.name}
                    </Title>
                    <Text strong style={{ fontSize: 18, color: "#ff5722" }}>
                      ₹ {item.price}
                    </Text>
                    <p style={{ margin: "10px 0", color: "#555" }}>
                      {item.description}
                    </p>

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
            ))
          ) : (
            <Text style={{ marginTop: 50 }}>No products found ❌</Text>
          )}
        </Row>
      )}

      {/* ✅ Success Modal */}
      <Modal
        open={successDialog}
        onCancel={() => setSuccessDialog(false)}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => setSuccessDialog(false)}
          >
            OK
          </Button>,
        ]}
      >
        <Title level={4} style={{ color: "green" }}>
          Payment Successful 🎉
        </Title>
        <p>
          <b>Order ID:</b> {paymentDetails?.orderId}
        </p>
        <p>
          <b>Payment ID:</b> {paymentDetails?.paymentId}
        </p>
        <p>
          <b>Amount:</b> ₹{paymentDetails?.amount}
        </p>
      </Modal>

      {/* ❌ Failure Modal */}
      <Modal
        open={failureDialog}
        onCancel={() => setFailureDialog(false)}
        footer={[
          <Button key="close" danger onClick={() => setFailureDialog(false)}>
            Close
          </Button>,
        ]}
      >
        <Title level={4} style={{ color: "red" }}>
          Payment Failed ❌
        </Title>
        <p>Something went wrong or you cancelled the payment.</p>
      </Modal>
    </div>
  );
}

export default PurchaseItem;
