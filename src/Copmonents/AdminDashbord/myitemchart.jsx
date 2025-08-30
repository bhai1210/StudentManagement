import React, { useEffect, useState } from "react";

const salesData = [
  { name: "Item A", value: 120 },
  { name: "Item B", value: 90 },
  { name: "Item C", value: 70 },
  { name: "Item D", value: 50 },
  { name: "Item E", value: 40 },
];

export default function TopItemsChart() {
  const [animatedValues, setAnimatedValues] = useState(
    salesData.map(() => 0)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues(salesData.map((d) => d.value));
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(...salesData.map((d) => d.value));

  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: "10px",
        padding: "20px",
        maxWidth: "500px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h4 style={{ marginBottom: "20px", color: "#444" }}>Top Items by Sales</h4>
      {salesData.map((item, index) => (
        <div
          key={item.name}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          {/* Item Name */}
          <div style={{ width: "90px", fontSize: "14px", color: "#555" }}>
            {item.name}
          </div>

          {/* Bar */}
          <div
            style={{
              flex: 1,
              background: "linear-gradient(to right, #f5f7fa, #e6ecf5)",
              borderRadius: "20px",
              height: "16px",
              margin: "0 10px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(animatedValues[index] / maxValue) * 100}%`,
                background: "linear-gradient(90deg, #e0ecff, #407BFF)",
                transition: "width 1s ease-in-out",
                borderRadius: "20px",
              }}
            />
          </div>

          {/* Value */}
          <div style={{ minWidth: "40px", fontSize: "14px", color: "#333" }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
