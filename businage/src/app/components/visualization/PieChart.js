import { Chart } from "chart.js/auto"
import { useEffect, useRef } from "react"

export default function PieChart() {
    const chartRef = useRef(null)
    useEffect(() => {
        if (chartRef.current) {
            if (chartRef.current.chart) {
                chartRef.current.chart.destroy()
            }
        }
        const context = chartRef.current.getContext("2d")
        const newChart = new Chart(context, {
            type: "pie",

            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Profit proportion by products (%)"
                    }
                },
                
            },
            data: {
                labels: ["kuy1", "kuy2", "kuy3"],
                
                datasets: [{
                    label: "Dick size",
                    data: [49, 52, 56],
                    backgroundColor: [
                        "#D37676",
                        "#A5DD9B",
                        "#BBE2EC"
                    ],
                    
                }]
            }
        })

        chartRef.current.chart = newChart
    }, [])
    return (
        <div className=" box mx-auto w-96">
            <h1 className=" font-bold">Profit proportion by products (%)</h1>
            <canvas ref={chartRef} />
        </div>
    )
}