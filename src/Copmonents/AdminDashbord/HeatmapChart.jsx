import React from "react";

// Example Data (transactions per time slot and day)
const data = [
  [78, 21, 24, 88, 78, 84, 92], // 8AM–12PM
  [21, 57, 12, 21, 87, 78, 84], // 12PM–4PM
  [22, 44, 57, 93, 92, 44, 64], // 4PM–8PM
  [67, 24, 85, 0, 66, 92, 12],  // 8PM–12AM
  [24, 0, 56, 65, 12, 64, 92],  // 12AM–4AM
  [24, 67, 53, 44, 85, 66, 90], // 4AM–8AM
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeSlots = [
  "8AM – 12PM",
  "12PM – 4PM",
  "4PM – 8PM",
  "8PM – 12AM",
  "12AM – 4AM",
  "4AM – 8AM",
];

export default function HeatmapChart() {
  const maxValue = 100; // normalize to 0–100

  // Function to compute background color based on value
  const getColor = (value) => {
    const intensity = value / maxValue; // between 0 and 1
    const start = [230, 240, 255]; // light blue
    const end = [30, 90, 210]; // dark blue

    const r = Math.round(start[0] + (end[0] - start[0]) * intensity);
    const g = Math.round(start[1] + (end[1] - start[1]) * intensity);
    const b = Math.round(start[2] + (end[2] - start[2]) * intensity);

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: "12px",
        padding: "20px",
        maxWidth: "700px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h4 style={{ marginBottom: "20px", color: "#444" }}>
        Transactions by Hour
      </h4>

      <div style={{ display: "grid", gridTemplateColumns: "120px repeat(7, 1fr)", gap: "6px" }}>
        {/* Header row */}
        <div></div>
        {days.map((day) => (
          <div key={day} style={{ textAlign: "center", fontSize: "14px", color: "#666" }}>
            {day}
          </div>
        ))}

        {/* Data rows */}
        {data.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <div style={{ fontSize: "13px", color: "#555", textAlign: "right", paddingRight: "8px" }}>
              {timeSlots[rowIndex]}
            </div>
            {row.map((value, colIndex) => (
              <div
                key={colIndex}
                style={{
                  background: getColor(value),
                  color: value > 50 ? "white" : "#333",
                  borderRadius: "6px",
                  textAlign: "center",
                  fontSize: "13px",
                  padding: "8px 0",
                  transition: "all 0.6s ease",
                }}
              >
                {value}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
