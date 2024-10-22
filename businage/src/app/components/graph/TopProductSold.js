import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";




const config = {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Sale",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    indexAxis: "x",
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

function TopProductSold() {
  const chartRef = useRef(null);
  const [data, setData] = useState(config.data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await fetch(`/api/visualization/top_products_sold`);
        const apiData = await response.json();

        
        const topProducts = apiData.slice(0, 5);
        const labels = topProducts.map((item) => `${item.product_name} (${item.brand_name})`);
        const quantities = topProducts.map((item) => item.total_quantity);

        setData({
          labels: labels,
          datasets: [{ ...config.data.datasets[0], data: quantities }],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); 

  useEffect(() => {
    let newChart = null;

    const createChart = () => {
      if (chartRef.current) {
        if (chartRef.current.chart) {
          chartRef.current.chart.destroy();
        }
        const context = chartRef.current.getContext("2d");
        newChart = new Chart(context, {
          type: config.type,
          data: data,
          options: config.options,
        });
        chartRef.current.chart = newChart;
      }
    };

    createChart();

    return () => {
      if (newChart) {
        newChart.destroy();
      }
    };
  }, [data]);

  return (
    <div className="flex-[2]">

      <p className="font-bold text-2xl flex">Top 5 Product Sold</p>

      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default TopProductSold;
