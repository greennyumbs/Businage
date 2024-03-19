"use client"
import { Chart } from "chart.js/auto"
import { useEffect, useRef, useState } from "react"
import { Select, SelectSection, SelectItem } from "@nextui-org/react";
import axios from "axios";

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export default function LineChartCost() {
    const chartRef = useRef(null)
    const [existYear, setExistYear] = useState([{ label: "All Years", value: "all" }])
    const [chartData, setChartData] = useState([])
    const [selectedYear, setSelectedYear] = useState("all")


    // Pull data
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios("https://65f846d5df151452460efe3c.mockapi.io/api/costByMonth")
            if (response.status !== 200) {
                console.log("LingChartCost bad response")
            }
            else {
                const data = response.data
                setChartData(data)

            }
        }
        fetchData()


    }, [])



    useEffect(() => {
        if (chartRef.current) {
            if (chartRef.current.chart) {
                chartRef.current.chart.destroy()
            }
        }
        const context = chartRef.current.getContext("2d")

        // Prepare Dropdown Year
        // Need to check since the exist year is undefined at the end (don't know why)
        if (existYear.length == 1) {
            setExistYear(prev => {
                if (prev.length == 1) {
                    return (prev.concat([... new Set((chartData.map(data => (new Date(data.date)).getFullYear())).sort())])).map(data => {
                        if (!data.hasOwnProperty("label")) {
                            return { label: data, value: data }
                        }
                        else {
                            return data
                        }
                    })

                }

            })

        }
        // existYear.push(... new Set((chartData.map(data=> (new Date(data.date)).getFullYear())).sort()))

        // existYear.push(... new Set((chartData.map(data=> (new Date(data.date)).getFullYear())).sort()))
        // console.log(existYear)





        // existYear.map(data=>{
        //     if(!data.hasOwnProperty("label")){
        //         return {label: data, value: data}
        //         }
        //         else{
        //             return data
        //         }
        //     })

        // Prepare data
        const data = chartData.map((data) => data.cost).splice(0, 12)


        const newChart = new Chart(context, {
            type: "line",

            options: {

                plugins: {
                    title: {
                        display: true,
                        text: "Product cost by month"
                    }
                },
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
                        title: {
                            display: true,
                            text: "Cost"
                        }
                    },
                }

            },
            data: {
                labels: MONTHS,

                datasets: [{
                    label: "Cost",
                    data: data,
                    backgroundColor: "rgb(75, 192, 192)",
                    borderColor: "rgb(75, 192, 192)",

                }]
            }
        })

        chartRef.current.chart = newChart
    }, [chartData])

    useEffect(() => { console.log(existYear) }, [existYear])
    return (
        <div className=" box mx-auto w-full max-w-[70rem] ">
            <div className="flex justify-between ">
                <h1 className=" font-bold">Product cost by month</h1>
                {/* Year dropdown selection */}
                <div className=" w-60 ">
                    <Select
                        scrollShadowProps={{
                            isEnabled: false
                        }}
                        onChange={(e) => { setSelectedYear(e.target.value) }}
                        defaultSelectedKeys={[selectedYear]}
                        size="sm"
                        label="Select Year"
                        placeholder="All Years"
                    >
                        {
                            existYear.map((year) => {
                                return (
                                    <SelectItem
                                        key={year.value}
                                        value={year.value}
                                    >
                                        {String(year.label)}
                                    </SelectItem>

                                )
                            })
                        }
                    </Select>

                </div>

            </div>
            <canvas ref={chartRef} />
        </div>
    )
}