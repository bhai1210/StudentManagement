import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";


// Animation Variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.25 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const hoverEffect = {
  scale: 1.03,
  transition: { duration: 0.3, ease: "easeInOut" },
};

// Mock user profile
const userProfile = {
  name: "Rahul Bhavsar",
  email: "rahul@example.com",
  phone: "+91 9876543210",
  address: "Ahmedabad, India",
};

// Mock order history
const orders = [
  { id: "ORD001", item: "Physics Book", amount: 450, status: "Delivered", date: "Aug 01" },
  { id: "ORD002", item: "Chemistry Book", amount: 550, status: "Shipped", date: "Aug 15" },
  { id: "ORD003", item: "Maths Guide", amount: 350, status: "Pending", date: "Aug 20" },
  { id: "ORD004", item: "Biology Notes", amount: 300, status: "Delivered", date: "Aug 22" },
];

// Group data for charts
const orderAmountData = orders.map((o) => ({
  date: o.date,
  amount: o.amount,
}));

const statusCount = orders.reduce((acc, o) => {
  acc[o.status] = (acc[o.status] || 0) + 1;
  return acc;
}, {});
const statusData = Object.keys(statusCount).map((key) => ({
  name: key,
  value: statusCount[key],
}));

const pieColors = ["#1976d2", "#26a69a", "#ef6c00"];

export default function UserDashboard() {
  return (
    <motion.main
      className="dashboard"
      variants={container}
      initial="hidden"
      animate="show"
      style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}
    >
      {/* Header */}
      <motion.header className="dashboard-header" variants={fadeUp}>
        <h1>👋 Welcome, {userProfile.name}</h1>
        <motion.div
          className="user-info"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p><b>Email:</b> {userProfile.email}</p>
          <p><b>Phone:</b> {userProfile.phone}</p>
          <p><b>Address:</b> {userProfile.address}</p>
        </motion.div>
      </motion.header>

      {/* Charts */}
      <motion.section className="charts-grid" variants={container}>
        {/* Order Amounts */}
        <motion.article
          className="chart-card"
          variants={fadeUp}
          whileHover={hoverEffect}
        >
          <h3>📈 Order Amounts</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={orderAmountData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#1976d2" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.article>

        {/* Order Status */}
        <motion.article
          className="chart-card"
          variants={fadeUp}
          whileHover={hoverEffect}
        >
          <h3>📊 Order Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </motion.article>
      </motion.section>
    </motion.main>
  );
}
