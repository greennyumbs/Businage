"use client";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from "@nextui-org/react";
import { NextUIProvider } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

/*  Product stock table

1. Item name (Can edit)

2. Sell price (Can edit)

3. Avg. cost (Non-editable, avg. computed from expenses)

4. Brand (Can edit)

5. Quantity

6. Selling status (Can edit)

7. (ขายอยู่ or not?)

8. Latest updated at ...
*/
const rowData = [
  {
    key: "1",
    name: "Tony กระด้าก",
    role: "CEO",
    status: "ตายห่า",
  },
  {
    key: "2",
    name: "Wong",
    role: "Santum lead",
    status: "Alive",
  },
  {
    key: "3",
    name: "Professor X",
    role: "Mai ru",
    status: "ตาย",
  },
  {
    key: "4",
    name: "Professor Y",
    role: "Mai ru",
    status: "ตาย",
  },
];

const colData = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "role",
    label: "Role",
  },
  {
    key: "status",
    label: "Status",
  },
];

function Inventory() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <NextUIProvider>
      <Table isStriped>
        <TableHeader columns={colData}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={rowData}
          emptyContent={"No Product data."}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading Product Stock..." />}
        >
          {(row) => (
            <TableRow key={row.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(row, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </NextUIProvider>
  );
}

export default Inventory;
