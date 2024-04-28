import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";

const columns = [
  {
    key: "product_name",
    label: "Product name",
  },
  {
    key: "brand_name",
    label: "Brand name",
  },
  {
    key: "quantity",
    label: "quantity",
  },
];

function adapter(saleDetails) {
  if (saleDetails.length !== 0) {
    const normalizedSaleDetails = saleDetails.map((sale) => {
      return {
        id: uuidv4(),
        quantity: sale?.quantity,
        product_name: sale.Product_stock?.product_name,
        brand_name: sale.Product_stock?.Brand.brand_name,
      };
    });
    return normalizedSaleDetails;
  }
  return saleDetails;
}

export default function PopoverDetails({ saleDetails }) {
  const prepSaleDetails = adapter(saleDetails);
  
  return (
    <Popover placement="left" showArrow={true} backdrop="opaque">
      <PopoverTrigger>
        <Button color="primary">See more</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Table 
        className="pt-1"
        removeWrapper={true}
        aria-label="Sale Details">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={prepSaleDetails} emptyContent={"No details to display."}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </PopoverContent>
    </Popover>
  );
}
