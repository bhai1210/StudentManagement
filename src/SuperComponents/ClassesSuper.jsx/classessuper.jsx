import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
  Badge,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SchoolIcon from "@mui/icons-material/School";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion, AnimatePresence } from "framer-motion";

/** --------- D A T A --------- **/

const CATEGORIES = [
  { key: "std1to10", label: "Std 1–10" },
  { key: "std11_12_commerce", label: "Std 11–12 (Commerce)" },
  { key: "std11_12_science", label: "Std 11–12 (Science)" },
  { key: "bcom", label: "B.Com" },
  { key: "mcom", label: "M.Com" },
];

const COURSE_CATALOG = [
  // Std 1–10 (sample across classes)
  ...Array.from({ length: 10 }, (_, i) => {
    const std = i + 1;
    return {
      id: `s${std}`,
      title: `Standard ${std} – Complete Course`,
      category: "std1to10",
      level: std <= 5 ? "Foundation" : "Core",
      description:
        std <= 5
          ? "Build strong basics with engaging lessons in Math, English, EVS."
          : "Deepen understanding with Math, Science, English and Social Science.",
      price: std <= 5 ? 2999 : 3999,
      strikePrice: std <= 5 ? 3999 : 4999,
      sections: [
        { key: "math", label: "Mathematics", price: std <= 5 ? 999 : 1299 },
        { key: "sci", label: std <= 5 ? "EVS" : "Science", price: 1199 },
        { key: "eng", label: "English", price: 999 },
        ...(std > 5 ? [{ key: "sst", label: "Social Science", price: 1099 }] : []),
      ],
      theoryHighlights: [
        "NCERT-aligned notes",
        "Chapter-wise summaries",
        "Exam-focused question banks",
        "Weekly doubt-solving sessions",
      ],
      badge: std === 10 ? "Board Year" : undefined,
    };
  }),

  // Std 11–12 Commerce
  ...["11", "12"].flatMap((cls) => [
    {
      id: `c_${cls}_acc`,
      title: `Std ${cls} Commerce – Accounts Mastery`,
      category: "std11_12_commerce",
      level: "Advanced",
      description:
        "Financial statements, partnership, company accounts—complete with PYQs and solved examples.",
      price: 4999,
      strikePrice: 6999,
      sections: [
        { key: "fs", label: "Financial Statements", price: 1799 },
        { key: "partnership", label: "Partnership Accounts", price: 1699 },
        { key: "company", label: "Company Accounts", price: 1899 },
      ],
      theoryHighlights: [
        "Format-based scoring techniques",
        "Common adjustments cheat sheet",
        "Time-saving ledger shortcuts",
      ],
      badge: "Top Seller",
    },
    {
      id: `c_${cls}_eco`,
      title: `Std ${cls} Commerce – Economics Pro`,
      category: "std11_12_commerce",
      level: "Core",
      description:
        "Micro & Macro Economics with graphs, derivations, and model answers.",
      price: 4499,
      strikePrice: 6299,
      sections: [
        { key: "micro", label: "Microeconomics", price: 1699 },
        { key: "macro", label: "Macroeconomics", price: 1799 },
        { key: "stats", label: "Statistics for Economics", price: 1499 },
      ],
      theoryHighlights: [
        "Graph-plotting templates",
        "Elasticity quick reference",
        "Inflation & GDP caselets",
      ],
    },
    {
      id: `c_${cls}_bst`,
      title: `Std ${cls} Commerce – Business Studies Sprint`,
      category: "std11_12_commerce",
      level: "Core",
      description:
        "One-shots + case studies + HOTS for maximum board impact.",
      price: 4299,
      strikePrice: 5999,
      sections: [
        { key: "principles", label: "Principles of Management", price: 1599 },
        { key: "marketing", label: "Marketing Management", price: 1699 },
        { key: "planning", label: "Planning & Organising", price: 1499 },
      ],
      theoryHighlights: [
        "Mnemonic-based chapter recall",
        "Case-study frameworks",
        "Board-answer phrasing",
      ],
    },
  ]),

  // Std 11–12 Science
  ...["11", "12"].flatMap((cls) => [
    {
      id: `sci_${cls}_phy`,
      title: `Std ${cls} Science – Physics XL`,
      category: "std11_12_science",
      level: "Advanced",
      description:
        "Concept-first physics with numericals, error analysis, and examiner-style derivations.",
      price: 5499,
      strikePrice: 7499,
      sections: [
        { key: "mech", label: "Mechanics", price: 1999 },
        { key: "eem", label: "Electrostatics & Magnetism", price: 1999 },
        { key: "opt", label: "Optics & Modern Physics", price: 1899 },
      ],
      theoryHighlights: [
        "Derivation patterns",
        "Units & dimensions traps",
        "Graph interpretation toolkit",
      ],
      badge: "Exam Booster",
    },
    {
      id: `sci_${cls}_chem`,
      title: `Std ${cls} Science – Chemistry Prime`,
      category: "std11_12_science",
      level: "Core",
      description:
        "Physical, Organic, Inorganic—concise notes, mechanisms, and PYQ mapping.",
      price: 5299,
      strikePrice: 7199,
      sections: [
        { key: "phy", label: "Physical Chemistry", price: 1899 },
        { key: "org", label: "Organic Chemistry", price: 1999 },
        { key: "inorg", label: "Inorganic Chemistry", price: 1799 },
      ],
      theoryHighlights: [
        "Mechanism flowcharts",
        "Periodic p-d-f blocks quick tables",
        "Numerical shortcuts",
      ],
    },
    {
      id: `sci_${cls}_bio`,
      title: `Std ${cls} Science – Biology Edge`,
      category: "std11_12_science",
      level: "Core",
      description:
        "Diagrams-first biology with memory palaces and high-yield notes.",
      price: 4899,
      strikePrice: 6799,
      sections: [
        { key: "cell", label: "Cell & Biomolecules", price: 1699 },
        { key: "gen", label: "Genetics & Evolution", price: 1799 },
        { key: "human", label: "Human Physiology", price: 1799 },
      ],
      theoryHighlights: [
        "Labeling drills",
        "10-second recall tables",
        "Assertion–Reason pack",
      ],
    },
  ]),

  // B.Com & M.Com
  {
    id: "bcom_fin",
    title: "B.Com – Financial Accounting & Reporting",
    category: "bcom",
    level: "University",
    description:
      "Accounting standards, consolidation, cash flows—industry cases and mock tests.",
    price: 6499,
    strikePrice: 8999,
    sections: [
      { key: "as", label: "Accounting Standards", price: 2499 },
      { key: "consol", label: "Consolidation", price: 2399 },
      { key: "cf", label: "Cash Flow Statements", price: 1999 },
    ],
    theoryHighlights: [
      "AS/Ind-AS comparatives",
      "Exam report formats",
      "Common consolidation pitfalls",
    ],
    badge: "Placement Ready",
  },
  {
    id: "mcom_adv",
    title: "M.Com – Advanced Financial Management",
    category: "mcom",
    level: "Postgraduate",
    description:
      "Capital budgeting, risk-return, valuation models—case-heavy with spreadsheets.",
    price: 7999,
    strikePrice: 10999,
    sections: [
      { key: "capbud", label: "Capital Budgeting", price: 2899 },
      { key: "risk", label: "Risk & Portfolio", price: 2799 },
      { key: "val", label: "Valuation Models", price: 2899 },
    ],
    theoryHighlights: [
      "NPV/IRR edge cases",
      "Beta estimation caveats",
      "Valuation cross-check grid",
    ],
    badge: "Advanced",
  },
];

