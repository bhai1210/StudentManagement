import React, { useState, useMemo } from "react";
import { Box ,Typography } from "@mui/material";
import { motion } from "framer-motion";

import AppHeader from "./Header";
import CourseFilter from "./CourseFilter";
import CourseGrid from "./CourseGrid";
import BuyModal from "./BuyModal";




const CATEGORIES = [
  { key: "std1to10", label: "Std 1–10" },
  { key: "std11_12_commerce", label: "Std 11–12 (Commerce)" },
  { key: "std11_12_science", label: "Std 11–12 (Science)" },
  { key: "bcom", label: "B.Com" },
  { key: "mcom", label: "M.Com" },
];




// FULL COURSE_CATALOG ARRAY
const COURSE_CATALOG = [
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



export default function ClassesSuper() {
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [selectedSections, setSelectedSections] = useState({});
  const [cartCount, setCartCount] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COURSE_CATALOG.filter(c => c.category === category && (!q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)));
  }, [category, query]);

  const openBuy = course => { setActiveCourse(course); setSelectedSections({}); setOpen(true); };
  const closeBuy = () => { setOpen(false); setActiveCourse(null); setSelectedSections({}); };
  const toggleSection = key => setSelectedSections(prev => { const next = { ...prev }; if (next[key]) delete next[key]; else next[key] = true; return next; });
  const sectionTotal = useMemo(() => activeCourse ? activeCourse.sections.filter(s => selectedSections[s.key]).reduce((sum, s) => sum + s.price, 0) : 0, [activeCourse, selectedSections]);
  const handleCheckout = () => { setCartCount(c => c + 1); closeBuy(); };
  const currency = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
  <Box
  sx={{
    fontFamily: "Poppins, sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(120deg, #ffffff, #0d3b66,)",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.08)",
    overflowX: "hidden",
    position: "relative",
  }}
>
  {/* subtle rotating radial */}
  <motion.div
    animate={{ rotate: [0, 360] }}
    transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
    style={{
      position: "absolute",
      width: 1200,
      height: 1200,
      borderRadius: "50%",
      background:
        "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05), transparent 70%)",
      top: "-500px",
      left: "-500px",
      zIndex: 0,
    }}
  />

  {/* <AppHeader cartCount={cartCount} /> */}

  <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1300, mx: "auto", position: "relative", zIndex: 5 }}>
    <CourseFilter
      CATEGORIES={CATEGORIES}
      category={category}
      setCategory={setCategory}
      query={query}
      setQuery={setQuery}
      cartCount={cartCount}
    />

    <CourseGrid filtered={filtered} openBuy={openBuy} currency={currency} />

    <BuyModal
      open={open}
      closeBuy={closeBuy}
      activeCourse={activeCourse}
      selectedSections={selectedSections}
      toggleSection={toggleSection}
      sectionTotal={sectionTotal}
      handleCheckout={handleCheckout}
      currency={currency}
    />

    <Box sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
      <Typography variant="caption">Need a custom package? Contact support.</Typography>
    </Box>
  </Box>
</Box>

  );
}