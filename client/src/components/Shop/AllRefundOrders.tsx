import { Button } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { useGetAllSellerOrdersQuery } from "../../redux/features/order/orderApi";
import { AiOutlineArrowRight } from "react-icons/ai";
import { SellerState } from "../../types";

const AllRefundOrders = () => {
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);

  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetAllSellerOrdersQuery(seller?._id, {
    skip: !seller?._id,
  });

  const orders = ordersData?.orders || [];

  // Define the Order type if not already defined
  interface Order {
    _id: string;
    status: string;
    cart: { length: number }[];
    totalPrice: number;
    [key: string]: unknown;
  }

  // Filter refund orders
  const refundOrders = (orders as Order[] | undefined)?.filter(
    (item: Order) =>
      item.status === "Processing refund" || item.status === "Refund Success"
  );

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params: GridCellParams) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "actions",
      flex: 1,
      minWidth: 150,
      headerName: "",
      sortable: false,
      renderCell: (params: GridCellParams) => {
        return (
          <>
            <Link to={`/shop/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const rows: {
    id: string;
    itemsQty: number;
    total: string;
    status: string;
  }[] = [];
  refundOrders?.forEach((item) => {
    rows.push({
      id: item._id,
      itemsQty: item.cart.length,
      total: "₦ " + item.totalPrice,
      status: item.status,
    });
  });

  // Handle error state
  if (error) {
    return (
      <div className="w-full mx-8 pt-1 mt-10 bg-white">
        <div className="text-red-500 text-center p-4">Error loading orders</div>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllRefundOrders;
