"use client";
import React from "react";
import { Card, CardBody } from "@nextui-org/react";

const list = [
  {
    result: "Battery",
    title: "Most product sold",
  },
  {
    result: "Kong",
    title: "Least product sold",
  },
];

function ProductVisualizeCard() {
  return (
    <div>
      <Card className="mt-4 mr-4 ml-4 rounded-none shadow-none">
        <CardBody className="p-0">
          <div className="grid grid-cols-2 gap-0">
            {list.map((item, index) => (
              <div key={index}>
                <Card className="border-none shadow-none rounded-none">
                  <CardBody className="overflow-visible h-40 p-4 flex flex-col justify-center items-center text-center">
                    <b className="text-blue-500 text-5xl block">
                      {item.result}
                    </b>
                    <p>{item.title}</p>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ProductVisualizeCard;
