import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion"; // <- import framer-motion

export default function StudentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", age: "", email: "", class: "", school: "", address: "", fees: "", phoneNumber: ""
  });

  useEffect(() => {
    if (id) fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`https://student-management-backend-node-rd8.vercel.app/api/students/${id}`);
      setForm(res.data);
    } catch (err) {
      toast.error("Failed to fetch student data");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (id) {
        await axios.put(`https://student-management-backend-node-rd8.vercel.app/api/students/${id}`, form);
        toast.success("Student updated successfully");
      } else {
        await axios.post("https://student-management-backend-node-rd8.vercel.app/api/students", form);
        toast.success("Student added successfully");
      }
      navigate("/students");
    } catch (err) {
      toast.error(err.response?.data?.error || "Operation failed");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, ease: "easeOut", duration: 0.5 } },
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Box sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <motion.h1 variants={fieldVariants}>{id ? "Update Student" : "Add Student"}</motion.h1>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <motion.div variants={fieldVariants}>
            <TextField name="name" label="Name" value={form.name} onChange={handleChange} fullWidth />
          </motion.div>
          <motion.div variants={fieldVariants}>
            <TextField name="age" label="Age" type="number" value={form.age} onChange={handleChange} fullWidth />
          </motion.div>
          <motion.div variants={fieldVariants}>
            <TextField name="email" label="Email" value={form.email} onChange={handleChange} fullWidth />
          </motion.div>
          <motion.div variants={fieldVariants}>
            <FormControl fullWidth>
              <InputLabel>Class / Course</InputLabel>
              <Select name="class" value={form.class} onChange={handleChange} label="Class / Course">
                <MenuItem value="">Select</MenuItem>
                {Array.from({ length: 12 }, (_, i) => <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>)}
                <MenuItem value="BCom">BCom</MenuItem>
                <MenuItem value="MCom">MCom</MenuItem>
              </Select>
            </FormControl>
          </motion.div>
          <motion.div variants={fieldVariants}>
            <TextField name="school" label="School" value={form.school} onChange={handleChange} fullWidth />
          </motion.div>
          <motion.div variants={fieldVariants}>
            <TextField name="address" label="Address" value={form.address} onChange={handleChange} fullWidth />
          </motion.div>
          <motion.div variants={fieldVariants}>
            <TextField name="fees" label="Fees" type="number" value={form.fees} onChange={handleChange} fullWidth />
          </motion.div>
          <motion.div variants={fieldVariants}>
            <TextField name="phoneNumber" label="Phone Number" value={form.phoneNumber} onChange={handleChange} fullWidth />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button variant="contained" onClick={handleSubmit}>{id ? "Update" : "Add"}</Button>
              <Button variant="outlined" onClick={() => navigate("/students")}>Cancel</Button>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
}
