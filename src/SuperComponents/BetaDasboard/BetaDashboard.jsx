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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import "./StudentDashboard.css";

// Animations
const fadeUp = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

// Mock student-specific data
const studentProfile = {
  name: "Rahul Bhavsar",
  class: "Class 12 (Science)",
  stream: "Science",
  feesPaidMTD: 8000,
  feesPending: 2000,
};

const attendanceMonthly = [
  { month: "Jan", attendance: 20 },
  { month: "Feb", attendance: 18 },
  { month: "Mar", attendance: 22 },
  { month: "Apr", attendance: 19 },
  { month: "May", attendance: 21 },
  { month: "Jun", attendance: 20 },
];

const courseProgress = [
  { name: "Physics", completed: 80 },
  { name: "Chemistry", completed: 70 },
  { name: "Maths", completed: 90 },
];

const pieColors = ["#1976d2", "#26a69a", "#ef6c00"];
const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function BetaDashboard() {
  return (
    <main className="dashboard" as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

      {/* Header */}
      <header className="dashboard-header" as={motion.div} variants={fadeUp} initial="hidden" animate="show">
        <h1>Welcome, {studentProfile.name}</h1>
        <div className="student-info">
          <p>Class: {studentProfile.class}</p>
          <p>Stream: {studentProfile.stream}</p>
        </div>
      </header>

      {/* Fees Info */}
      <section className="kpi-section" as={motion.div} variants={fadeUp}>
        <article className="kpi-card">
          <p className="kpi-label">Fees Paid (This Month)</p>
          <h2 className="kpi-value">{inr(studentProfile.feesPaidMTD)}</h2>
        </article>
        <article className="kpi-card">
          <p className="kpi-label">Pending Fees</p>
          <h2 className="kpi-value">{inr(studentProfile.feesPending)}</h2>
        </article>
      </section>

      {/* Charts */}
      <section className="charts-grid">
        <article className="chart-card" as={motion.div} variants={fadeUp}>
          <h3>Attendance per Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={attendanceMonthly}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1976d2" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#1976d2" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="attendance" stroke="#1976d2" fill="url(#attendanceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </article>

        <article className="chart-card" as={motion.div} variants={fadeUp}>
          <h3>Course Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={courseProgress}
                dataKey="completed"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                label
              >
                {courseProgress.map((entry, index) => (
                  <Cell key={index} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </article>
      </section>

    </main>
  );
}
