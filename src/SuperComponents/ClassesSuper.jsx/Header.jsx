import React from "react";
import { AppBar, Toolbar, Typography, Box, Button, Badge } from "@mui/material";
import { motion } from "framer-motion";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

export default function AppHeader({ cartCount }) {
  return (
    <AppBar
      position="sticky"
      sx={{
       fontFamily: "Poppins, sans-serif",
    // minHeight: "100vh",
     background: "linear-gradient(120deg, #ffffff, #0d3b66,)",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.08)",
    overflowX: "hidden",
    position: "relative",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" fontWeight={700} color="#fff">
          Courses Store
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outlined"
              sx={{
                color: "#0d3b66",
                borderColor: "#0d3b66",
                "&:hover": { background: "#0d3b661a" },
              }}
            >
              Login
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0d3b66",
                color: "#fff",
                "&:hover": { backgroundColor: "#092c4b" },
              }}
            >
              Signup
            </Button>
          </motion.div>

          <Badge sx={{ ml: 2 }} badgeContent={cartCount} color="primary">
            <ShoppingCartCheckoutIcon sx={{ color: "#fff" }} />
          </Badge>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
