import { Chart } from "chart.js/auto"
import { useEffect, useRef, useState } from "react"

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
    const [chartData, setChartData ]  = useState([])

    useEffect(()=>{
        const fetchData = async ()=>{
            const response = await fetch("https://65f846d5df151452460efe3c.mockapi.io/api/costByMonth")
            if(!response.ok)
            {
                console.log("LingChartCost bad response")
            }
            else{
                const data = await response.json()
                console.log(data)
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
                labels: MONTHS.slice(1, 8),
                
                datasets: [{
                    label: "Cost",
                    data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor: "rgb(75, 192, 192)",
                    borderColor: "rgb(75, 192, 192)",
                    
                }]
            }
        })

        chartRef.current.chart = newChart
    }, [])
    return (
        <div className=" box mx-auto w-full max-w-[70rem]">
            <h1 className=" font-bold">Product cost by month</h1>
            <canvas ref={chartRef} />
        </div>
    )
}