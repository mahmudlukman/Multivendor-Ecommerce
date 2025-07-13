import { Button } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import {
  useGetAllSellerOrdersQuery,
  useOrderRefundSuccessMutation,
} from "../../redux/features/order/orderApi";
import { AiOutlineArrowRight } from "react-icons/ai";
import { SellerState, ServerError } from "../../types";
import { ORDER_STATUSES } from "../../types/order";
import { toast } from "react-hot-toast";

const AllRefundOrders = () => {
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);

  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetAllSellerOrdersQuery(seller?._id, {
    skip: !seller?._id,
  });

  const [orderRefundSuccess, { isLoading: isUpdating }] =
    useOrderRefundSuccessMutation();

  const orders = ordersData?.orders || [];

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
      item.status === ORDER_STATUSES.PROCESSING_REFUND ||
      item.status === ORDER_STATUSES.REFUND_SUCCESS
  );

  const handleRefundSuccess = async (orderId: string) => {
    try {
      const result = await orderRefundSuccess({
        id: orderId,
        status: ORDER_STATUSES.REFUND_SUCCESS,
      }).unwrap();

      if (result.success) {
        toast.success("Refund processed successfully!");
      }
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to process refund!";
      toast.error(errorMessage);
    }
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params: GridCellParams) => {
        return params.row.status === ORDER_STATUSES.REFUND_SUCCESS
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
      field: "actions",
      flex: 1,
      minWidth: 200,
      headerName: "Actions",
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const canProcessRefund =
          params.row.status === ORDER_STATUSES.PROCESSING_REFUND;

        return (
          <div className="flex gap-2">
            <Link to={`/shop/order/${params.id}`}>
              <Button size="small">
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
            {canProcessRefund && (
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => handleRefundSuccess(params.id as string)}
                disabled={isUpdating}
              >
                {isUpdating ? "Processing..." : "Approve Refund"}
              </Button>
            )}
          </div>
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
