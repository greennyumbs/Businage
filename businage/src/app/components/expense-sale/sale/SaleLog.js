"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Pagination,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import axios from "axios";
import { useState, useMemo } from "react";

const columns = [
  {
    key: "order_date",
    label: "Order date",
  },
  {
    key: "order_id",
    label: "Order id",
  },
  {
    key: "customer_id",
    label: "Customer",
  },
  {
    key: "trade_in_status_display",
    label: "Trade-In",
  },
  {
    key: "discount_display",
    label: "Discount",
  },
  {
    key: "total_price_display",
    label: "Total price",
  },
];

const THbaht = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
});

export default function SaleLog() {
  const [isLoading, setIsLoading] = useState(true);

  // For pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState()
  const rowsPerPage = 5;
  

  let list = useAsyncList({
    async load({ signal }) {
      let res = await fetch("/api/sale_log", {
        signal,
      });
      let json = await res.json();
      let data = json.data.map((item) => {
        return {
          ...item,
          total_price_display: THbaht.format(item.total_price),
          trade_in_status_display: item.trade_in_status == true ? <div className=" text-green-500">Yes</div> : <div className=" text-red-600">No</div>,
          discount_display: THbaht.format(item.discount),
          order_date: new Date(item.order_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        };
      });
      setPages(Math.ceil(data.length / rowsPerPage))
      setIsLoading(false);
      
      return {
        items: data,
      };
    },
    async sort({ items, sortDescriptor }) {
      // console.log(sortDescriptor) {column: 'order_date', direction: 'ascending'}
      return {
        items: items.sort((a, b) => {
          let first;
          let second;
          if (
            sortDescriptor.column === "total_price_display" ||
            sortDescriptor.column === "discount_display" ||
            sortDescriptor.column === "trade_in_status_display"
          ) {
            if (sortDescriptor.column === "total_price_display") {
              first = a["total_price"];
              second = b["total_price"];
            
            } else if(sortDescriptor.column === "trade_in_status_display"){
              first = a["trade_in_status"];
              second = b["trade_in_status"];
            } 
            else {
              first = a["discount"];
              second = b["discount"];
            }
          } else {
            first = a[sortDescriptor.column];
            second = b[sortDescriptor.column];
          }
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;
          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  
  
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return list.items.slice(start, end); // slice to show specific range
  }, [page, list.items]);

  return (
    <Table
      isHeaderSticky={true}
      aria-label="Sale log table"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      classNames={{
        base: "max-h-[520px]",
        table: "min-h-[300px]",
      }}
      bottomContent={
          <div className="flex justify-center">
            <Pagination
            showControls
            showShadow
            page={page}
            total={pages}
            onChange={(page)=>setPage(page)}
            />

          </div>
      }

    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} allowsSorting>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={isLoading == true ? null : "No sales log to display."}
        items={items}
        isLoading={isLoading}
        loadingContent={
          <Spinner size="md" label="Loading sales log" color="default" />
        }
      >
        {(item) => (
          <TableRow key={item.order_id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
