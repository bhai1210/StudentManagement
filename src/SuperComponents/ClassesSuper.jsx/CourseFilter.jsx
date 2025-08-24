import React from "react";
import { Box, Typography, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Badge, InputAdornment } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

export default function CourseFilter({ CATEGORIES, category, setCategory, query, setQuery, cartCount }) {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" }, 
        alignItems: { xs: "stretch", md: "center" }, 
        gap: 3, 
        mb: 4, 
        p: 3, 
        borderRadius: 3, 
        backgroundColor: "#fff", 
        boxShadow: "0px 4px 15px rgba(0,0,0,0.08)"
      }}
    >
      
      {/* Title + Cart */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <SchoolIcon sx={{ color: "#0d3b66", fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700} color="#0d3b66">Courses</Typography>
        <Tooltip title="Items in cart">
          <Badge 
            sx={{ ml: "auto" }} 
            overlap="circular" 
            badgeContent={cartCount} 
            color="success"
          >
            <ShoppingCartCheckoutIcon sx={{ color: "#0d3b66" }} />
          </Badge>
        </Tooltip>
      </Box>

      {/* Filters + Search */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", flexGrow: 1 }}>
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={(_, v) => v && setCategory(v)}
          sx={{
            flexWrap: "wrap",
            "& .MuiToggleButton-root": {
              borderRadius: 999,
              textTransform: "none",
              px: 2,
              py: 0.7,
              color: "#0d3b66",
              borderColor: "#03db66",
              fontWeight: 500,
              "&.Mui-selected": { backgroundColor: "#0d3b66", color: "#fff" },
              "&:hover": { backgroundColor: "#0d3b66", color: "#fff" },
              boxShadow: "0px 2px 6px rgba(0,0,0,0.08)"
            },
          }}
        >
          {CATEGORIES.map((c) => (
            <ToggleButton sx={{marginRight:"15px"}} key={c.key} value={c.key}>{c.label}</ToggleButton>
          ))}
        </ToggleButtonGroup>
{/* 
        <TextField
          fullWidth
          placeholder="Search course or topic…"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#03db66" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            input: { color: "#0d3b66", fontWeight: 500 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              "& fieldset": { borderColor: "#03db66" },
              "&:hover fieldset": { borderColor: "#03db66" },
              "&.Mui-focused fieldset": { borderColor: "#03db66" },
            },
            boxShadow: "0px 2px 8px rgba(0,0,0,0.05)"
          }}
        /> */}
      </Box>
    </Box>
  );
}
