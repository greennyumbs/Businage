import React, { useState, useEffect } from 'react';
import { Card, CardBody } from "@nextui-org/react";

function MonetaryVisualizeCard() {
  const [monetaryData, setMonetaryData] = useState([]);
  const Url = "http://localhost:3000/api/visualization/";

  useEffect(() => {
    const fetchMonetaryData = async (url, title) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
          // Assuming data is an object with a single property containing the result
          const result = data[Object.keys(data)[0]] || "Loading...";
          setMonetaryData(prevData => [...prevData, { result, title }]);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMonetaryData(`${Url}total_sale`, "Total Sale");
    fetchMonetaryData(`${Url}total_cost`, "Total Cost");
    fetchMonetaryData(`${Url}total_profit`, "Total Profit");
  }, []);

  useEffect(() => {
    console.log("Monetary Data Updated:", monetaryData); // Logging updated state
  }, [monetaryData]);

  const list = [
    {
      result: monetaryData.length > 0 ? monetaryData[0].result : "Loading...",
      title: monetaryData.length > 0 ? monetaryData[0].title : "Total Sale",
    },
    {
      result: monetaryData.length > 1 ? monetaryData[1].result : "Loading...",
      title: monetaryData.length > 1 ? monetaryData[1].title : "Total Cost",
    },
    {
      result: monetaryData.length > 2 ? monetaryData[2].result : "Loading...",
      title: monetaryData.length > 2 ? monetaryData[2].title : "Total Profit",
    },
  ];

  return (
    <Card className="box">
      <CardBody className="p-0">
        <div className="grid grid-cols-3 gap-0">
          {list.map((item, index) => (
            <div key={index}>
              <Card className="border-none shadow-none rounded-none">
                <CardBody className="overflow-visible h-40 p-4 flex flex-col justify-center items-center text-center">
                  <b className="text-blue-500 text-5xl block">{item.result}</b>
                  <p>{item.title}</p>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default MonetaryVisualizeCard;
