import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const data = {
  labels: ["3K Battery", "GS Battery", "Yuasa Battery", "Amaron", "FB Battery"],
  datasets: [
    {
      label: "Sale", 
      data: [50, 40, 60, 70, 80], 
      backgroundColor: "rgba(54, 162, 235, 0.5)", 
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};

const config = {
  type: "bar",
  data,
  options: {
    indexAxis: 'x', 
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Top 5 Product Sold',
        padding: { top: 10 },
        font: { size: 32, weight: 'bold' },
        align: 'start', 
        position: 'top', 
      },
    },
  },
};

function TopProductSold() {
  const chartRef = useRef(null);

  useEffect(() => {
    let newChart = null;

    const createChart = () => {
      if (chartRef.current) {
        if (chartRef.current.chart) {
          chartRef.current.chart.destroy();
        }
        const context = chartRef.current.getContext("2d");
        newChart = new Chart(context, config);
        chartRef.current.chart = newChart;
      }
    };

    createChart();

    const handleResize = () => {
      if (newChart) {
        newChart.resize(); 
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (newChart) {
        newChart.destroy();
      }
    };
  }, [config]);


  return (
    <div className="box mx-auto w-full max-w-[70rem]">
        <canvas ref={chartRef} ></canvas>
    </div>
  );
}

export default TopProductSold;
