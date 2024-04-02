import React from "react";
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
  const handleEdit = (onClose) => {
    if (
      window.confirm(
        `Are you sure you want to edit ${JSON.stringify(row.product_name)}`
      )
    ) {
      //Logic Area
      onClose();
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
          />
          <Input
            autoFocus
            label="Product Name"
            placeholder={row.product_name}
          />
          <Input label="Sell Price" placeholder={String(row.sell_price)} />
          <Input label="Quantity" placeholder={String(row.quantity)} />
          <Input
            label="Selling Status (กู ขก. ทำ Dropdown)"
            placeholder={row.selling_status ? "In stock" : "Not available"}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="flat"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
          <Button
            color="primary"
            onClick={() => handleEdit(() => setIsOpen(false))}
          >
            Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
