import { Button } from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useGetShopEventsQuery,
  useDeleteShopEventMutation,
} from "../../redux/features/event/eventApi";
import Loader from "../../components/Layout/Loader";
import { SellerState, ServerError } from "../../types";
import toast from "react-hot-toast";

const AllEvents = () => {
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);

  const {
    data: eventsData,
    isLoading,
    error,
  } = useGetShopEventsQuery(seller?._id, {
    skip: !seller?._id,
  });

  const events = eventsData?.events || [];

  const [deleteEvent, { isLoading: isDeleting }] = useDeleteShopEventMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id).unwrap();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message ||
        serverError.message ||
        "Failed to delete event";
      toast.error(errorMessage);
    }
  };

  const columns = [
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
      field: "Stock",
      headerName: "Stock",
      type: "number" as const,
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number" as const,
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const d = params.row.name;
        const product_name = d.replace(/\s+/g, "-");
        return (
          <>
            <Link to={`/product/${product_name}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
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

  type RowType = {
    id: string;
    name: string;
    price: string;
    Stock: number;
    sold: number;
  };

  type EventType = {
    _id: string;
    name: string;
    discountPrice: number | string;
    stock: number;
    sold_out: number;
  };

  const rows: RowType[] = [];
  if (events) {
    events.forEach((item: EventType) => {
      rows.push({
        id: item._id,
        name: item.name,
        price: "₦ " + item.discountPrice,
        Stock: item.stock,
        sold: item.sold_out,
      });
    });
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full mx-8 pt-1 mt-10 bg-white p-4">
        <div className="text-red-500">Error loading events</div>
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
    </div>
  );
};

export default AllEvents;