/** --------- U T I L S --------- **/

const currency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const gridStagger = {
  show: { transition: { staggerChildren: 0.05 } },
};

/** --------- M A I N   C O M P O N E N T --------- **/

export default function ClassesSuper() {
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [selectedSections, setSelectedSections] = useState({});
  const [cartCount, setCartCount] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COURSE_CATALOG.filter(
      (c) =>
        c.category === category &&
        (!q ||
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q))
    );
  }, [category, query]);

  const openBuy = (course) => {
    setActiveCourse(course);
    setSelectedSections({});
    setOpen(true);
  };

  const closeBuy = () => {
    setOpen(false);
    setActiveCourse(null);
    setSelectedSections({});
  };

  const toggleSection = (key) => {
    setSelectedSections((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  const sectionTotal = useMemo(() => {
    if (!activeCourse) return 0;
    return activeCourse.sections
      .filter((s) => selectedSections[s.key])
      .reduce((sum, s) => sum + s.price, 0);
  }, [activeCourse, selectedSections]);

  const handleCheckout = () => {
    // Hook up to your payment flow (Razorpay, Stripe, etc.)
    // For now, we just simulate adding to cart and closing.
    setCartCount((c) => c + 1);
    closeBuy();

    
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1300, mx: "auto" }}>
      {/* Header */}
      <Box
        component={motion.div}
        variants={fadeIn}
        initial="hidden"
        animate="show"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SchoolIcon />
          <Typography variant="h5" fontWeight={700}>
            Courses Store
          </Typography>
          <Tooltip title="Items added in last action">
            <Badge
              sx={{ ml: "auto" }}
              overlap="circular"
              badgeContent={cartCount}
              color="primary"
            >
              <ShoppingCartCheckoutIcon />
            </Badge>
          </Tooltip>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <ToggleButtonGroup
            value={category}
            exclusive
            onChange={(_, v) => v && setCategory(v)}
            sx={{
              flexWrap: "wrap",
              "& .MuiToggleButton-root": {
                borderRadius: 999,
                textTransform: "none",
                px: 1.8,
                py: 0.6,
              },
            }}
          >
            {CATEGORIES.map((c) => (
              <ToggleButton key={c.key} value={c.key}>
                {c.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Box
            sx={{
              ml: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexGrow: { xs: 1, md: 0 },
              minWidth: { xs: "100%", md: 320 },
            }}
          >
            <SearchIcon />
            <TextField
              fullWidth
              placeholder="Search course or topic…"
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Box>
        </Box>
      </Box>

      {/* Grid */}
      <Grid
        container
        spacing={2.5}
        component={motion.div}
        variants={gridStagger}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence initial={false}>
          {filtered.map((course) => (
            <Grid key={course.id} item xs={12} sm={6} md={4}>
              <motion.div
                variants={fadeIn}
                layout
                exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
              >
                <Card
                  elevation={3}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  {/* Banner */}
                  <Box
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      bgcolor: "linear-gradient(45deg, #e3f2fd, #fff)",
                      background:
                        "linear-gradient(135deg, rgba(25,118,210,0.08), rgba(25,118,210,0))",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocalOfferIcon fontSize="small" />
                      <Typography fontWeight={700} variant="body2">
                        {course.level}
                      </Typography>
                    </Box>
                    {course.badge && <Chip size="small" label={course.badge} color="primary" />}
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" fontWeight={700}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      {course.description}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 1 }}>
                      <Typography variant="h6" fontWeight={800}>
                        {currency(course.price)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        {currency(course.strikePrice)}
                      </Typography>
                      <Chip
                        label={`${Math.round(
                          ((course.strikePrice - course.price) / course.strikePrice) * 100
                        )}% off`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Extra Important Theory
                    </Typography>
                    <Accordion disableGutters elevation={0}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="body2">Quick Highlights</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {course.theoryHighlights.map((t, i) => (
                            <li key={i}>
                              <Typography variant="body2">{t}</Typography>
                            </li>
                          ))}
                        </ul>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
                    <Button onClick={() => openBuy(course)} variant="contained" endIcon={<ShoppingCartCheckoutIcon />}>
                      Buy
                    </Button>
                    <Button onClick={() => openBuy(course)} variant="text">
                      Buy particular section
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{ textAlign: "center", py: 6 }}
            >
              <Typography variant="h6" gutterBottom>
                No courses found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try a different search term or switch category.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Buy Modal */}
      <Dialog
        open={open}
        onClose={closeBuy}
        fullWidth
        maxWidth="md"
        TransitionComponent={motion.div}
        TransitionProps={{
          initial: { opacity: 0, y: 30, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 30, scale: 0.98 },
          transition: { duration: 0.25 },
        }}
        PaperProps={{
          sx: { borderRadius: 3, overflow: "hidden" },
          component: motion.div,
          initial: { y: 24, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 24, opacity: 0 },
          transition: { duration: 0.25 },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <SchoolIcon />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Checkout
            </Typography>
            <Typography variant="h6" fontWeight={800}>
              {activeCourse?.title}
            </Typography>
          </Box>
          <IconButton onClick={closeBuy}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {activeCourse && (
            <Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: 3 }}>
              {/* Full Course */}
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    Full Course Access
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Get the entire syllabus, notes, tests, and updates.
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
                    <Typography variant="h6" fontWeight={800}>
                      {currency(activeCourse.price)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textDecoration: "line-through" }}
                    >
                      {currency(activeCourse.strikePrice)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    onClick={handleCheckout}
                    endIcon={<CheckCircleIcon />}
                  >
                    Buy Full Course
                  </Button>
                </CardActions>
              </Card>

              {/* Particular Sections */}
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    Buy Particular Section
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Choose only the modules you need right now.
                  </Typography>

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
                          animate={{
                            scale: checked ? 1.01 : 1,
                          }}
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
                          <Typography variant="caption" color="text.secondary">
                            Click to {checked ? "remove" : "add"} this section
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography fontWeight={700}>Total</Typography>
                    <Typography variant="h6" fontWeight={900}>
                      {currency(sectionTotal)}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    disabled={sectionTotal === 0}
                    onClick={handleCheckout}
                    endIcon={<CheckCircleIcon />}
                  >
                    Buy Selected Sections
                  </Button>
                </CardActions>
              </Card>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: "auto" }}>
            Secured checkout • Instant access • GST invoice
          </Typography>
          <Button onClick={closeBuy}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Footer Note */}
      <Box sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
        <Typography variant="caption">
          Need a custom package (e.g., only Numericals in Physics + Accounts Ledger)? Contact support.
        </Typography>
      </Box>
    </Box>
  );
}
