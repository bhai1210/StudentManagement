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
  Select,
  Slider,
  Badge,
  Drawer,
  List,
  Space,
} from "antd";
import { motion } from "framer-motion";
import {
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import api from "../Services/api";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

function PurchaseItem() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [rating, setRating] = useState(null);
  const [sort, setSort] = useState("price:asc");

  // ✅ Cart & Checkout states
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);

  // ✅ Payment states
  const [successDialog, setSuccessDialog] = useState(false);
  const [failureDialog, setFailureDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/class", {
        params: {
          search: searchQuery,
          category,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          rating,
          sort,
        },
      });

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

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, category, priceRange, rating, sort]);

  // ✅ Add to Cart
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    message.success(`${product.name} added to cart`);
  };

  // ➖ Remove from Cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
    message.info("Item removed from cart");
  };

  // 🔼 Increment Qty
  const incrementQty = (id) => {
    setCart((prev) =>
      prev.map((p) => (p._id === id ? { ...p, qty: p.qty + 1 } : p))
    );
  };

  // 🔽 Decrement Qty
  const decrementQty = (id) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p._id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  // ✅ Checkout (Cart Payment)
  const handleCheckout = async () => {
    try {
      const totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );

      const { data } = await api.post("/payments/create-order", {
        amount: totalAmount,
      });

      const { order } = data;

      const options = {
        key: "rzp_live_R9XuwBFRtEokgL", // ⚠️ test key
        amount: order.amount,
        currency: order.currency,
        name: "Shopping Checkout",
        description: `Payment for cart items`,
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
                amount: totalAmount,
              });
              setCart([]);
              setCartVisible(false);
              setSuccessDialog(true);
            } else {
              setFailureDialog(true);
            }
          } catch (error) {
            console.error(error);
            setFailureDialog(true);
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: { color: "#0d3b66" },
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
      {/* 🔎 Filters */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} md={6}>
          <Search
            placeholder="Search products..."
            allowClear
            onSearch={(val) => setSearchQuery(val)}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Filter by Category"
            allowClear
            style={{ width: "100%" }}
            onChange={(val) => setCategory(val)}
          >
            <Option value="electronics">Electronics</Option>
            <Option value="fashion">Fashion</Option>
            <Option value="books">Books</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Slider
            range
            min={0}
            max={10000}
            defaultValue={priceRange}
            onAfterChange={(val) => setPriceRange(val)}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            defaultValue="price:asc"
            onChange={(val) => setSort(val)}
            style={{ width: "100%" }}
          >
            <Option value="price:asc">Price: Low to High</Option>
            <Option value="price:desc">Price: High to Low</Option>
            <Option value="rating:desc">Rating: High to Low</Option>
          </Select>
        </Col>
      </Row>

      {/* 🛒 Cart Button */}
      <div style={{ textAlign: "right", marginBottom: 20 }}>
        <Badge count={cart.length} showZero>
          <Button type="primary" onClick={() => setCartVisible(true)}>
            <ShoppingCartOutlined /> Cart
          </Button>
        </Badge>
      </div>

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
                      onClick={() => addToCart(item)}
                    >
                      ➕ Add to Cart
                    </Button>
                  </motion.div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}

      {/* 🛒 Cart Drawer */}
      <Drawer
        title="Your Shopping Cart"
        open={cartVisible}
        onClose={() => setCartVisible(false)}
        width={400}
      >
        <List
          dataSource={cart}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  size="small"
                  icon={<MinusOutlined />}
                  onClick={() => decrementQty(item._id)}
                />,
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => incrementQty(item._id)}
                />,
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeFromCart(item._id)}
                />,
              ]}
            >
              <Space direction="vertical">
                <Text strong>{item.name}</Text>
                <Text>
                  Qty: {item.qty} × ₹{item.price} ={" "}
                  <b>₹{item.price * item.qty}</b>
                </Text>
              </Space>
            </List.Item>
          )}
        />
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <Button type="primary" onClick={handleCheckout} disabled={!cart.length}>
            Checkout
          </Button>
        </div>
      </Drawer>

      {/* ✅ Success Modal */}
      <Modal
        open={successDialog}
        onCancel={() => setSuccessDialog(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setSuccessDialog(false)}>
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
