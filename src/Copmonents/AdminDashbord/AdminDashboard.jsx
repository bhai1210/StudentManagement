import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./AdminDashboard.css";
import TopItemsChart from "./myitemchart";
import HeatmapChart from "./HeatmapChart";

// ---- Animations ----
const fadeUp = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

// ---- Mock E-Commerce Data ----
const mockOverview = {
  totalOrders: 3200,
  activeProducts: 156,
  revenueMTD: 1860000,
  pendingOrders: 245,
};
const mockSalesMonthly = [
  { month: "Jan", sales: 420 },
  { month: "Feb", sales: 510 },
  { month: "Mar", sales: 650 },
  { month: "Apr", sales: 590 },
  { month: "May", sales: 720 },
  { month: "Jun", sales: 830 },
  { month: "Jul", sales: 910 },
  { month: "Aug", sales: 1020 },
  { month: "Sep", sales: 970 },
  { month: "Oct", sales: 880 },
  { month: "Nov", sales: 760 },
  { month: "Dec", sales: 1120 },
];
const mockCategories = [
  { name: "Electronics", value: 780 },
  { name: "Fashion", value: 620 },
  { name: "Home & Kitchen", value: 450 },
  { name: "Beauty", value: 310 },
];
const mockRevenueVsTarget = [
  { name: "Week 1", revenue: 450000, target: 500000 },
  { name: "Week 2", revenue: 380000, target: 500000 },
  { name: "Week 3", revenue: 520000, target: 500000 },
  { name: "Week 4", revenue: 510000, target: 500000 },
];
const mockRecentOrders = [
  { id: 1, customer: "Arjun Mehta", product: "Smartphone", amount: 25000, status: "Delivered" },
  { id: 2, customer: "Priya Sharma", product: "Sneakers", amount: 4500, status: "Shipped" },
  { id: 3, customer: "Vikram Singh", product: "Mixer Grinder", amount: 6200, status: "Pending" },
  { id: 4, customer: "Neha Kapoor", product: "Makeup Kit", amount: 1800, status: "Delivered" },
  { id: 5, customer: "Rohan Gupta", product: "Laptop", amount: 72000, status: "Cancelled" },
];

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
const pieColors = ["#1976d2", "#26a69a", "#ef6c00", "#9c27b0"];

export default function EcommerceDashboard() {
  const [overview] = useState(mockOverview);
  const [sales] = useState(mockSalesMonthly);
  const [categories] = useState(mockCategories);
  const [revenueVsTarget] = useState(mockRevenueVsTarget);
  const [recentOrders] = useState(mockRecentOrders);
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    if (!search) return recentOrders;
    const s = search.toLowerCase();
    return recentOrders.filter(
      (o) =>
        o.customer.toLowerCase().includes(s) ||
        o.product.toLowerCase().includes(s) ||
        String(o.amount).includes(s) ||
        o.status.toLowerCase().includes(s)
    );
  }, [search, recentOrders]);

  return (
    <main className="dashboard" as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      
      {/* Header */}
      <header className="dashboard-header" as={motion.div} variants={fadeUp} initial="hidden" animate="show">
        <h1>Admin Dashboard</h1>
       
      </header>

      {/* KPIs */}
      <section className="kpi-section" as={motion.div} variants={stagger} initial="hidden" animate="show">
        {[
          { label: "Total Orders", value: overview.totalOrders, chip: "+12%", chipColor: "green" },
          { label: "Active Products", value: overview.activeProducts, chip: "+8", chipColor: "blue" },
          { label: "Revenue (MTD)", value: inr(overview.revenueMTD), chip: "On track", chipColor: "teal" },
          { label: "Pending Orders", value: overview.pendingOrders, chip: "Action needed", chipColor: "orange" },
        ].map((kpi, idx) => (
          <article key={idx} className="kpi-card" as={motion.div} variants={fadeUp} whileHover={{ scale: 1.05 }}>
            <p className="kpi-label">{kpi.label}</p>
            <h2 className="kpi-value">{kpi.value}</h2>
            <span className={`chip chip-${kpi.chipColor}`}>{kpi.chip}</span>
          </article>
        ))}
      </section>

<TopItemsChart />
      {/* Charts */}
      <section className="charts-grid">
        <article className="chart-card" as={motion.div} variants={fadeUp} initial="hidden" animate="show">
          <h3>Monthly Sales</h3>
          <div className="chart-box">
            <ResponsiveContainer>
              <AreaChart data={sales}>
                <defs>
                  <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976d2" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#1976d2" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#1976d2" fill="url(#c1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="chart-card" as={motion.div} variants={fadeUp} initial="hidden" animate="show">
          <h3>Category Distribution</h3>
          <div className="chart-box">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                  {categories.map((entry, index) => (
                    <Cell key={index} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
      <HeatmapChart />

      {/* Revenue vs Target + Orders */}
      <section className="charts-grid">
        <article className="chart-card" as={motion.div} variants={fadeUp} initial="hidden" animate="show">
          <h3>Revenue vs Target</h3>
          <div className="chart-box">
            <ResponsiveContainer>
              <BarChart data={revenueVsTarget}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => inr(Number(v))} />
                <Legend />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="#42a5f5" />
                <Bar dataKey="target" radius={[6, 6, 0, 0]} fill="#90caf9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="chart-card" as={motion.div} variants={fadeUp} initial="hidden" animate="show">
          <h3>Recent Orders</h3>
          <div className="payments-list">
            {filteredOrders.map((o) => (
              <motion.div key={o.id} className="payment-item" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                  <p className="payment-student">{o.customer}</p>
                  <small>{o.product}</small>
                </div>
                <div className="payment-right">
                  <span className="payment-amount">{inr(o.amount)}</span>
                  <span className={`status status-${o.status.toLowerCase()}`}>{o.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
