import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function StudentViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`https://student-management-backend-node-rd8.vercel.app/api/students/${id}`);
      setStudent(res.data);
    } catch (err) {
      toast.error("Failed to fetch student data");
    }
  };

  if (!student) return null;

  // Fields to exclude
  const excludedFields = ["_id", "__v", "createdAt", "updatedAt"];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Box
        sx={{
          p: 4,
          maxWidth: 600,
          mx: "auto",
          bgcolor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        <Typography variant="h4" sx={{ mb: 2 }}>
          Student Details
        </Typography>

        {Object.entries(student)
          .filter(([key]) => !excludedFields.includes(key))
          .map(([key, value]) => (
            <Typography key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
            </Typography>
          ))}

        <Button variant="outlined" sx={{ mt: 3 }} onClick={() => navigate("/students")}>
          Back to List
        </Button>
      </Box>
    </motion.div>
  );
}
