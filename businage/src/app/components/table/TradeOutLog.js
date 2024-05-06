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

const columns = [
  {
    key: "trade_out_date",
    label: "Trade-Out Date",
  },
  {
    key: "trade_out_id",
    label: "Trade-Out ID",
  },
  {
    key: "total_income_display",
    label: "Total Income",
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
      let res = await fetch("/api/trade_out_log", {
        signal,
      });
      let json = await res.json();
      let data = json.map((item) => {
        return {
          ...item,
          total_income_display: THbaht.format(item.total_income),
          trade_out_date: new Date(item.trade_out_date).toLocaleDateString(
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
        data = data.filter(
          (item) => item.trade_out_id === parseInt(filterText)
        );
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
          if (sortDescriptor.column === "total_income_display") {
            if (sortDescriptor.column === "total_income_display") {
              first = a["total_income_display"];
              second = b["total_income_display"];
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
      className="flex justify-center w-auto mx-20 py-5"
      isHeaderSticky={true}
      aria-label="Trade Out log table"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      topContent={
        <div>
          <p className="pb-4 font-bold text-2xl flex">Trade-Out Log</p>

          <Input
          placeholder="Search by trade-out id..."
          value={list.filterText}
          onValueChange={(value) => {
            list.setFilterText(value);
            setPage(1);
          }}
        />
        </div>

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
          <TableColumn key={column.key} allowsSorting>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={isLoading == true ? " " : "No trade out log to display."}
        items={items}
        isLoading={isLoading}
        loadingContent={
          <Spinner
            className="w-full h-full flex item-center pt-28"
            color="default"
            label="Loading Trade-Out Log..."
          />
        }
      >
        {(item) => (
          <TableRow key={item.trade_out_id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
