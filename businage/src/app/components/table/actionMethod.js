import React, { useCallback, useMemo, useState } from "react";
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

export const actionMethod = (
  row,
  setHandleAction,
  isOpen,
  onOpen,
  onOpenChange
) => {
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
              if (
                confirm(
                  `Are you sure you want to edit ${JSON.stringify(
                    row.product_name
                  )}`
                ) === true
              ) {
                onOpen(); //To trigger isOpen to open modal
                EditModal("Editing form", row, isOpen, onOpenChange);
              }
            } else if (key === "delete") {
              if (
                confirm(
                  `Are you sure you want to delete product name: ${JSON.stringify(
                    row.product_name
                  )}`
                  // `Editing on product_id: ${JSON.stringify(row.product_id)}`
                  //Input Modal here
                ) === true
              ) {
                alert(
                  `Deleting on product name: ${JSON.stringify(
                    row.product_name
                  )}`
                );
                // console.log(req);
                //Input deleting API heres
                try {
                  const res = await axios.delete(`${URL}/api/products`, {
                    data: {
                      product_id: row.product_id,
                    },
                  });
                  // If deletion is successful, you can handle the result or update the UI accordingly
                  setHandleAction(true);
                } catch (error) {
                  // If an error occurs during the deletion process, you can handle the error here
                  console.error("Error deleting product:", error);
                  // Optionally, you can set an error state or display an error message to the user
                }
              }
            }
          }}
        >
          <DropdownItem key="edit">Edit</DropdownItem>
          <DropdownItem className="text-danger" color="danger" key="delete">
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};
