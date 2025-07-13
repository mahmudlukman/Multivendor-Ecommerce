import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useGetAllProductsQuery } from "../../redux/features/product/productApi";
import Loader from "../Layout/Loader";

const AllProducts = () => {
  // RTK Query hook
  const { data: allProducts, isLoading, error } = useGetAllProductsQuery({});

  const products = allProducts?.products || [];

  const columns: GridColDef[] = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
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
      <div className="w-full mx-8 pt-1 mt-10 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading products</div>
        </div>
      </div>
    );
  }

  type ProductType = {
    _id: string;
    name: string;
    discountPrice: string;
    stock: string;
    sold_out: string;
  };

  // Transform data for DataGrid
  const rows =
    products?.map((item: ProductType) => ({
      id: item._id,
      name: item.name,
      price: "₦ " + item.discountPrice,
      stock: item.stock,
      sold: item?.sold_out,
    })) || [];

  return (
    <>
      <div className="w-full mx-8 pt-1 mt-10 bg-white">
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
    </>
  );
};

export default AllProducts;
