import React, { useState } from "react";
import {
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import VerticalDotIcon from "./verticalDotIcon";
import axios from "axios";
import EditModal from "./editModal";

const URL = "http://localhost:3000/";

export default function ActionMethod({ row, setHandleAction }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = () => {
    if (
      confirm(
        `Are you sure you want to edit ${JSON.stringify(row.product_name)}`
      )
    ) {
      // console.log("Triggered!");
      setIsOpen(true);
    }
    /*
    if (
                confirm(
                  `Are you sure you want to edit ${JSON.stringify(
                    row.product_name
                  )}`
                ) === true
              ) {
                // onOpen(); //To trigger isOpen to open modal
                setIsOpen(true);
                console.log("Triggered");
                EditModal("Editing form", row, isOpen, setIsOpen);
                // return <EditModal formName="Editing form" row={row} />;
              }
              */
  };

  const handleDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete product name: ${JSON.stringify(
          row.product_name
        )}`
      )
    ) {
      alert(`Deleting on product name: ${JSON.stringify(row.product_name)}`);
      try {
        await axios.delete(`${URL}/api/products`, {
          data: {
            product_id: row.product_id,
          },
        });
        setHandleAction(true);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };
  //Action when click on Vertical dropdown at Action column
  return (
    <>
      <Dropdown aria-label="action on vertical">
        <DropdownTrigger>
          <Button aria-label="button" isIconOnly size="sm" variant="light">
            <VerticalDotIcon className="text-default-400" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="action list"
          onAction={async (key) => {
            if (key === "edit") {
              handleEdit();
            } else if (key === "delete") {
              handleDelete();
            }
          }}
        >
          <DropdownItem key="edit">Edit</DropdownItem>
          <DropdownItem className="text-danger" color="danger" key="delete">
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {isOpen && (
        <EditModal
          formName="Editing form"
          row={row}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
}
