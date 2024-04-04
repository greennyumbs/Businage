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
} from "@nextui-org/react";

export default function EditModal({ formName, row, isOpen, setIsOpen }) {
  const [brandName, setBrandName] = useState(row.Brand.brand_name);
  const [productName, setProductName] = useState(row.product_name);
  const [sellPrice, setSellPrice] = useState(row.sell_price);
  const [quantity, setQuantity] = useState(row.quantity);
  const [sellingStatus, setSellingStatus] = useState(row.selling_status);
  // const [editData, setEditData] = useState(row);
  let editData = row;

  const handleEdit = () => {
    if (
      window.confirm(
        `Are you sure you want to edit ${JSON.stringify(row.product_name)}`
      )
    ) {
      //Logic Area => Pass all value to API
      editData.Brand.brand_name = brandName;
      editData.product_name = productName;
      editData.sell_price = sellPrice;
      editData.quantity = quantity;
      editData.latest_update = new Date().toISOString();
      console.log(editData);
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
          <Input
            autoFocus
            label="Brand Name"
            placeholder={row.Brand.brand_name}
            value={brandName}
            onValueChange={(val) => setBrandName(val)}
          />
          <Input
            label="Product Name"
            placeholder={row.product_name}
            value={productName}
            onValueChange={(val) => setProductName(val)}
          />
          <Input
            label="Sell Price"
            placeholder={String(row.sell_price)}
            value={sellPrice}
            onValueChange={(val) => setSellPrice(val)}
          />
          <Input
            label="Quantity"
            placeholder={String(row.quantity)}
            value={quantity}
            onValueChange={(val) => setQuantity(val)}
          />
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
