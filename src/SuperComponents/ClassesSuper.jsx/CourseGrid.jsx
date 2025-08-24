import React from "react";
import { Grid, Card, CardContent, CardActions, Typography, Box, Chip, Divider, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function CourseGrid({ filtered, openBuy, currency }) {
  const fadeIn = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
  const gridStagger = { show: { transition: { staggerChildren: 0.05 } } };

  return (
    <Grid container spacing={2.5} component={motion.div} variants={gridStagger} initial="hidden" animate="show">
      <AnimatePresence initial={false}>
        {filtered.map((course) => (
          <Grid key={course.id} item xs={12} sm={6} md={4}>
            <motion.div variants={fadeIn} layout exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}>
              <Card elevation={3} sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3 }}>
                
                <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "rgba(166,124,82,0.1)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalOfferIcon fontSize="small" sx={{ color: "#a67c52" }} />
                    <Typography fontWeight={700} variant="body2" color="#a67c52">{course.level}</Typography>
                  </Box>
                  {course.badge && <Chip size="small" label={course.badge} sx={{ bgcolor: "#0d3b66", color: "#fff" }} />}
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" fontWeight={700}>{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{course.description}</Typography>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 1 }}>
                    <Typography variant="h6" fontWeight={800}>{currency(course.price)}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>{currency(course.strikePrice)}</Typography>
                    <Chip label={`${Math.round(((course.strikePrice - course.price) / course.strikePrice) * 100)}% off`} size="small" sx={{ borderColor: "#0d3b66", color: "#0d3b66" }} variant="outlined" />
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Extra Important Theory</Typography>
                  <Accordion disableGutters elevation={0} sx={{ "& .MuiAccordionSummary-expandIconWrapper": { color: "#a67c52" } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body2" color="#0d3b66">Quick Highlights</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {course.theoryHighlights.map((t, i) => (
                          <li key={i}><Typography variant="body2">{t}</Typography></li>
                        ))}
                      </ul>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
                  <Button onClick={() => openBuy(course)} variant="contained" sx={{ backgroundColor: "#0d3b66", "&:hover": { backgroundColor: "#092a4d" } }} endIcon={<ShoppingCartCheckoutIcon />}>Buy</Button>
                  <Button onClick={() => openBuy(course)} variant="text" sx={{ color: "#0d3b66" }}>Buy particular section</Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </AnimatePresence>

      {filtered.length === 0 && (
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" gutterBottom>No courses found</Typography>
            <Typography variant="body2" color="text.secondary">Try a different search term or switch category.</Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
}
