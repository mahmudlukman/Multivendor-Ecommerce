import { useState, useEffect } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { Country, State } from "country-state-city";
import { toast } from "react-hot-toast";
import {
  useUpdateUserInfoMutation,
  useUpdateUserPasswordMutation,
  useDeleteUserAddressMutation,
  useUpdateUserAddressMutation,
} from "../../redux/features/user/userApi";
import {
  useGetAllUserOrdersQuery,
  useOrderRefundRequestMutation,
} from "../../redux/features/order/orderApi";
import {
  RootState,
  ServerError,
} from "../../types";
import { ORDER_STATUSES, OrderStatus } from "../../types/order";

interface ProfileContentProps {
  active: number;
}

const ProfileContent = ({ active }: ProfileContentProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [updateUserInfo] = useUpdateUserInfoMutation();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserInfo({
        name,
        avatar,
        phoneNumber,
      }).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full">
      {/* profile */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={
                  typeof avatar === "string" ? avatar : `${user?.avatar?.url}`
                }
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                alt="Profile"
              />
              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input
                  type="file"
                  id="file-input"
                  className="hidden"
                  onChange={handleFileInputChange}
                  name="avatar"
                  accept=".jpg,.jpeg,.png"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <AiOutlineCamera />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit}>
              <div className="w-full 800px:flex block pb-3">
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className='w-full border p-1 rounded-[5px] !w-[95%] mb-4 800px:mb-0'
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="tel"
                    className='w-full border p-1 rounded-[5px] !w-[95%] mb-4 800px:mb-0'
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* <div className="w-full 800px:flex block pb-3">
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="tel"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div> */}
              <input
                className="w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer hover:bg-[#3a24db] hover:text-white transition-colors"
                value="Update"
                type="submit"
              />
            </form>
          </div>
        </>
      )}

      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* Track order */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* Change Password */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/* User Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { data: allOrders, isLoading, error } = useGetAllUserOrdersQuery({});
  const [orderRefundRequest, { isLoading: isLoadingRefund }] =
    useOrderRefundRequestMutation();

  useEffect(() => {
    if (error) {
      toast.error("Failed to load orders");
    }
  }, [error]);

  const orders = allOrders?.orders || [];

  const handleRefundRequest = async (id: string) => {
    try {
      await orderRefundRequest({
        id,
        status: ORDER_STATUSES.PROCESSING_REFUND,
      }).unwrap();
      toast.success("Refund requested successfully!");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to request refund";
      toast.error(errorMessage);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        [
          ORDER_STATUSES.DELIVERED,
          ORDER_STATUSES.REFUND_SUCCESS,
          ORDER_STATUSES.PAID,
        ].includes(params.value)
          ? "greenColor"
          : "redColor",
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
      renderCell: (params) => {
        return (
          <Link to={`/user/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
    {
      field: "refund",
      headerName: "",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        if (
          [ORDER_STATUSES.PROCESSING, ORDER_STATUSES.PAID].includes(
            params.row.status
          )
        ) {
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleRefundRequest(String(params.id))}
              disabled={isLoadingRefund}
              sx={{
                backgroundColor: "#e94560",
                "&:hover": { backgroundColor: "#d32f2f" },
              }}
            >
              {isLoadingRefund ? "Requesting..." : "Request Refund"}
            </Button>
          );
        }
        return null;
      },
    },
  ];

  interface OrderItem {
    _id: string;
    cart?: { [key: string]: unknown }[];
    totalPrice: number;
    status: OrderStatus;
  }

  const rows =
    orders?.map((item: OrderItem) => ({
      id: item._id,
      itemsQty: item.cart?.length || 0,
      total: `₦ ${item.totalPrice}`,
      status: item.status,
    })) || [];

  if (isLoading) {
    return <div className="pl-8 pt-1">Loading orders...</div>;
  }

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        disableRowSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetAllUserOrdersQuery(user?._id, {
    skip: !user?._id,
  });

  const orders = ordersData?.orders || [];

  useEffect(() => {
    if (error) {
      toast.error("Failed to load refund orders");
    }
  }, [error]);

  interface OrderItem {
    _id: string;
    cart?: { [key: string]: unknown }[];
    totalPrice: number;
    status: OrderStatus;
  }

  const eligibleOrders =
    orders?.filter(
      (item: OrderItem) =>
        item.status === ORDER_STATUSES.PROCESSING_REFUND ||
        item.status === ORDER_STATUSES.REFUND_SUCCESS
    ) || [];

  const columns: GridColDef[] = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.value === ORDER_STATUSES.REFUND_SUCCESS
          ? "greenColor"
          : "redColor",
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
      renderCell: (params) => {
        return (
          <Link to={`/user/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const rows = eligibleOrders.map((item: OrderItem) => ({
    id: item._id,
    itemsQty: item.cart?.length || 0,
    total: `₦ ${item.totalPrice}`,
    status: item.status,
  }));

  if (isLoading) {
    return <div className="pl-8 pt-1">Loading refund orders...</div>;
  }

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        autoHeight
        disableRowSelectionOnClick
      />
    </div>
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    data: ordersData,
    isLoading,
    error,
  } = useGetAllUserOrdersQuery(user?._id, {
    skip: !user?._id,
  });
  const orders = ordersData?.orders || [];

  useEffect(() => {
    if (error) {
      toast.error("Failed to load orders for tracking");
    }
  }, [error]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
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
      renderCell: (params) => {
        return (
          <Link to={`/user/track/order/${params.id}`}>
            <Button>
              <MdTrackChanges size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];
  interface OrderItem {
    _id: string;
    cart?: { [key: string]: unknown }[];
    totalPrice: number;
    status: string;
  }

  const rows =
    orders?.map((item: OrderItem) => ({
      id: item._id,
      itemsQty: item.cart?.length || 0,
      total: `₦ ${item.totalPrice}`,
      status: item.status,
    })) || [];

  if (isLoading) {
    return <div className="pl-8 pt-1">Loading orders...</div>;
  }

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        disableRowSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updateUserPassword, { isLoading }] = useUpdateUserPasswordMutation();

  const passwordChangeHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await updateUserPassword({
        oldPassword,
        newPassword,
      }).unwrap();

      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to update avatar";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full px-5">
      <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className="w-[100%] 800px:w-[50%] mt-5">
            <label className="block pb-2">Enter your old password</label>
            <input
              type="password"
              className='w-full border p-1 rounded-[5px] !w-[95%] mb-4 800px:mb-0'
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your new password</label>
            <input
              type="password"
              className='w-full border p-1 rounded-[5px] !w-[95%] mb-4 800px:mb-0'
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Confirm your new password</label>
            <input
              type="password"
              className='w-full border p-1 rounded-[5px] !w-[95%] mb-4 800px:mb-0'
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer hover:bg-[#3a24db] hover:text-white transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              value={isLoading ? "Updating..." : "Update"}
              type="submit"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

interface UserAddress {
  _id?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  address1?: string;
  address2?: string;
  addressType?: string;
}

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const [updateUserAddress, { isLoading: isUpdating }] =
    useUpdateUserAddressMutation();
  const [deleteUserAddress, { isLoading: isDeleting }] =
    useDeleteUserAddressMutation();

  const addressTypeData = [
    { name: "Default" },
    { name: "Home" },
    { name: "Office" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addressType || !country || !city || !address1) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const addressData = {
        country,
        city,
        address1,
        address2,
        zipCode,
        addressType,
        ...(editingAddressId && { _id: editingAddressId }),
      };

      await updateUserAddress(addressData).unwrap();

      toast.success(
        editingAddressId
          ? "Address updated successfully!"
          : "Address added successfully!"
      );
      setOpen(false);
      resetForm();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to update address";
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setCountry("");
    setCity("");
    setAddress1("");
    setAddress2("");
    setZipCode("");
    setAddressType("");
    setEditingAddressId(null);
  };

  const handleEdit = (item: UserAddress) => {
    setCountry(item.country || "");
    setCity(item.city || "");
    setAddress1(item.address1 || "");
    setAddress2(item.address2 || "");
    setZipCode(item.zipCode || "");
    setAddressType(item.addressType || "");
    setEditingAddressId(item._id?.toString() || null);
    setOpen(true);
  };

  const handleDelete = async (item: UserAddress) => {
    try {
      await deleteUserAddress(item._id).unwrap();
      toast.success("Address deleted successfully!");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to delete address";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center z-50">
          <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[25px] font-Poppins">
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </h1>
            <div className="w-full">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="w-full block p-4">
                  <div className="w-full pb-2">
                    <label className="block pb-2">Country *</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px] px-2"
                      required
                    >
                      <option value="">Choose your country</option>
                      {Country.getAllCountries().map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">City *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px] px-2"
                      required
                    >
                      <option value="">Choose your city</option>
                      {State.getStatesOfCountry(country).map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 1 *</label>
                    <input
                      type="text"
                      className='w-full border p-1 rounded-[5px]'
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 2</label>
                    <input
                      type="text"
                      className='w-full border p-1 rounded-[5px]'
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Zip Code</label>
                    <input
                      type="text"
                      className='w-full border p-1 rounded-[5px]'
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address Type *</label>
                    <select
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px] px-2"
                      required
                    >
                      <option value="">Choose your Address Type</option>
                      {addressTypeData.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <input
                      type="submit"
                      className={`w-full border p-1 rounded-[5px] mt-5 cursor-pointer hover:bg-[#3a24db] hover:text-white transition-colors ${
                        isUpdating ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      value={
                        isUpdating
                          ? "Updating..."
                          : editingAddressId
                          ? "Update Address"
                          : "Add Address"
                      }
                      disabled={isUpdating}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
          My Addresses
        </h1>
        <div
          className='w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer !rounded-md'
          onClick={() => setOpen(true)}
        >
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />

      {user?.addresses?.map((item, index) => (
        <div
          className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
          key={index}
        >
          <div className="flex items-center">
            <h5 className="pl-5 font-[600]">{item.addressType || "N/A"}</h5>
          </div>
          <div className="pl-8 flex items-center">
            <h6 className="text-[12px] 800px:text-[unset]">
              {item.address1
                ? `${item.address1} ${item.address2 || ""}`
                : "N/A"}
            </h6>
          </div>
          <div className="pl-8 flex items-center">
            <h6 className="text-[12px] 800px:text-[unset]">
              {user?.phoneNumber || "N/A"}
            </h6>
          </div>
          <div className="min-w-[10%] flex items-center justify-between pl-8">
            <button
              className="text-blue-500 mr-4"
              onClick={() =>
                handleEdit({
                  ...item,
                  zipCode:
                    item.zipCode !== undefined && item.zipCode !== null
                      ? String(item.zipCode)
                      : "",
                })
              }
              disabled={isDeleting}
            >
              Edit
            </button>
            <AiOutlineDelete
              size={25}
              className={`cursor-pointer ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                !isDeleting &&
                handleDelete({
                  ...item,
                  zipCode:
                    item.zipCode !== undefined && item.zipCode !== null
                      ? String(item.zipCode)
                      : "",
                })
              }
            />
          </div>
        </div>
      ))}

      {(!user?.addresses || user.addresses.length === 0) && (
        <h5 className="text-center pt-8 text-[18px]">
          You don't have any saved addresses!
        </h5>
      )}
    </div>
  );
};

export default ProfileContent;
