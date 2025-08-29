import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Spin,
  message,
  Typography,
  Input,
  Badge,
  Drawer,
  List,
  Radio,
} from "antd";
import { motion } from "framer-motion";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { setAddress, setShippingMethod, clearCheckout } from "../../features/checkoutSlice";

import { fetchProducts } from "../../features/productSlice";
import { addToCart,removeFromCart,clearCart } from "../../features/cartSlice";
import api from "../../Services/api";

const { Title, Text } = Typography;
const { Search } = Input;

function PurchaseItem() {
  const dispatch = useDispatch();
  const { items: cart } = useSelector((state) => state.cart);
  const { items: products, loading } = useSelector((state) => state.products);
  const checkout = useSelector((state) => state.checkout);

  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Cart, 2: Address, 3: Shipping

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Add this below your cartTotal
const shippingCharge = checkout.shippingMethod === "express" ? 50 : 0;
const finalTotal = cartTotal + shippingCharge;


  useEffect(() => {
    dispatch(fetchProducts(searchQuery));
  }, [searchQuery, dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    message.success(`${product.name} added to cart`);
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
    message.warning("Item removed from cart");
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      message.warning("Cart is empty!");
      return;
    }
    setStep(2); // Go to address form
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    dispatch(
      setAddress({
        address: form.address.value,
        city: form.city.value,
        state: form.state.value,
        zip: form.zip.value,
        country: form.country.value,
      })
    );
    setStep(3); // Go to shipping
  };

  const handlePayment = async () => {
    if (!checkout.address) {
      message.warning("Please enter shipping address first!");
      return;
    }

    try {
      const { data } = await api.post("/payments/create-order", {
        amount: finalTotal,
      });
      const { order } = data;

      const options = {
        key: "rzp_live_R9XuwBFRtEokgL",
        amount: order.amount,
        currency: order.currency,
        name: "Product Purchase",
        description: "Checkout Payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await api.post("/payments/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              message.success("🎉 Payment Successful!");
              dispatch(clearCart());
              dispatch(clearCheckout());
              setCartOpen(false);
              setStep(1);
            } else {
              message.error("❌ Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            message.error("❌ Payment verification error");
          }
        },
        theme: { color: "#0d3b66" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      message.error("❌ Payment failed to start");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", padding: "20px" }}>
      {/* Top Bar */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 30 }}>
        <Col xs={24} md={12}>
          <Search
            placeholder="Search for products..."
            allowClear
            enterButton="Search"
            size="large"
            onSearch={(val) => setSearchQuery(val)}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col>
          <Badge count={cart.length} offset={[10, 0]}>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={() => setCartOpen(true)}
              style={{ background: "#0d3b66" }}
            >
              Cart
            </Button>
          </Badge>
        </Col>
      </Row>

      {/* Products */}
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
                      onClick={() => handleAddToCart(item)}
                    >
                      🛒 Add to Cart
                    </Button>
                  </Card>
                </motion.div>
              </Col>
            ))
          ) : (
            <Text style={{ marginTop: 50 }}>No products found ❌</Text>
          )}
        </Row>
      )}

      {/* Cart Drawer */}
      <Drawer
        title={
          step === 1
            ? "🛍️ Your Cart"
            : step === 2
            ? "🏠 Shipping Address"
            : "🚚 Shipping & Payment"
        }
        placement="right"
        width={400}
        onClose={() => {
          setCartOpen(false);
          setStep(1);
        }}
        open={cartOpen}
      >
        {step === 1 && (
          <>
            {cart.length > 0 ? (
              <>
                <List
                  itemLayout="horizontal"
                  dataSource={cart}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveFromCart(item._id)}
                        >
                          Remove
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <img
                            src={item.image || "https://via.placeholder.com/60"}
                            alt={item.name}
                            style={{ width: 60, height: 60, objectFit: "cover" }}
                          />
                        }
                        title={`${item.name} (x${item.qty})`}
                        description={`₹ ${item.price} each`}
                      />
                    </List.Item>
                  )}
                />
                <div style={{ marginTop: 20, textAlign: "right" }}>
                  <Title level={4}>Total: ₹ {cartTotal}</Title>
                  <Button
                    type="primary"
                    size="large"
                    block
                    style={{ background: "#ff5722" }}
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            ) : (
              <Text>Your cart is empty 🛒</Text>
            )}
          </>
        )}

        {step === 2 && (
          <form onSubmit={handleAddressSubmit}>
            <Input name="address" placeholder="Address" required style={{ marginBottom: 10 }} />
            <Input name="city" placeholder="City" required style={{ marginBottom: 10 }} />
            <Input name="state" placeholder="State" required style={{ marginBottom: 10 }} />
            <Input name="zip" placeholder="ZIP Code" required style={{ marginBottom: 10 }} />
            <Input name="country" placeholder="Country" required style={{ marginBottom: 10 }} />
            <Button type="primary" htmlType="submit" block>
              Next: Shipping
            </Button>
          </form>
        )}

        {step === 3 && (
          <>
            <Title level={5}>Select Shipping Method</Title>
            <Radio.Group
              onChange={(e) => dispatch(setShippingMethod(e.target.value))}
              value={checkout.shippingMethod}
              style={{ marginBottom: 20 }}
            >
              <Radio value="standard">Standard Shipping (Free)</Radio>
              <Radio value="express">Express Shipping (+₹50)</Radio>
            </Radio.Group>
           <Button type="primary" block onClick={handlePayment}>
  Pay ₹ {finalTotal}
</Button>

          </>
        )}
      </Drawer>
    </div>
  );
}

export default PurchaseItem;
