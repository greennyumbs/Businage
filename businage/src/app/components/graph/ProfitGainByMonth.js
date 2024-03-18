import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  datasets: [
    {
      label: "Profit", 
      data: [50, 40, 60, 70, 80, 100, 20, 45, 30, 110, 65, 25], 
      backgroundColor: "rgba(54, 162, 235, 0.5)", 
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};

const config = {
  type: "line",
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
        text: 'Profit Gain By Month',
        padding: { top: 10 },
        font: { size: 32, weight: 'bold' },
        align: 'start', 
        position: 'top', 
      },
    },
  },
};

function ProfitGainByMonth() {
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
    <div className="w-full md:w-10/12">
      <div className="bg-white rounded-none shadow-none p-4">
        <canvas ref={chartRef} className="mx-4"></canvas>
      </div>
    </div>
  );
}

export default ProfitGainByMonth;
