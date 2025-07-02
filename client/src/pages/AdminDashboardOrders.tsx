import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllOrdersQuery } from "../redux/features/order/orderApi";

const AdminDashboardOrders = () => {
  const { data: adminOrders, isLoading: adminOrderLoading, error } = useGetAllOrdersQuery({});

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
      type: "number" as const,
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
      field: "createdAt",
      headerName: "Order Date",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  interface OrderRow {
    id: string;
    itemsQty: number;
    total: string;
    status: string;
    createdAt: string;
  }

  const rows: OrderRow[] = [];
  interface CartItem {
    qty: number;
    // add other properties if needed
  }

  interface AdminOrder {
    _id: string;
    cart: CartItem[];
    totalPrice: number;
    status: string;
    createdAt: string;
    // add other properties if needed
  }

  if (adminOrders) {
    adminOrders.forEach((item: AdminOrder) => {
      rows.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc: number, cartItem: CartItem) => acc + cartItem.qty, 0),
        total: item?.totalPrice + " $",
        status: item?.status,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });
  }

  if (adminOrderLoading) {
    return (
      <div>
        <AdminHeader />
        <div className="w-full flex">
          <div className="flex items-start justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <AdminSideBar active={2} />
            </div>
            <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center items-center">
              <div>Loading orders...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AdminHeader />
        <div className="w-full flex">
          <div className="flex items-start justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <AdminSideBar active={2} />
            </div>
            <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center items-center">
              <div>Error loading orders</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={2} />
          </div>
          <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center">
            <div className="w-[97%] flex justify-center">
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[4, 10, 20]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 4, page: 0 },
                  },
                }}
                disableRowSelectionOnClick
                autoHeight
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrders;