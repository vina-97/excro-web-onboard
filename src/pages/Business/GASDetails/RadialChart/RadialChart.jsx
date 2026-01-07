import Chart from "react-apexcharts";
import { getStatus } from "../../../../utils";

const RiskScoreChart = ({ score, webCrawl, from = "" }) => {
  let safeValue = score || 0;
  const MAX_VALUE = 100;
  const MIN_VALUE = 0;
  const VALUE_MINUS_20 = -20;
  const VALUE_MINUS_10 = -10;

  if (typeof safeValue === "string") {
    safeValue = Number(safeValue.replace("%", ""));
  }
  if (isNaN(safeValue) || safeValue < MIN_VALUE) {
    safeValue = MIN_VALUE;
  }
  if (safeValue > MAX_VALUE) {
    safeValue = MAX_VALUE;
  }

  const chartOptions = {
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        hollow: { size: "65%" },
        track: {
          background: "#E5E5E5",
          strokeWidth: "100%",
          margin: 0,
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "11px",
            fontWeight: 600,
            offsetY: 20,
            color: "#666",
            formatter: () => (from !== "parent" ? "RISK SCORE" : ""),

            // formatter: () => '',
          },
          value: {
            fontSize: "20px",
            fontWeight: 700,
            offsetY: from !== "parent" ? VALUE_MINUS_20 : VALUE_MINUS_10,
            formatter: (val) => `${Number(val).toFixed(0)}%`,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        gradientToColors: ["#6D96F9"],
        stops: [0, MAX_VALUE],
      },
    },
    colors: ["#946BF8"],
    stroke: { lineCap: "round" },
    labels: ["RISK SCORE"],
  };

  const chartSeries = [safeValue];

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: "200px", height: "200px" }}>
        {(() => {
          try {
            return (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="radialBar"
                height={200}
                width={200}
              />
            );
          } catch (err) {
            console.error("Chart render error:", err);
            return (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                Failed to load chart
              </div>
            );
          }
        })()}

        {/* Marker circle using CSS rotation */}
        {/* <div
          className="absolute w-4 h-4 bg-white rounded-full border-2 border-[#4A90E2] shadow-sm z-10"
          style={{
            top: '39%',
            left: '45%',
            transform: `rotate(${rotation}deg) translateX(85px) rotate(-${rotation}deg)`,
            transformOrigin: 'center center',
          }}
        /> */}
      </div>

      {/* Risk status */}
      {webCrawl?.risk_indicator?.risk_level && (
        <span
          className={`${getStatus(webCrawl?.risk_indicator?.risk_level).className} font-semibold text-lg capitalize mt-2`}
        >
          {getStatus(webCrawl?.risk_indicator?.risk_level).text}
        </span>
      )}
    </div>
  );
};

export default RiskScoreChart;
