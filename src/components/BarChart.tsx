"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import type { ChartOptions, ChartData as ChartDataType } from "chart.js";
import { formatPrice } from "@/utils/formatPrice";

ChartJS.register(
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
);

interface Props {
  data: ChartData[] | undefined;
}

type ChartData = {
  day: string;
  date: string;
  totalAmount: number;
};

const BarChart = ({ data }: Props) => {
  if (!data) return <></>;
  const labels = data?.map((item) => item.day);
  const amounts = data?.map((item) => item.totalAmount);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Sales Amount",
        data: amounts,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return formatPrice(+value);
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Last Month Sales",
        font: {
          size: 24,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
