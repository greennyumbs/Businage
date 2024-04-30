"use client"
import Chart from "chart.js/auto"; 
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

function calProfitMonth(data) {
  const values = [];

  for (let month in MONTHS) {
    // filtering each month first
    let profitEachMonth = data.filter((item) => item.month == MONTHS[month]);
    if (profitEachMonth.length === 0) {
      values.push(null);
    } else {
      values.push(
        profitEachMonth.reduce((acc, curr) => acc + curr.profit, 0)
      );
    }
  }
  
  return values;
}

export default function ProfitGainByMonth() {
  const chartRef = useRef(null);
  const [existYear, setExistYear] = useState([]);
  const [selectedYear, setSelectedYear] = useState();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true)

  // Pull data
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios("/api/visualization/profit_gain_by_month");
      if (response.status !== 200) {
        console.log("LingChartCost bad response");
      } else {
        const data = response.data;
        setChartData(data);
      }
    };
    fetchData();
  }, []);

  useEffect(()=>{
    const allYear = [...new Set(chartData.map((cost) => cost.year))].sort(
      (a, b) => a - b
    ); // get list of year

    if (allYear.length !== 0) {
      // have data then make a list of exist year for dropdown {label: , value}
      setExistYear(labelValueAdapter(allYear));
    }
  }, [chartData])

  useEffect(()=>{
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    if(existYear.includes({label: String(currentYear), value: currentYear}))
    {
      setSelectedYear(currentYear)
    }
    else if(existYear.length !== 0)
    {
      
      setSelectedYear(existYear[0].value)
    }
    else
    {
      setSelectedYear()
    }
 
  }, [existYear])

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
    }
    const context = chartRef.current.getContext("2d");

    // Prepare data
    // Filtering year
    const filteredData =
      chartData.length === 0
        ? []
        : chartData.filter((data) => String(data.year) == selectedYear);
    // Find cost each month
    const displayData = calProfitMonth(filteredData)

    const newChart = new Chart(context, {
      type: "line",

      options: {
        plugins: {
          title: {
            display: true,
            text: "Profit gain by month",
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
              text: "Profit",
            },
          },
        },
      },
      data: {
        labels: MONTHS,

        datasets: [
          {
            label: "Profit",
            data: displayData,
            backgroundColor: "rgb(75, 192, 192)",
            borderColor: "rgb(75, 192, 192)",
          },
        ],
      },
    });

    chartRef.current.chart = newChart;
    setLoading(false);
  }, [chartData, selectedYear]); // change data everytime that selectedYear change

  return (
    <div className=" box mx-auto w-full max-w-[70rem] ">
      <div className="flex justify-between ">
        <h1 className=" font-bold">Profit gain by month</h1>
        {/* Year dropdown selection */}
        <div className=" w-60 ">
          <Select
            isLoading={loading}
            scrollShadowProps={{
              isEnabled: false,
            }}
            onChange={(e) => {
              setSelectedYear(e.target.value);
            }}
            size="sm"
            label="Select Year"
            selectedKeys={selectedYear === ""? []: [`${selectedYear}`]}
            placeholder={
                loading === true? "Loading...":
                existYear.length === 0 ? "No data" : "Show years"
            
            }
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