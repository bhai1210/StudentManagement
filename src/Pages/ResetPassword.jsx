import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://student-management-backend-node-rd8.vercel.app/auth/reset-password", {
        token,
        password,
      });
      toast.success(res.data.message || "Password reset successful!");
      setPassword("");
      setTimeout(() => navigate("/login"), 2000); // redirect after 2s
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section style={{ height: "100vh" }}>
        <Container maxWidth="xl" sx={{ height: "100%" }}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ height: "100%" }}
          >
            {/* Left Image */}
            <Grid item md={6} lg={6} xl={5}>
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                alt="Reset Password illustration"
                style={{ width: "100%", height: "auto" }}
              />
            </Grid>

            {/* Right Form */}
            <Grid item xs={12} md={6} lg={6} xl={4}>
              <Paper
                elevation={6}
                sx={{ p: 4, borderRadius: 3, bgcolor: "#fff" }}
              >
                {/* Social Buttons */}
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                >
                  <Typography variant="body1" fontWeight="bold">
                    Reset via
                  </Typography>
                  <Button variant="contained" color="primary" size="small">
                    F
                  </Button>
                  <Button variant="contained" color="primary" size="small">
                    T
                  </Button>
                  <Button variant="contained" color="primary" size="small">
                    in
                  </Button>
                </Box>

                {/* Divider */}
                <Box
                  display="flex"
                  alignItems="center"
                  my={3}
                  sx={{ gap: 2 }}
                >
                  <Box sx={{ flex: 1, height: 1, bgcolor: "#eee" }}></Box>
                  <Typography variant="body2" color="text.secondary">
                    Or
                  </Typography>
                  <Box sx={{ flex: 1, height: 1, bgcolor: "#eee" }}></Box>
                </Box>

                {/* Reset Password Form */}
                <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
                  Reset Password
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  display="flex"
                  flexDirection="column"
                  gap={2}
                >
                  <TextField
                    type="password"
                    label="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ mt: 1, py: 1.2 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Footer */}
       
      </section>

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
