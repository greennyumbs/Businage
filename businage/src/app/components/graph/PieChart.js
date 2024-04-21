import { Chart } from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { type } from "os";

export default function PieChart() {
  const chartRef = useRef(null);

  const [data, setData] = useState([]);

  // Query Data function
  async function fetchData() {
    try {
      const response = await axios.get("/api/visualization/profit_proportion");
      const data = response.data;
      setData(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Pie Chart prep
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
    }
    const context = chartRef.current.getContext("2d");

    // Setup label & data
    const labels = data.mainGroup?.map((prod) => prod.product_name);
    const values = data.mainGroup
      ?.map((prod) => prod.percentage)
    
    if(labels?.length !== 0 && values?.length !== 0)
    {
      // Fill the others part piechart
      labels?.push("Others");

      values?.push(
        data.othersGroup?.reduce(
          (acc, curr) => acc + curr.percentage,
          0
        )
      );
    }

    

    const newChart = new Chart(context, {
      type: "pie",

      options: {
        plugins: {
          title: {
            display: true,
            text: "Profit proportion by products (%)",
          },
        },
      },
      data: {
        labels: labels, // change

        datasets: [
          {
            label: "Percentage (%)",
            data: values,
            
          },
        ],
      },
    });

    chartRef.current.chart = newChart;
  }, [data]);
  return (
    <div className=" box mx-auto w-96">
      <h1 className=" font-bold">Profit proportion by products (%)</h1>
      <canvas ref={chartRef} />
    </div>
  );
}
