import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { getLast7Days } from "../../lib/features";

ChartJS.register(
  CategoryScale,
  Tooltip,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend
);


const labels = getLast7Days();

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({value=[]}) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Message",
        fill: true,
        backgroundColor: "rgba(75, 192, 192,0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };
  return <Line data={data} options={lineChartOptions} />;
};



const doughnutChartOptions = {
    responsive: true,
    plugins:{
        legend:{
            display:false
        },
        title:{
            display: false
        }
    },
    cutout: 120,
}

const DoughnutChart = ({ value = [], labels = [] }) => {
    const data = {
        labels,
        datasets: [
            {
                data: value.length ? value : [300, 50, 100], // Fallback data if no value provided
                backgroundColor: [
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(255, 165, 0, 0.2)", // Assuming 'orange' is a color code
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 165, 0, 1)", // Assuming 'orange' is a color code
                ],
                hoverBackgroundColor: ["green", "yellow"],
                borderWidth: 1,
                offset: 40
            },
        ],
    };

    return <Doughnut style={{zIndex:10}} data={data} options={doughnutChartOptions} />;
};

export { DoughnutChart, LineChart };

