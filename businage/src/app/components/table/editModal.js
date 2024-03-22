import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";

export default function EditModal(formName, row, isOpen, onOpen, onOpenChange) {
  const handleEdit = (onClose) => {
    if (
      confirm(
        `Are you sure you want to edit ${JSON.stringify(row.product_name)}`
      ) === true
    ) {
      onClose;
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => {
          console.log("Editting!");
          <>
            <ModalHeader className="flex flex-col gap-1">
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
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={handleEdit(onClose)}>
                Edit
              </Button>
            </ModalFooter>
          </>;
        }}
      </ModalContent>
    </Modal>
  );
}
