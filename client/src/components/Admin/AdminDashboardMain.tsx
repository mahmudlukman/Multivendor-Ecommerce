import React from "react";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import { useGetAllOrdersQuery } from "../../redux/features/order/orderApi";
import Loader from "../Layout/Loader";
import { useGetAllShopsQuery } from "../../redux/features/shop/shopApi";
import { CartItem, Order } from "../../types";

interface DataGridRow {
  id: string;
  itemsQty: number;
  total: string;
  status: string;
  createdAt: string;
}

const AdminDashboardMain: React.FC = () => {
  // RTK Query hooks
  const {
    data: ordersData,
    isLoading: adminOrderLoading,
    error: ordersError,
  } = useGetAllOrdersQuery({});

  const adminOrders = ordersData?.orders || [];

  const {
    data: sellersShops,
    isLoading: sellersLoading,
    error: sellersError,
  } = useGetAllShopsQuery({});

  const sellers = sellersShops?.shops || [];

  // Calculate admin earnings with proper typing
  const adminEarning =
    adminOrders?.reduce(
      (acc: number, item: Order) => acc + item.totalPrice * 0.1,
      0
    ) || 0;
  const adminBalance = adminEarning.toFixed(2);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params: GridCellParams<DataGridRow>) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "string",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      type: "string",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  // Create rows with proper typing
  const rows: DataGridRow[] = [];
  adminOrders?.forEach((item: Order) => {
    rows.push({
      id: item._id,
      itemsQty:
        item.cart?.reduce(
          (acc: number, cartItem: CartItem) => acc + cartItem.qty,
          0
        ) || 0,
      total: `${item.totalPrice} ₦`,
      status: item.status || "Processing",
      createdAt: item.createdAt.slice(0, 10),
    });
  });

  // Show loading state if either query is loading
  if (adminOrderLoading || sellersLoading) {
    return <Loader />;
  }

  // Handle errors
  if (ordersError || sellersError) {
    return (
      <div className="w-full p-4">
        <div className="text-red-500 text-center">
          Error loading dashboard data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className='text-[25px] font-[600] font-Roboto text-[#333] !text-[18px] leading-5 !font-[400] text-[#00000085]'
            >
              Total Earning
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            ₦ {adminBalance}
          </h5>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className='text-[25px] font-[600] font-Roboto text-[#333] !text-[18px] leading-5 !font-[400] text-[#00000085]'
            >
              All Sellers
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {sellers?.length || 0}
          </h5>
          <Link to="/admin/sellers">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Sellers</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className='text-[25px] font-[600] font-Roboto text-[#333] !text-[18px] leading-5 !font-[400] text-[#00000085]'
            >
              All Orders
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {adminOrders?.length || 0}
          </h5>
          <Link to="/orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
          </Link>
        </div>
      </div>

      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 4 },
            },
          }}
          pageSizeOptions={[4]}
          disableRowSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
};

export default AdminDashboardMain;
