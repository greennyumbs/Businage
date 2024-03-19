import React from 'react';
import { Card, CardBody } from "@nextui-org/react";

const list = [
    {
      result: "30",
      title: "Total Sale",
    },
    {
      result: "60",
      title: "Total Cost",
    },
    {
      result: "24",
      title: "Total Profit",
    },
];

function MonetaryVisualizeCard() {
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
