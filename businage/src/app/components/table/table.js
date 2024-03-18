"use client";
import React, { useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Pagination,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Button,
} from "@nextui-org/react";
import VerticalDotIcon from "./VerticalDotIcon";

function ProductTable({ rowData, colData, isLoading, isEdited }) {
  //Problem in isEdited => Occur re-render of component => Have 2 columns of "Action"
  //useMemo() is hook that used for memorizing expensive computation => recompute when dependency (colData and isEdited )change only!
  const modifiedColData = useMemo(() => {
    if (isEdited) {
      return [...colData, { key: "action", label: "Action" }];
    }
    return colData;
  }, [colData, isEdited]);

  //Start - Search filtering
  const [filteredValue, setFilteredValue] = useState(""); //Input value
  const hasSearchFilter = Boolean(filteredValue); //If the input exist => Perform filter

  //useMemo => To make the filteration not heavy ==> Store cache ==> Seach อันเก่า ==> ไม่ต้อง render การ search ใหม่
  const filteredItems = useMemo(() => {
    let filteredProducts = [...rowData];

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((product) => {
        return product.product_name
          .toLowerCase()
          .includes(filteredValue.toLowerCase());
      });
    }

    return filteredProducts;
  }, [rowData, filteredValue, hasSearchFilter]); //Will render when rowData, filteredValue, hasSearchFilter change

  const onSearchChange = useCallback((value) => {
    //useCallback ==> ถ้าเป็น Value เดิม จะไม่ render
    if (value) {
      setFilteredValue(value);
      setPage(1);
    } else {
      setFilteredValue("");
    }
  }, []); //Callback function will not be recreated whenever any values change

  const onClear = useCallback(() => {
    setFilteredValue("");
    setPage(1);
  }, []);
  //End - Search filtering

  //Start - Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  //End - Pagination

  //Start - Sorting
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "product_name",
    direction: "ascending",
  });

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  //End - Sorting

  //Start - Input filteration field
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col items-start">
        <Input
          isClearable
          className="w-full"
          placeholder="Search by Product name..."
          aria-labelledby="Search"
          // startContent={<SeachIcon />}
          value={filteredValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
      </div>
    );
  }, [filteredValue, onSearchChange, onClear]);

  //Start - Action on Vertical dot
  const actionMethod = (row) => {
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
            onAction={(key) => {
              if (key === "edit") {
                console.log(`Editing on ${row}`);
              } else if (key === "delete") {
                console.log(`Deleting on ${row}`);
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

  return (
    <>
      <div className="min-w-max h-screen flex mt-20 justify-center">
        <Table
          aria-label="product table"
          className="w-4/5"
          isStriped
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          topContent={topContent}
          bottomContent={
            //Pagination
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                page={page}
                total={pages}
                onChange={(page) => {
                  setPage(page);
                }}
              />
            </div>
          }
        >
          <TableHeader columns={modifiedColData}>
            {(column) => (
              <TableColumn key={column.key} allowsSorting>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={sortedItems}
            emptyContent={"No Product data."}
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading Product Stock..." />}
          >
            {(row) => {
              return (
                <TableRow key={row.product_id}>
                  {(columnKey) => {
                    return (
                      <TableCell className="py-4">
                        {columnKey === "selling_status" ? (
                          row.selling_status ? (
                            <p className="text-green-500">In stock</p>
                          ) : (
                            <p className="text-red-600">Not available</p>
                          )
                        ) : columnKey === "latest_update" ? (
                          new Date(row.latest_update).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )
                        ) : columnKey === "Brand" ? (
                          row.Brand.brand_name
                        ) : columnKey === "action" ? (
                          actionMethod(row)
                        ) : (
                          getKeyValue(row, columnKey)
                        )}
                      </TableCell>
                    );
                  }}
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
export default ProductTable;
