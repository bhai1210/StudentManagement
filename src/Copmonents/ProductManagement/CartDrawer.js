// src/components/CartDrawer.js
import React from "react";
import { Drawer, Button, List, Typography, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} from "../../features/cartSlice";

const { Text } = Typography;

function CartDrawer({ open, onClose, onCheckout }) {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);

  return (
    <Drawer
      title="Your Cart"
      placement="right"
      onClose={onClose}
      open={open}
      width={380}
    >
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button onClick={() => dispatch(decreaseQty(item.id))}>-</Button>,
              <Text>{item.quantity}</Text>,
              <Button onClick={() => dispatch(increaseQty(item.id))}>+</Button>,
              <Button danger onClick={() => dispatch(removeFromCart(item.id))}>
                Remove
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={`₹${item.price} x ${item.quantity}`}
            />
            <Text strong>₹{item.price * item.quantity}</Text>
          </List.Item>
        )}
      />

      <Space direction="vertical" style={{ width: "100%", marginTop: 20 }}>
        <Text strong>Total: ₹{totalAmount}</Text>
        <Button
          type="primary"
          block
          disabled={items.length === 0}
          onClick={onCheckout}
        >
          Proceed to Payment
        </Button>
        <Button block onClick={() => dispatch(clearCart())}>
          Clear Cart
        </Button>
      </Space>
    </Drawer>
  );
}

export default CartDrawer;
