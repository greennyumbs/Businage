"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/react";
import axios from "axios";
import { type } from "os";

const NEXT_PUBLIC_BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;


export default function EditModal({
  formName,
  row,
  isOpen,
  setIsOpen,
  setHandleAction,
}) {
  // const [brandName, setBrandName] = useState(row.Brand.brand_name);
  const [productName, setProductName] = useState(row.product_name);
  const [sellPrice, setSellPrice] = useState(row.sell_price);
  const [quantity, setQuantity] = useState(row.quantity);
  const [sellingStatus, setSellingStatus] = useState(row.selling_status);
  // const [editData, setEditData] = useState(row);
  let editData = row;
  delete editData.Brand;
  delete editData.latest_update;

  const handleEdit = async () => {
    if (
      window.confirm(
        `Are you sure you want to edit ${JSON.stringify(row.product_name)}`
      )
    ) {
      //Logic Area => Pass all value to API
      // editData.Brand.brand_name = brandName;
      // console.log(typeof sellPrice);
      editData.product_name = productName;
      editData.sell_price = sellPrice * 1;
      editData.quantity = quantity * 1;
      editData.selling_status = sellingStatus;
      // editData.avg_cost = 100.123;
      // editData.latest_update = new Date().toISOString();
      console.log(editData);

      await axios.put(`${NEXT_PUBLIC_BASE_API_URL}/api/products`, {
        product: editData,
      });
      setHandleAction(true);
      setIsOpen(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="top-center"
    >
      <ModalContent>
        <ModalHeader>{formName}</ModalHeader>
        <ModalBody className="grid grid-cols-1 gap-5">
          {/* <Input
            autoFocus
            label="Brand Name"
            placeholder={row.Brand.brand_name}
            value={brandName}
            onValueChange={(val) => setBrandName(val)}
          /> */}
          <Input
            autoFocus
            label="Product Name"
            placeholder={row.product_name}
            value={productName}
            onValueChange={(val) => setProductName(val)}
          />
          <Input
            label="Sell Price"
            type="number"
            placeholder={String(row.sell_price)}
            value={sellPrice}
            onValueChange={(val) => setSellPrice(val)}
          />
          <Input
            label="Quantity"
            type="number"
            placeholder={String(row.quantity)}
            value={quantity}
            onValueChange={(val) => setQuantity(val)}
          />
          <Autocomplete
            label="Selling Status"
            placeholder={editData.selling_status ? "In stock" : "Not available"}
            defaultSelectedKey={editData.selling_status}
            selectedKey={sellingStatus}
            onSelectionChange={setSellingStatus}
          >
            <AutocompleteItem key={true} className="text-green-500">
              In stock
            </AutocompleteItem>
            <AutocompleteItem key={false} className="text-red-600">
              Not available
            </AutocompleteItem>
          </Autocomplete>
          {/* <Input
            label="Selling Status (กู ขก. ทำ Dropdown)"
            placeholder={row.selling_status ? "In stock" : "Not available"}
            value={brandName}
            onValueChange={(val) => set(val)}
          /> */}
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
          <Button color="primary" onClick={() => handleEdit()}>
            Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
