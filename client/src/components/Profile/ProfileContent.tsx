import { useState, useEffect } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { Country, State } from "country-state-city";
import { toast } from "react-hot-toast";
import {
  useUpdateUserAvatarMutation,
  useUpdateUserInfoMutation,
  useUpdateUserPasswordMutation,
  useDeleteUserAddressMutation,
  useUpdateUserAddressMutation,
} from "../../redux/features/user/userApi";
import { useGetAllUserOrdersQuery } from "../../redux/features/order/orderApi";
import { RootState, ServerError } from "../../types";

interface ProfileContentProps {
  active: number;
}

const ProfileContent = ({ active }: ProfileContentProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");

  const [updateUserAvatar] = useUpdateUserAvatarMutation();
  const [updateUserInfo] = useUpdateUserInfoMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserInfo({
        name,
        email,
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

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.readyState === 2) {
        try {
          await updateUserAvatar(reader.result as string).unwrap();
          toast.success("Avatar updated successfully!");
        } catch (err: unknown) {
          const serverError = err as ServerError;
          const errorMessage =
            serverError.data?.message ||
            serverError.message ||
            "Failed to update avatar";
          toast.error(errorMessage);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      {/* profile */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={user?.avatar?.url}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                alt="Profile"
              />
              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                  accept="image/*"
                />
                <label htmlFor="image" className="cursor-pointer">
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
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="email"
                    className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3">
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
              </div>
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
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: ordersData, isLoading, error } = useGetAllUserOrdersQuery(user?._id, {
    skip: !user?._id,
  });

  const orders = ordersData?.orders || [];

  useEffect(() => {
    if (error) {
      toast.error("Failed to load orders");
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
          <Link to={`/user/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
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
      total: `US$ ${item.totalPrice}`,
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
    status: string;
  }

  const eligibleOrders =
    orders?.filter((item: OrderItem) => item.status === "Processing refund") ||
    [];

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
      type: "number",
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
    total: `NGN₦ ${item.totalPrice}`,
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

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params: import("@mui/x-data-grid").GridCellParams) => {
        return params.value === "Delivered" ? "greenColor" : "redColor";
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
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params: import("@mui/x-data-grid").GridRenderCellParams) => {
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
      total: `US$ ${item.totalPrice}`,
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
        pageSize={10}
        disableSelectionOnClick
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
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your new password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Confirm your new password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
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

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");

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

    if (!addressType || !country || !city) {
      toast.error("Please fill all the required fields!");
      return;
    }

    try {
      await updateUserAddress({
        country,
        city,
        address1,
        address2,
        zipCode,
        addressType,
      }).unwrap();

      toast.success("Address added successfully!");
      setOpen(false);
      resetForm();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to update avatar";
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
  };

  interface AddressItem {
    _id: string;
    addressType?: string;
    address1?: string;
    address2?: string;
    [key: string]: unknown;
  }

  const handleDelete = async (item: AddressItem) => {
    try {
      await deleteUserAddress(item._id).unwrap();
      toast.success("Address deleted successfully!");
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
              Add New Address
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
                      className={`${styles.input}`}
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 2</label>
                    <input
                      type="text"
                      className={`${styles.input}`}
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Zip Code</label>
                    <input
                      type="text"
                      className={`${styles.input}`}
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
                      className={`${
                        styles.input
                      } mt-5 cursor-pointer hover:bg-[#3a24db] hover:text-white transition-colors ${
                        isUpdating ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      value={isUpdating ? "Adding..." : "Add Address"}
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
          className={`${styles.button} !rounded-md`}
          onClick={() => setOpen(true)}
        >
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />

      {user?.addresses?.map((item: any, index: number) => (
        <div
          className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
          key={index}
        >
          <div className="flex items-center">
            <h5 className="pl-5 font-[600]">{item.addressType}</h5>
          </div>
          <div className="pl-8 flex items-center">
            <h6 className="text-[12px] 800px:text-[unset]">
              {item.address1} {item.address2}
            </h6>
          </div>
          <div className="pl-8 flex items-center">
            <h6 className="text-[12px] 800px:text-[unset]">
              {user?.phoneNumber}
            </h6>
          </div>
          <div className="min-w-[10%] flex items-center justify-between pl-8">
            <AiOutlineDelete
              size={25}
              className={`cursor-pointer ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => !isDeleting && handleDelete(item)}
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
