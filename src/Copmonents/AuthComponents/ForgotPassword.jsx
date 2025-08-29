import { useState } from "react";
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

import api from "../../Services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "Password reset link sent! Check your email.");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          bgcolor: "linear-gradient(135deg, #e6f2f9, #f9fbfd)", // ✅ lighter clean bg
          px: 2,
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            {/* Left Image - hidden on xs */}
            <Grid item md={6} lg={6} xl={5} sx={{ display: { xs: "none", md: "block" } }}>
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                alt="Forgot Password illustration"
                style={{ width: "100%", height: "auto" }}
              />
            </Grid>

            {/* Right Form */}
            <Grid item xs={12} md={6} lg={5} xl={4}>
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  bgcolor: "#fff",
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  mb={2}
                  textAlign="center"
                  color="#0d3b66" // ✅ brand color
                >
                  Forgot Password
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={3}
                  textAlign="center"
                >
                  Enter your registered email to receive a password reset link.
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  display="flex"
                  flexDirection="column"
                  gap={2}
                >
                  <TextField
                    type="email"
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      mt: 1,
                      py: 1.3,
                      fontWeight: "bold",
                      borderRadius: "12px",
                      backgroundColor: "#0d3b66", // ✅ brand button
                      boxShadow: "0px 4px 14px rgba(13, 59, 102, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#094067", // ✅ darker hover
                        transform: "translateY(-2px)",
                        boxShadow: "0px 6px 18px rgba(13, 59, 102, 0.4)",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </Box>
              </Paper>

              {/* Footer */}
              <Typography
                variant="caption"
                display="block"
                textAlign="center"
                mt={3}
                color="text.secondary"
              >
                © {new Date().getFullYear()} Your Company. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
