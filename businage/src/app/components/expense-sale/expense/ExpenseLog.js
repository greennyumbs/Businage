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
  Input,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useState, useMemo, useEffect, useCallback } from "react";
import PopoverDetails from "../PopoverDetail";



const columns = [
  {
    key: "expense_date",
    label: "Expense date",
    sort: true
  },
  {
    key: "expense_id",
    label: "Expense id",
    sort: true

  },
  {
    key: "brands",
    label: "Brand(s)",
    sort: false

  },
  {
    key: "total_cost_display",
    label: "Total cost",
    sort: true

  },
  {
    key: "details",
    label: "Details",
    sort: false

  },
];

const THbaht = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
}); // THbaht.format(number)

export default function ExpenseLog() {
  const [isLoading, setIsLoading] = useState(true);

  // For pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState();
  const rowsPerPage = 5;

  // For fetching & sorting
  let list = useAsyncList({
    async load({ signal, filterText }) {
      let res = await fetch(`/api/expense_log`, {
        signal,
      });
      let json = await res.json();
      let data = json.map((item) => {
        let brands = "None"
        if(item.Expense_detail !== 0)
        { 
          brands = (Array.from(new Set(item.Expense_detail.map(
            (detail)=>{
              if(detail.Product_stock === null)
              {
                return null
              }
              else{
                return detail.Product_stock.Brand.brand_name
              }
            }
          )))).filter(ele=>ele).join(", ")
          
        }
        if(!brands)
        {
          brands = "None"
        }
        return {
          ...item,
          brands: brands,
          total_cost_display: THbaht.format(item.total_cost),
          details: <PopoverDetails saleDetails={item.Expense_detail}/>,
          expense_date: new Date(item.expense_date).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }
          ),
        };
      });
      if (filterText) {
        data = data.filter((item) => item.expense_id === parseInt(filterText));
      }

      setPages(Math.ceil(data.length / rowsPerPage));

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
          if (sortDescriptor.column === "total_cost_display") {
            if (sortDescriptor.column === "total_cost_display") {
              first = a["total_cost"];
              second = b["total_cost"];
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
      className="w-5/6 mx-auto"
      
      isHeaderSticky={true}
      aria-label="Expense log table"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      topContent={
        <Input
          placeholder="Search by expense id..."
          value={list.filterText}
          onValueChange={(value) => {
            list.setFilterText(value);
            setPage(1);
          }}
        />
      }
      bottomContent={
        isLoading ? null : (
          <div className="flex justify-center">
            <Pagination
              showControls
              showShadow
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        )
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} allowsSorting={column.sort}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={isLoading == true ? " " : "No expenses log to display."}
        items={items}
        isLoading={isLoading}
        loadingContent={
          <Spinner
            className="w-full h-full flex item-center pt-28"
            color="default"
            label="Loading Expenses Log..."
          />
        }
      >
        {(item) => (
          <TableRow key={item.expense_id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
