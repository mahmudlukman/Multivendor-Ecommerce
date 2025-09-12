import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllSellerOrdersQuery } from "../../redux/features/order/orderApi";
import { useGetAllProductsInShopQuery } from "../../redux/features/product/productApi";
import { SellerState } from "../../types";

const DashboardHero = () => {
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);

  // Fetch orders and products using RTK Query
  const { data: ordersData, isLoading: ordersLoading } = useGetAllSellerOrdersQuery(
    seller?._id,
    {
      skip: !seller?._id, // Skip query if seller._id is not available
    }
  );
  const { data: productsData, isLoading: productsLoading } =
    useGetAllProductsInShopQuery(seller?._id, {
      skip: !seller?._id, // Skip query if seller._id is not available
    });

  const orders = ordersData?.orders || [];
  const products = productsData?.products || [];

  // Format available balance
  const availableBalance = seller?.availableBalance?.toFixed(2);

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
          <Link to={`/shop/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  type OrderCartItem = {
    qty: number;
    // add other properties if needed
  };

  type OrderItem = {
    _id: string;
    cart: OrderCartItem[];
    totalPrice: number;
    status: string;
    // add other properties if needed
  };

  const rows = orders
    ? (orders as OrderItem[]).map((item) => ({
        id: item._id,
        itemsQty: item.cart.reduce(
          (acc: number, cartItem: OrderCartItem) => acc + cartItem.qty,
          0
        ),
        total: `₦ ${item.totalPrice}`,
        status: item.status,
      }))
    : [];

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow-sm rounded-sm px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className='text-[25px] font-semibold font-Roboto text-[#333] text-[18px]! leading-5 font-normal! text-[#00000085]'
            >
              Account Balance{" "}
              <span className="text-[16px]">(with 10% service charge)</span>
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-medium">
            ₦{availableBalance || "0.00"}
          </h5>
          <Link to="/shop/withdraw-money">
            <h5 className="pt-4 pl-[2] text-[#077f9c]">Withdraw Money</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow-sm rounded-sm px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className='text-[25px] font-semibold font-Roboto text-[#333] text-[18px]! leading-5 font-normal! text-[#00000085]'
            >
              All Orders
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-medium">
            {ordersLoading ? "Loading..." : orders?.length || 0}
          </h5>
          <Link to="/shop/orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow-sm rounded-sm px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className='text-[25px] font-semibold font-Roboto text-[#333] text-[18px]! leading-5 font-normal! text-[#00000085]'
            >
              All Products
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-medium">
            {productsLoading ? "Loading..." : products?.length || 0}
          </h5>
          <Link to="/shop/products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
          </Link>
        </div>
      </div>
      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
      <div className="w-full min-h-[45vh] bg-white rounded-sm">
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={{ pageSize: 100, page: 0 }}
          disableRowSelectionOnClick
          // autoHeight
          loading={ordersLoading}
        />
      </div>
    </div>
  );
};

export default DashboardHero;
