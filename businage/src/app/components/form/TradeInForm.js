"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";

const TradeInForm = ({ saleData, setHandleAction }) => {
  const [sizeData, setSizeData] = useState([
    {
      size_id: 0,
      income: null,
      quantity: null,
    },
  ]);
  // const [data, setData] = useState({
  //   totalIncome: null,
  //   size: [],
  // });
  const [totalIncome, setTotalIncome] = useState(0);
  const [total, setTotal] = useState(0);

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
    newSizeData[index][field] = parseInt(e.target.value);
    setSizeData(newSizeData);
  }

  function handleSizeID(value, index, field) {
    const newSizeData = [...sizeData];
    newSizeData[index][field] = parseInt(value);
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
    let sum = 0;
    let sumIncome = 0;

    // sizeData.forEach((data) => {
    //   total += data.income * data.quantity; // Calculate new totalIncome
    // });

    // setTotalIncome(total); // Update totalIncome
    // setData({ totalIncome: total, size: sizeData }); // Update data

    sizeData.forEach((data) => {
      // total += data.income * data.quantity; // Calculate new totalIncome
      sum += data.income * data.quantity;
      sumIncome += data.income;
    });

    setTotal(sum);
    setTotalIncome(sumIncome);

    const data = { totalIncome: sum, size: sizeData };
    // setTotalIncome(total); // Update totalIncome

    if (window.confirm("Are you sure that you want to insert?")) {
      if (data.totalIncome != 0) {
        await axios
          .post(`/api/trade_out_log`, data)
          .then((response) => {
            console.log(data);
            sum = 0;
            sumIncome = 0;
            setHandleAction(true);
            console.log(response);
            window.location.reload();
          })
          .catch((error) => console.log(error));
      }
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
            className="grid grid-flow-row grid-cols-2 gap-5 mt-5  p-5"
          >
            <Autocomplete
              allowsCustomValue={false}
              isRequired
              defaultItems={saleData}
              label="Size name"
              className="w-10/12"
              // selectedKey={data.size_id}
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
                variant="flat"
                color="danger"
                className="w-10/12 h-12 p-7"
                onClick={() => {
                  setSizeData((prevSizeData) =>
                    prevSizeData.filter((_, i) => i !== index)
                  );
                }}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <div className="flex justify-center">
          <Button className="mt-5  rounded-full" onClick={handleAdd}>
            Add
          </Button>
        </div>
        <div className="box w-full mt-10">
          Total are {currencyFormat(total)} and Total income are{" "}
          {currencyFormat(totalIncome)}
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
        <Button
          color="primary"
          type="submit"
          className="mt-10 w-full text-medium"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default TradeInForm;
