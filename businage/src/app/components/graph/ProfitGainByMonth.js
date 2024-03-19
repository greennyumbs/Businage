"use client"
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; 

const data = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  datasets: [
    {
      label: "Profit",
      data: [50, 40, 60, 70, 80, 100, 20, 45, 30, 110, 65, 25],
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      borderColor: "rgba(54, 162, 235, 1)"
    }
  ]
};

const config = {
  type: "line",
  data,
  options: {
    indexAxis: 'x',
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Month"
        }
      },
      y: {
        display: true,
        beginAtZero: true,
        title: {
          display: true,
          text: "Profit"
        }
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Profit Gain By Month',
        padding: { top: 10 },
        font: { size: 32, weight: 'bold' },
        align: 'start',
        position: 'top'
      }
    },
  },
};

function ProfitGainByMonth() {
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
      <canvas ref={chartRef} />
    </div>
  );
}

export default ProfitGainByMonth;
