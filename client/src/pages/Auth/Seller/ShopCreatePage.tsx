import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShopCreate from "../../../components/Shop/Auth/ShopCreate";
import { SellerState } from "../../../types";

const ShopCreatePage = () => {
  const navigate = useNavigate();
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);

  useEffect(() => {
    if (seller) {
      navigate(`/shop/${seller._id}`);
    }
  }, [navigate, seller]);
  return (
    <div>
      <ShopCreate />
    </div>
  );
};

export default ShopCreatePage;
