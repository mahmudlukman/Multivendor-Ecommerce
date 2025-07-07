import { useState } from "react";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { AiOutlineDelete } from "react-icons/ai";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-hot-toast";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/features/user/userApi";
import { ServerError } from "../../types";
import Loader from "../Layout/Loader";

const AllUsers = () => {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  // RTK Query hooks
  const { data: allUsers, isLoading, error } = useGetAllUsersQuery({});
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = allUsers?.users || [];

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteUser(id).unwrap();
      toast.success(result.message || "User deleted successfully");
      setOpen(false);
      setUserId("");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to delete user";
      toast.error(errorMessage);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "User ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "role",
      headerName: "User Role",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "joinedAt",
      headerName: "joinedAt",
      type: "string",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Delete User",
      type: "number",
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Button
              onClick={() => {
                const id = String(params.id);
                setUserId(id);
                setOpen(true);
              }}
              disabled={isDeleting}
            >
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  // Handle loading state
  if (isLoading) {
    return <Loader />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full flex justify-center pt-5">
        <div className="w-[97%]">
          <h3 className="text-[22px] font-Poppins pb-2">All Users</h3>
          <div className="w-full min-h-[45vh] bg-white rounded flex items-center justify-center">
            <div className="text-red-500">Error loading users</div>
          </div>
        </div>
      </div>
    );
  }

  type UserType = {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    role: string;
  };
  // Transform data for DataGrid
  const rows =
    users?.map((item: UserType) => ({
      id: item._id,
      name: item.name,
      email: item.email,
      role: item.role,
      joinedAt: item.createdAt.slice(0, 10),
    })) || [];

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">All Users</h3>
        <div className="w-full min-h-[45vh] bg-white rounded">
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
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Are you sure you want to delete this user?
              </h3>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  cancel
                </div>
                <div
                  className={`${
                    styles.button
                  } text-white text-[18px] !h-[42px] ml-4 ${
                    isDeleting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => !isDeleting && handleDelete(userId)}
                >
                  {isDeleting ? "Deleting..." : "confirm"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
