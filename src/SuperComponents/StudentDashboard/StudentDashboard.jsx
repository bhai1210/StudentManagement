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
import "./StudentDashboard.css";

// ---- Animations ----
const fadeUp = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

// ---- Mock Data ----
const mockOverview = {
  totalStudents: 1240,
  activeCourses: 36,
  feesCollectedMTD: 823500,
  pendingDues: 196000,
};
const mockAdmissionsMonthly = [
  { month: "Jan", admissions: 62 },
  { month: "Feb", admissions: 74 },
  { month: "Mar", admissions: 85 },
  { month: "Apr", admissions: 69 },
  { month: "May", admissions: 92 },
  { month: "Jun", admissions: 110 },
  { month: "Jul", admissions: 97 },
  { month: "Aug", admissions: 128 },
  { month: "Sep", admissions: 116 },
  { month: "Oct", admissions: 103 },
  { month: "Nov", admissions: 88 },
  { month: "Dec", admissions: 95 },
];
const mockStreams = [
  { name: "Science", value: 520 },
  { name: "Arts", value: 430 },
  { name: "Information Tech", value: 290 },
];
const mockFeesVsTarget = [
  { name: "Week 1", collected: 210000, target: 250000 },
  { name: "Week 2", collected: 190000, target: 250000 },
  { name: "Week 3", collected: 220000, target: 250000 },
  { name: "Week 4", collected: 203500, target: 250000 },
];
const mockRecentPayments = [
  { id: 1, student: "Aarav Patel", course: "Class 12 (Science)", amount: 8000, status: "Paid" },
  { id: 2, student: "Ishita Sharma", course: "Class 11 (Arts)", amount: 7000, status: "Paid" },
  { id: 3, student: "Rahul Mehta", course: "Class 10", amount: 4800, status: "Pending" },
  { id: 4, student: "Neha Gupta", course: "Class 9", amount: 4600, status: "Paid" },
  { id: 5, student: "Zoya Khan", course: "Class 11 (IT)", amount: 7000, status: "Failed" },
];

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
const pieColors = ["#1976d2", "#26a69a", "#ef6c00"];

export default function StudentDashboard() {
  const [overview] = useState(mockOverview);
  const [admissions] = useState(mockAdmissionsMonthly);
  const [streams] = useState(mockStreams);
  const [feesVsTarget] = useState(mockFeesVsTarget);
  const [recentPayments] = useState(mockRecentPayments);
  const [search, setSearch] = useState("");

  const filteredPayments = useMemo(() => {
    if (!search) return recentPayments;
    const s = search.toLowerCase();
    return recentPayments.filter(
      (p) =>
        p.student.toLowerCase().includes(s) ||
        p.course.toLowerCase().includes(s) ||
        String(p.amount).includes(s) ||
        p.status.toLowerCase().includes(s)
    );
  }, [search, recentPayments]);

  return (
    <main className="dashboard" as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      
      {/* Header */}
      <header className="dashboard-header" as={motion.div} variants={fadeUp} initial="hidden" animate="show">
        <h1>Student Management Dashboard</h1>
        <div className="actions">
          <input
            type="text"
            placeholder="Search payments, courses, students…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-primary">New Admission</button>
        </div>
      </header>

      {/* KPIs */}
      <section className="kpi-section" as={motion.div} variants={stagger} initial="hidden" animate="show">
        {[
          { label: "Total Students", value: overview.totalStudents, chip: "+3.2%", chipColor: "green" },
          { label: "Active Courses", value: overview.activeCourses, chip: "+2", chipColor: "blue" },
          { label: "Fees Collected (MTD)", value: inr(overview.feesCollectedMTD), chip: "On track", chipColor: "teal" },
          { label: "Pending Dues", value: inr(overview.pendingDues), chip: "Action needed", chipColor: "orange" },
        ].map((kpi, idx) => (
          <article key={idx} className="kpi-card" as={motion.div} variants={fadeUp} whileHover={{ scale: 1.05 }}>
            <p className="kpi-label">{kpi.label}</p>
            <h2 className="kpi-value">{kpi.value}</h2>
            <span className={`chip chip-${kpi.chipColor}`}>{kpi.chip}</span>
          </article>
        ))}
      </section>

      {/* Charts */}
      <section className="charts-grid">
        <article className="chart-card" as={motion.div} variants={fadeUp} initial="hidden" animate="show">
          <h3>Admissions per Month</h3>
          <div className="chart-box">
            <ResponsiveContainer>
              <AreaChart data={admissions}>
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
                <Area type="monotone" dataKey="admissions" stroke="#1976d2" fill="url(#c1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="chart-card" as={motion.div} variants={fadeUp} initial="hidden" animate="show">
          <h3>Stream Distribution</h3>
          <div className="chart-box">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={streams} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                  {streams.map((entry, index) => (
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

      {/* Fees vs Target + Payments */}
      <section className="charts-grid">
        <article className="chart-card" as={motion.div} variants={fadeUp} initial="hidden" animate="show">
          <h3>Fees Collected vs Target</h3>
          <div className="chart-box">
            <ResponsiveContainer>
              <BarChart data={feesVsTarget}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => inr(Number(v))} />
                <Legend />
                <Bar dataKey="collected" radius={[6, 6, 0, 0]} fill="#42a5f5" />
                <Bar dataKey="target" radius={[6, 6, 0, 0]} fill="#90caf9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="chart-card" as={motion.div} variants={fadeUp} initial="hidden" animate="show">
          <h3>Recent Payments</h3>
          <div className="payments-list">
            {filteredPayments.map((p) => (
              <motion.div key={p.id} className="payment-item" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                  <p className="payment-student">{p.student}</p>
                  <small>{p.course}</small>
                </div>
                <div className="payment-right">
                  <span className="payment-amount">{inr(p.amount)}</span>
                  <span className={`status status-${p.status.toLowerCase()}`}>{p.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </article>
      </section>

      {/* Footer */}
      {/* <footer className="footer-btn">
        <motion.button className="btn-primary" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          Go to Payments
        </motion.button>
      </footer> */}
    </main>
  );
}
