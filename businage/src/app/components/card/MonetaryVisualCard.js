import React, { useState, useEffect } from 'react';
import { Card, CardBody, Spinner,} from "@nextui-org/react";



function MonetaryVisualizeCard() {
  const Url = `/api/visualization/`;

  const [monetaryData, setMonetaryData] = useState([
    { result: <Spinner />, title: "Total Sale" },
    { result: <Spinner />, title: "Total Cost" },
    { result: <Spinner />, title: "Total Profit" }
  ]);

  const THbaht = new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  useEffect(() => {
    const fetchMonetaryData = async (url, title) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
          // Assuming data is an object with a single property containing the result
          const result = THbaht.format(data[Object.keys(data)[0]]) || "Loading...";
          return { result, title };
        } else {
          console.error("Failed to fetch data");
          return { result: "Error", title };
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        return { result: "Error", title };
      }
    };

    Promise.all([
      fetchMonetaryData(`/total_sale`, "Total Sale"),
      fetchMonetaryData(`/total_cost`, "Total Cost"),
      fetchMonetaryData(`/total_profit`, "Total Profit")
    ]).then(results => {
      setMonetaryData(results);
    });
  }, []);

  useEffect(() => {
    console.log("Monetary Data Updated:", monetaryData); // Logging updated state
  }, [monetaryData]);

  return (
    <Card className="box">
      <CardBody className="p-0">
        <div className="grid grid-cols-3 gap-0">
          {monetaryData.map((item, index) => (
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
