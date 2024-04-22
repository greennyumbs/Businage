import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";

function ProductVisualizeCard() {
  const [products, setProducts] = useState([]);
  const Url = "http://localhost:3000/api/visualization/";

  useEffect(() => {
    const fetchProduct = async (url, title) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          // Extract the product_name from the first item of the data array
          const productName = data[0]?.product_name || "";
          setProducts(prevProducts => [...prevProducts, { result: productName, title }]);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProduct(`${Url}top_products_sold`, "Most product sold");
    fetchProduct(`${Url}least_products_sold`, "Least product sold");
  }, []);

  const list = [
    {
      result: products.length > 0 ? products[0].result : "Loading...",
      title: products.length > 0 ? products[0].title : "Most product sold",
    },
    {
      result: products.length > 1 ? products[1].result : "Loading...",
      title: products.length > 1 ? products[1].title : "Least product sold",
    },
  ];

  return (
    <Card className="box">
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
  );
}

export default ProductVisualizeCard;
