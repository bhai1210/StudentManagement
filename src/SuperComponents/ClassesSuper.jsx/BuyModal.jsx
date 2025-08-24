import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Card, CardContent, CardActions, Button, Divider, IconButton } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

export default function BuyModal({ open, closeBuy, activeCourse, selectedSections, toggleSection, sectionTotal, handleCheckout, currency }) {
  return (
    <Dialog open={open} onClose={closeBuy} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <SchoolIcon />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">Checkout</Typography>
          <Typography variant="h6" fontWeight={800}>{activeCourse?.title}</Typography>
        </Box>
        <IconButton onClick={closeBuy}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {activeCourse && (
          <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 3 }}>
            {/* Full Course */}
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>Full Course Access</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Get the entire syllabus, notes, tests, and updates.</Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
                  <Typography variant="h6" fontWeight={800}>{currency(activeCourse.price)}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>{currency(activeCourse.strikePrice)}</Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button fullWidth size="large" variant="contained" onClick={handleCheckout} endIcon={<CheckCircleIcon />}>Buy Full Course</Button>
              </CardActions>
            </Card>

            {/* Particular Sections */}
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>Buy Particular Section</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Choose only the modules you need right now.</Typography>
                <Divider sx={{ mb: 1.5 }} />

                <Box sx={{ display: "grid", gap: 1.2 }}>
                  {activeCourse.sections.map((s) => {
                    const checked = !!selectedSections[s.key];
                    return (
                      <Box
                        key={s.key}
                        component={motion.button}
                        type="button"
                        onClick={() => toggleSection(s.key)}
                        initial={false}
                        animate={{ scale: checked ? 1.01 : 1 }}
                        whileTap={{ scale: 0.995 }}
                        style={{
                          textAlign: "left",
                          border: "1px solid rgba(0,0,0,0.12)",
                          borderRadius: 12,
                          padding: 12,
                          background: checked ? "rgba(25,118,210,0.06)" : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography fontWeight={600}>{s.label}</Typography>
                          <Typography>{currency(s.price)}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">Click to {checked ? "remove" : "add"} this section</Typography>
                      </Box>
                    );
                  })}
                </Box>

                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography fontWeight={700}>Total</Typography>
                  <Typography variant="h6" fontWeight={900}>{currency(sectionTotal)}</Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button fullWidth size="large" variant="outlined" disabled={sectionTotal === 0} onClick={handleCheckout} endIcon={<CheckCircleIcon />}>Buy Selected Sections</Button>
              </CardActions>
            </Card>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mr: "auto" }}>Secured checkout • Instant access • GST invoice</Typography>
        <Button onClick={closeBuy}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
