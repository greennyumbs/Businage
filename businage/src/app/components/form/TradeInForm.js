"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";

const TradeInForm = ({ saleData }) => {
  const [sizeData, setSizeData] = useState([
    {
      size_id: null,
      income: null,
      quantity: null,
    },
  ]);
  // const [data, setData] = useState({
  //   totalIncome: null,
  //   size: [],
  // });
  const [totalIncome, setTotalIncome] = useState(0);

  // useEffect(() => {
  //   console.log(data);
  // }, [data.totalIncome, data.size, submit]);

  // const [quantity, setQuantity] = useState(null);
  // const [income, setIncome] = useState(null);
  // const [sizeID, setSizeID] = useState(null);
  // console.log(saleData[0].size_name);

  //To change the key data in the object into array
  // const [sizeList, setSizeList] = useState([]);
  // useEffect(() => {
  //   const sizeLists = saleData.map((element) => {
  //     return element.size_name;
  //   });
  //   setSizeList(Array.from(new Set(sizeLists)));
  // }, [saleData]);

  function currencyFormat(num) {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(num);
  }

  function handleChange(e, index, field) {
    const newSizeData = [...sizeData];
    newSizeData[index][field] = e.target.value;
    setSizeData(newSizeData);
  }

  function handleSizeID(value, index, field) {
    const newSizeData = [...sizeData];
    newSizeData[index][field] = value;
    setSizeData(newSizeData);
  }

  const handleAdd = () => {
    setSizeData((prevSizeData) => [
      ...prevSizeData,
      {
        size_id: null,
        income: null,
        quantity: null,
      },
    ]);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    let total = 0;

    sizeData.forEach((data) => {
      total += data.income * data.quantity; // Calculate new totalIncome
    });

    setTotalIncome(total); // Update totalIncome
    // setData({ totalIncome: total, size: sizeData }); // Update data

    const data = { totalIncome: total, size: sizeData };

    if (window.confirm("Are you sure that you want to insert?")) {
      // console.log(data);
      await axios
        .post("http://localhost:3000/api/trade_out_log", data)
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    }
  }

  return (
    <div className="box w-auto mx-20">
      <p className="pt-4 font-bold text-2xl flex">Trade-Out Form</p>
      {/* Need to be searchable and query from  */}
      {/* <Input isRequired label="Product name" className="w-1/2" /> */}
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        {sizeData.map((data, index) => (
          <div
            key={index}
            className="grid grid-flow-row grid-cols-2 gap-5 mt-5  p-5 "
          >
            <Autocomplete
              isRequired
              defaultItems={saleData}
              label="Size name"
              className="w-10/12"
              selectedKey={data.size_id}
              onSelectionChange={(value) =>
                handleSizeID(value, index, "size_id")
              }
              // onChange={(e) => handleChange(e, index, size_id)}
            >
              {(size) => (
                <AutocompleteItem key={size.size_id}>
                  {size.size_name}
                </AutocompleteItem>
              )}
            </Autocomplete>
            {/* <Input isRequired type="number" label="Size ID" className="w-10/12" /> */}
            <Input
              isRequired
              type="number"
              label="Quantity"
              min={0}
              className="w-10/12"
              placeholder="0"
              // onValueChange={setQuantity}
              onChange={(e) => handleChange(e, index, "quantity")}
              value={data.quantity}
              endContent={<p className="text-default-400">Pcs</p>}
            />
            <Input
              isRequired
              type="number"
              label="Income"
              min={0}
              className="w-10/12"
              placeholder="1000"
              // onValueChange={setIncome}
              onChange={(e) => handleChange(e, index, "income")}
              value={data.income}
              endContent={<p className="text-default-400">Baht</p>}
            />
            {index !== 0 && (
              <Button
                type="submit"
                variant="flat"
                color="danger"
                className="w-10/12 h-12 p-7"
                onClick={() =>
                  setSizeData((prevSizeData) =>
                    prevSizeData.filter((_, i) => i !== index)
                  )
                }
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        {/* <div className=" text-gray-200 font-bold">
          _________________________________________________________________________________________________________________________________________________________________________________________________
        </div> */}
        <Button type="add" className="mt-5" onClick={handleAdd}>
          +
        </Button>
        <div className="box w-full mt-10">
          Total are {currencyFormat(totalIncome)}
          {
            //1. Map all data that associate with income and quantity
            //2. Condition => All quantity and income need to be filled ==> Calculatable
            //3.
          }
          {/* {sizeData.map((data) => {
            data.income === null || data.quantity === null
              ? currencyFormat(0)
              : currencyFormat(data.income * data.quantity);
          })} */}
          {/* {income === null || quantity === null
            ? currencyFormat(0)
            : currencyFormat(income * quantity)} */}
        </div>
        <Button color="primary" type="submit" className="mt-10 w-full">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default TradeInForm;
