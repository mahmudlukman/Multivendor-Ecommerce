import { useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-hot-toast";
import {
  useGetAllWithdrawRequestQuery,
  useUpdateWithdrawRequestMutation,
} from "../../redux/features/withdraw/withdrawApi";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { ServerError } from "../../types";

// Type for withdraw data
interface WithdrawType {
  _id: string;
  seller: {
    _id: string;
    name: string;
  };
  amount: number;
  status: string;
  createdAt: string;
}

// Type for DataGrid row
interface RowType {
  id: string;
  shopId: string;
  name: string;
  amount: string;
  status: string;
  createdAt: string;
}

const AllWithdraw = () => {
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState<RowType | null>(null);
  const [withdrawStatus, setWithdrawStatus] = useState<
    "Processing" | "Succeed"
  >("Processing");

  // RTK Query hooks
  const { data: withdrawResponse, isLoading } = useGetAllWithdrawRequestQuery({});
  const [updateWithdrawRequest, { isLoading: isUpdating }] =
    useUpdateWithdrawRequestMutation();

  const withdraws = withdrawResponse?.withdraws || [];

  const columns: GridColDef[] = [
    { field: "id", headerName: "Withdraw ID", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Shop Name", minWidth: 180, flex: 1.4 },
    { field: "shopId", headerName: "Shop ID", minWidth: 180, flex: 1.4 },
    { field: "amount", headerName: "Amount", minWidth: 100, flex: 0.6 },
    {
      field: "status",
      headerName: "Status",
      type: "string",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "createdAt",
      headerName: "Request Given At",
      type: "string",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "updateStatus",
      headerName: "Update Status",
      minWidth: 130,
      flex: 0.6,
      sortable: false,
      renderCell: (params: GridRenderCellParams<RowType>) => (
        <BsPencil
          size={20}
          className={`${
            params.row.status !== "Processing" ? "hidden" : ""
          } mr-5 cursor-pointer`}
          onClick={() => {
            setWithdrawData(params.row);
            setWithdrawStatus(params.row.status as "Processing" | "Succeed");
            setOpen(true);
          }}
        />
      ),
    },
  ];

  const handleSubmit = async () => {
    if (!withdrawData) return;
    try {
      await updateWithdrawRequest({
        withdrawId: withdrawData.id,
        sellerId: withdrawData.shopId,
        status: withdrawStatus,
      }).unwrap();
      toast.success("Withdraw request updated successfully!");
      setOpen(false);
      setWithdrawData(null);
      setWithdrawStatus("Processing");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to update withdraw request";
      toast.error(errorMessage);
    }
  };

  // Transform data for DataGrid
  const rows: RowType[] = withdraws.map((item: WithdrawType) => ({
    id: item._id,
    shopId: item.seller._id,
    name: item.seller.name || "Unknown",
    amount: `₦${item.amount}`,
    status: item.status,
    createdAt: item.createdAt.slice(0, 10),
  }));

  // Handle loading state
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full flex items-center pt-5 justify-center">
      <div className="w-[95%] bg-white">
        <h3 className="text-[22px] font-Poppins pb-2">All Withdraw Requests</h3>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          disableRowSelectionOnClick
          autoHeight
        />
      </div>
      {open && withdrawData && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[95%] 800px:w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1
                size={25}
                onClick={() => {
                  setOpen(false);
                  setWithdrawData(null);
                }}
                className="cursor-pointer"
              />
            </div>
            <h1 className="text-[25px] text-center font-Poppins">
              Update Withdraw Status
            </h1>
            <div className="w-full flex items-center justify-center mt-5">
              <select
                value={withdrawStatus}
                onChange={(e) =>
                  setWithdrawStatus(e.target.value as "Processing" | "Succeed")
                }
                className="w-[200px] h-[35px] border rounded"
              >
                <option value="Processing">Processing</option>
                <option value="Succeed">Succeed</option>
              </select>
            </div>
            <div className="w-full flex items-center justify-center mt-5">
              <button
                className={`${styles.button} text-white !h-[42px] mr-4 text-[18px]`}
                onClick={() => {
                  setOpen(false);
                  setWithdrawData(null);
                }}
              >
                Cancel
              </button>
              <button
                className={`${
                  styles.button
                } text-white !h-[42px] ml-4 text-[18px] ${
                  isUpdating ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSubmit}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;