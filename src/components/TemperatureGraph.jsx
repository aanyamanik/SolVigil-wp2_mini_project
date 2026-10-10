import React, { useState } from "react";

/**
 * Temperature Trend Line Graph built with Native SVG and React.
 * Strictly adheres to restrictions: No charting libraries used.
 */
function TemperatureGraph({ hourlyData = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!hourlyData || hourlyData.length === 0) {
    return (
      <div className="trend-graph-card empty-graph">
        <p>No hourly temperature data available for graph plotting.</p>
      </div>
    );
  }

  // Use up to 16 hourly intervals for optimal readability on screen
  const displayData = hourlyData.slice(0, 16);

  // SVG Coordinates and Dimensions
  const svgWidth = 840;
  const svgHeight = 260;
  const paddingLeft = 55;
  const paddingRight = 35;
  const paddingTop = 35;
  const paddingBottom = 45;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Compute scale boundaries
  const temperatures = displayData.map((d) => d.temperature);
  const minObserved = Math.min(...temperatures);
  const maxObserved = Math.max(...temperatures);

  const yMin = Math.floor(minObserved / 2) * 2 - 2;
  const yMax = Math.ceil(maxObserved / 2) * 2 + 2;
  const yRange = yMax - yMin || 1;

  // Mapping helpers
  const getX = (index) => {
    if (displayData.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (displayData.length - 1)) * chartWidth;
  };

  const getY = (temp) => {
    return paddingTop + chartHeight - ((temp - yMin) / yRange) * chartHeight;
  };

  // Generate SVG path for the line
  const linePoints = displayData.map((d, i) => `${getX(i)},${getY(d.temperature)}`);
  const linePath = `M ${linePoints.join(" L ")}`;

  // Area fill path beneath the curve
  const areaPath = `${linePath} L ${getX(displayData.length - 1)},${paddingTop + chartHeight} L ${getX(0)},${paddingTop + chartHeight} Z`;

  // Generate horizontal Y-axis gridlines
  const gridSteps = 4;
  const gridLines = [];
  for (let i = 0; i <= gridSteps; i++) {
    const val = Math.round(yMin + (i * yRange) / gridSteps);
    const yPos = getY(val);
    gridLines.push({ value: val, y: yPos });
  }

  return (
    <section className="temperature-graph-section" aria-label="Temperature Trend Graph">
      <div className="section-heading-row">
        <div>
          <h2>Temperature Trend Trajectory</h2>
          <p>Hourly forecast temperature and heat-stress progression</p>
        </div>
        <div className="graph-badge">
          <span className="live-indicator">●</span> Future Forecast (Open-Meteo)
        </div>
      </div>

      <div className="trend-graph-card">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="trend-svg"
          role="img"
          aria-label="Hourly temperature trend graph"
        >
          <defs>
            <linearGradient id="heatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f57c00" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f57c00" stopOpacity="0.02" />
            </linearGradient>
            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {gridLines.map((grid, idx) => (
            <g key={idx} className="grid-line-group">
              <line
                x1={paddingLeft}
                y1={grid.y}
                x2={svgWidth - paddingRight}
                y2={grid.y}
                stroke="#e5e7eb"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 10}
                y={grid.y + 4}
                textAnchor="end"
                className="axis-label y-axis-label"
              >
                {grid.value}°C
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#heatGradient)" />

          {/* Temperature trend line */}
          <path
            d={linePath}
            fill="none"
            stroke="#ea580c"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points and Interaction Circles */}
          {displayData.map((point, index) => {
            const cx = getX(index);
            const cy = getY(point.temperature);
            const isHovered = hoveredPoint && hoveredPoint.index === index;

            return (
              <g key={index} className="data-point-group">
                {/* Vertical guideline on hover */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingTop}
                    x2={cx}
                    y2={paddingTop + chartHeight}
                    stroke="#ea580c"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6.5 : 4}
                  fill={isHovered ? "#ea580c" : "#ffffff"}
                  stroke="#ea580c"
                  strokeWidth={isHovered ? 3 : 2.5}
                  className="trend-point"
                  tabIndex={0}
                  role="button"
                  aria-label={`${point.time}: ${point.temperature}°C, Risk ${point.risk}`}
                  onMouseEnter={() => setHoveredPoint({ ...point, x: cx, y: cy, index })}
                  onFocus={() => setHoveredPoint({ ...point, x: cx, y: cy, index })}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onBlur={() => setHoveredPoint(null)}
                />

                {/* X-Axis Time Labels (rendered every 2nd or 3rd hour to avoid crowding) */}
                {(index % 2 === 0 || index === displayData.length - 1) && (
                  <text
                    x={cx}
                    y={paddingTop + chartHeight + 22}
                    textAnchor="middle"
                    className="axis-label x-axis-label"
                  >
                    {point.time}
                  </text>
                )}
              </g>
            );
          })}

          {/* Dynamic Interactive Tooltip */}
          {hoveredPoint && (
            <g
              transform={`translate(${Math.min(
                Math.max(hoveredPoint.x - 70, 10),
                svgWidth - 150
              )}, ${Math.max(hoveredPoint.y - 75, 10)})`}
              className="svg-tooltip-group"
              filter="url(#shadowFilter)"
            >
              <rect
                width="140"
                height="62"
                rx="8"
                fill="#1f2937"
                opacity="0.95"
              />
              <text x="12" y="20" fill="#f3f4f6" fontSize="12" fontWeight="600">
                {hoveredPoint.time} • {hoveredPoint.icon}
              </text>
              <text x="12" y="38" fill="#ffffff" fontSize="15" fontWeight="bold">
                {hoveredPoint.temperature}°C
                <tspan fontSize="11" fill="#9ca3af" fontWeight="normal">
                  {" "}
                  (Feels {hoveredPoint.apparentTemperature}°C)
                </tspan>
              </text>
              <text x="12" y="53" fill={getRiskColor(hoveredPoint.risk)} fontSize="11" fontWeight="bold">
                ● Risk: {hoveredPoint.risk}
              </text>
            </g>
          )}
        </svg>

        <div className="graph-footer-note">
          <span>* Hourly values reflect forecasted meteorological parameters from Open-Meteo.</span>
          <span>Hover or focus data points to inspect detailed thermal metrics.</span>
        </div>
      </div>
    </section>
  );
}

function getRiskColor(risk) {
  switch (risk) {
    case "Extreme":
      return "#ef4444";
    case "High":
      return "#f97316";
    case "Moderate":
      return "#eab308";
    case "Low":
    default:
      return "#22c55e";
  }
}

export default TemperatureGraph;
