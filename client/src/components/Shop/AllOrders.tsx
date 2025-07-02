import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../components/Layout/Loader";
import { useGetAllSellerOrdersQuery } from "../../redux/features/order/orderApi";
import { AiOutlineArrowRight } from "react-icons/ai";
import { SellerState } from "../../types";

const AllOrders = () => {
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);
  
  const { 
    data: ordersData, 
    isLoading, 
    error 
  } = useGetAllSellerOrdersQuery(seller?._id, {
    skip: !seller?._id,
  });

  const orders = ordersData?.orders || [];

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params: import("@mui/x-data-grid").GridCellParams) => {
        return params.value === "Delivered"
          ? "greenColor"
          : "redColor";
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
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      sortable: false,
      renderCell: (params: import("@mui/x-data-grid").GridRenderCellParams) => {
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

  interface OrderRow {
    id: string;
    itemsQty: number;
    total: string;
    status: string;
  }

  const rows: OrderRow[] = [];
  if (orders) {
    orders.forEach((item: { _id: string; cart: { length: number }; totalPrice: number; status: string }) => {
      rows.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "₦ " + item.totalPrice,
        status: item.status,
      });
    });
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full mx-8 pt-1 mt-10 bg-white p-4">
        <div className="text-red-500">
          Error loading orders
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return <Loader />;
  }

  // Handle case where seller is not available
  if (!seller?._id) {
    return (
      <div className="w-full mx-8 pt-1 mt-10 bg-white p-4">
        <div>Seller information not available</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10]}
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        disableRowSelectionOnClick
        autoHeight
      />
    </div>
  );
};

export default AllOrders;