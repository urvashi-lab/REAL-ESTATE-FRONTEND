import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ChartView({ data, metric }) {
  console.log("ChartView received data:", data);
  console.log("ChartView received metric:", metric);

  if (!data || !data.labels) {
    console.log("ChartView: No data or labels found");
    return <div className="alert alert-warning">No chart data available</div>;
  }

  // ✅ Handle both formats: series (multi-area) or values (single-area)
  const datasets = data.series
    ? data.series.map((series, index) => ({
        label: series.name.toUpperCase(),
        data: series.data,
        borderColor: `hsl(${index * 60}, 70%, 50%)`, // Different colors for each area
        backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.2)`,
        tension: 0.1,
      }))
    : [
        {
          label: metric ? metric.replace("_", " ").toUpperCase() : "Value",
          data: data.values || [],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
        },
      ];

  const chartData = {
    labels: data.labels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${metric ? metric.replace("_", " ").toUpperCase() : "Trend"} Over Time`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="card p-3 shadow-sm">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default ChartView;
