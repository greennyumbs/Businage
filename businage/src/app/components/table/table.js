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
  Input,
} from "@nextui-org/react";
import ActionMethod from "./actionMethod";

function ProductTable({
  type,
  rowData,
  colData,
  isLoading,
  isEdited,
  setHandleAction,
}) {
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
        if (type == "ProductTable") {
          return product.product_name
            .toLowerCase()
            .includes(filteredValue.toLowerCase());
        } else if (type == "TradeInTable") {
          return product.size_name
            .toLowerCase()
            .includes(filteredValue.toLowerCase());
        }
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
  const rowsPerPage = 6;

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
          placeholder={
            type == "ProductTable"
              ? "Search by Product name..."
              : type == "TradeInTable"
              ? "Search by Size name..."
              : null
          }
          aria-labelledby="Search"
          // startContent={<SeachIcon />}
          value={filteredValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
      </div>
    );
  }, [filteredValue, onSearchChange, onClear]);

  function currencyFormat(num) {
    // return `฿` + num.toFixed(2).replace
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(num);
  }

  function handleProductStock(columnKey, row) {
    return (
      <TableCell className="py-4">
        {columnKey === "selling_status" ? (
          row.selling_status ? (
            <p className="text-green-500">In stock</p>
          ) : (
            <p className="text-red-600">Not available</p>
          )
        ) : columnKey === "latest_update" ? (
          new Date(row.latest_update).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        ) : columnKey === "Brand" ? (
          row.Brand.brand_name
        ) : columnKey === "action" ? (
          <ActionMethod
            row={row}
            setHandleAction={setHandleAction}
            setPage={setPage}
          />
        ) : columnKey === "sell_price" ? (
          // `฿${row.sell_price}`
          currencyFormat(row.sell_price)
        ) : columnKey === "avg_cost" ? (
          currencyFormat(row.avg_cost)
        ) : (
          getKeyValue(row, columnKey)
        )}
      </TableCell>
    );
  }

  function handleTradeIn(columnKey, row) {
    return (
      <TableCell className="py-4">{getKeyValue(row, columnKey)}</TableCell>
    );
  }

  return (
    <>
      <div className="flex justify-center p-20 pb-5">
        <Table
          aria-label="product table"
          className="w-full"
          isStriped
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          topContent={topContent}
          bottomContent={
            isLoading ? null : (
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
            )

            //Pagination
          }
        >
          <TableHeader columns={modifiedColData}>
            {(column) => (
              <TableColumn key={column.key} allowsSorting={column.sortable}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={sortedItems}
            emptyContent={isLoading ? "   " : "No Product data."}
            isLoading={isLoading}
            loadingContent={
              <Spinner
                className="w-full h-full flex item-center pt-28"
                color="default"
                label={
                  type == "ProductTable"
                    ? "Loading Product Stock..."
                    : type == "TradeInTable"
                    ? "Loading Trade-In Income..."
                    : null
                }
              />
            }
          >
            {(row) => {
              return (
                <TableRow
                  key={
                    type === "ProductTable"
                      ? row.product_id
                      : type === "TradeInTable"
                      ? row.size_id
                      : null
                  }
                >
                  {(columnKey) => {
                    if (type === "ProductTable") {
                      return handleProductStock(columnKey, row);
                    } else if (type === "TradeInTable") {
                      return handleTradeIn(columnKey, row);
                    }
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
