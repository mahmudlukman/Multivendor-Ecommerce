import { Button } from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import toast from "react-hot-toast";
import {
  useGetCouponQuery,
  useCreateCouponCodeMutation,
  useDeleteCouponMutation,
} from "../../redux/features/couponCode/couponCodeApi";
import { SellerState, ServerError } from "../../types";
import { useGetAllProductsInShopQuery } from "../../redux/features/product/productApi";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedProducts, setSelectedProducts] = useState("");
  const [value, setValue] = useState("");

  const { seller } = useSelector((state: SellerState) => state.sellerAuth);

  const {
    data: couponsData,
    isLoading,
    error,
  } = useGetCouponQuery(seller?._id, {
    skip: !seller?._id,
  });

  const coupons = couponsData?.couponCodes || [];

  const { data: productsData } = useGetAllProductsInShopQuery(seller?._id, {
    skip: !seller?._id,
  });

  const products = productsData?.products || [];

  const [createCoupon, { isLoading: isCreating }] =
    useCreateCouponCodeMutation();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteCoupon(id).unwrap();
      toast.success("Coupon code deleted successfully!");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to delete Coupon code";
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate that value is a number
    if (isNaN(Number(value)) || value.trim() === "") {
      toast.error("Discount Percentage must be a valid number");
      return;
    }

    try {
      await createCoupon({
        name,
        minAmount: minAmount || null,
        maxAmount: maxAmount || null,
        selectedProducts: selectedProducts || null,
        value,
        shopId: seller?._id,
      }).unwrap();

      toast.success("Coupon code created successfully!");
      setOpen(false);
      // Reset form
      setName("");
      setValue("");
      setMinAmount("");
      setMaxAmount("");
      setSelectedProducts("");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to delete coupon code!";
      toast.error(errorMessage);
    }
  };

  const columns = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Coupon Code",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Value",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Button
              onClick={() => handleDelete(String(params.id))}
              disabled={isDeleting}
            >
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const rows: { id: string; name: string; price: string }[] = [];
  if (coupons) {
    coupons.forEach((item: { _id: string; name: string; value: string }) => {
      rows.push({
        id: item._id,
        name: item.name,
        price: item.value + " %",
      });
    });
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full mx-8 pt-1 mt-10 bg-white p-4">
        <div className="text-red-500">Error loading coupons</div>
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
      <div className="w-full flex justify-end">
        <div
          className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
          onClick={() => setOpen(true)}
        >
          <span className="text-white">Create Coupon Code</span>
        </div>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        disableRowSelectionOnClick
        autoHeight
      />
      {open && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
          <div className="w-[90%] 800px:w-[40%] h-[80vh] bg-white rounded-md shadow p-4">
            <div className="w-full flex justify-end">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h5 className="text-[30px] font-Poppins text-center">
              Create Coupon code
            </h5>
            {/* create coupon code */}
            <form onSubmit={handleSubmit} aria-required={true}>
              <br />
              <div>
                <label className="pb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your coupon code name..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2">
                  Discount Percentage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="value"
                  value={value}
                  required
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter your coupon code value..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2">Min Amount</label>
                <input
                  type="number"
                  name="minAmount"
                  value={minAmount}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setMinAmount(e.target.value)}
                  placeholder="Enter your coupon code min amount..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2">Max Amount</label>
                <input
                  type="number"
                  name="maxAmount"
                  value={maxAmount}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setMaxAmount(e.target.value)}
                  placeholder="Enter your coupon code max amount..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2">Selected Product</label>
                <select
                  className="w-full mt-2 border h-[35px] rounded-[5px]"
                  value={selectedProducts}
                  onChange={(e) => setSelectedProducts(e.target.value)}
                >
                  <option value="">Choose a selected product</option>
                  {products &&
                    products.map((i: { _id: string; name: string }) => (
                      <option value={i.name} key={i._id}>
                        {i.name}
                      </option>
                    ))}
                </select>
              </div>
              <br />
              <div>
                <input
                  type="submit"
                  value={isCreating ? "Creating..." : "Create"}
                  disabled={isCreating}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer disabled:opacity-50"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCoupons;
