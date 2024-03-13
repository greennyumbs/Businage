"use client";
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
        font: { size: 16, weight: 'bold' },
        align: 'start', 
        position: 'top', 
      },
    },
  },
};

function TopProductSold() {
  const chartRef = useRef(null);
  
  useEffect(() => {
    let chartInstance = null;
    if(chartRef.current){
      const context = chartRef.current.getContext("2d");
      if (Chart.getChart(context)) {
        Chart.getChart(context).destroy();
      }
      chartInstance = new Chart(context, config);
    }
    return () => {
      if (chartInstance !== null) {
        chartInstance.destroy();
      }
    };
  }, [config]);


  return (
    <div className="mt-5 mx-auto w-10/12">
      <div className="bg-white rounded-none shadow-none p-4">
        <canvas ref={chartRef} id="myChart" className="mx-4"></canvas>
      </div>
    </div>
  );
}

export default TopProductSold;
