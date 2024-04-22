"use client";
import { Chart } from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/react";
import axios, { all } from "axios";

const MONTHS = [
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
  "December",
];

function labelValueAdapter(allYear) {
  const converted = allYear.map((year) => {
    return { label: String(year), value: year };
  });
  return converted;
}

function calCostMonth(data) {
  const values = [];

  for (let month in MONTHS) {
    // filtering each month first
    let costEachMonth = data.filter((item) => item.month == month);
    if (costEachMonth.length === 0) {
      values.push(null);
    } else {
      values.push(
        costEachMonth.reduce((acc, curr) => acc + curr.total_cost, 0)
      );
    }
  }
  return values;
}

export default function LineChartCost() {
  const chartRef = useRef(null);
  const [existYear, setExistYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState();
  const [chartData, setChartData] = useState([]);

  // Pull data
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios("/api/visualization/product_cost_by_month");
      if (response.status !== 200) {
        console.log("LingChartCost bad response");
      } else {
        const data = response.data;
        setChartData(data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
    }
    const context = chartRef.current.getContext("2d");

    // Prepare Dropdown Year
    // Need to check since the exist year is undefined at the end (don't know why)
    // if (existYear.length == 1) {
    //     setExistYear(prev => {
    //         if (prev.length == 1) {
    //             return (prev.concat([... new Set((chartData.map(data => (new Date(data.date)).getFullYear())).sort())])).map(data => {
    //                 if (!data.hasOwnProperty("label")) {
    //                     return { label: data, value: data }
    //                 }
    //                 else {
    //                     return data
    //                 }
    //             })

    //         }

    //     })

    // }

    const allYear = [...new Set(chartData.map((cost) => cost.year))].sort(
      (a, b) => a - b
    );

    if (allYear.length !== 0) {
      // have data then make a list of exist year for dropdown
      setExistYear(labelValueAdapter(allYear));
    }

    // Prepare data
    // Filtering year
    const filteredData =
      chartData.length === 0
        ? []
        : chartData.filter((data) => String(data.year) == selectedYear);
    // Find cost each month
    const displayData = calCostMonth(filteredData)


    const newChart = new Chart(context, {
      type: "line",

      options: {
        plugins: {
          title: {
            display: true,
            text: "Product cost by month",
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Month",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Cost",
            },
          },
        },
      },
      data: {
        labels: MONTHS,

        datasets: [
          {
            label: "Cost",
            data: displayData,
            backgroundColor: "rgb(75, 192, 192)",
            borderColor: "rgb(75, 192, 192)",
          },
        ],
      },
    });

    chartRef.current.chart = newChart;
  }, [chartData, selectedYear]); // change data everytime that selectedYear change

  return (
    <div className=" box mx-auto w-full max-w-[70rem] ">
      <div className="flex justify-between ">
        <h1 className=" font-bold">Product cost by month</h1>
        {/* Year dropdown selection */}
        <div className=" w-60 ">
          <Select
            scrollShadowProps={{
              isEnabled: false,
            }}
            onChange={(e) => {
              setSelectedYear(e.target.value);
            }}
            // defaultSelectedKeys={[selectedYear]}
            size="sm"
            label="Select Year"
            placeholder={existYear.length === 0 ? "No data" : "Show years"}
          >
            {existYear.map((year) => {
              return (
                <SelectItem key={year.value} value={year.value}>
                  {String(year.label)}
                </SelectItem>
              );
            })}
          </Select>
        </div>
      </div>
      <canvas ref={chartRef} />
    </div>
  );
}
