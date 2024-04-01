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

export default function EditModal({ formName, row, isOpen, onOpenChange }) {
  const handleEdit = (onClose) => {
    if (
      window.confirm(
        `Are you sure you want to edit ${JSON.stringify(row.product_name)}`
      )
    ) {
      onClose();
    }
  };

  console.log(isOpen);
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex w-full bg-yellow-300">
              {formName}
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Product Name"
                placeholder={row.product_name}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={onClose}>
                Close
              </Button>
              <Button color="primary" onClick={() => handleEdit(onClose)}>
                Edit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
