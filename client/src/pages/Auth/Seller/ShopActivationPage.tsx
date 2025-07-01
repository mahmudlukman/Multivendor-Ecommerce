import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SellerState } from "../../../types";
import ShopActivation from "../../../components/Shop/Auth/ShopActivation";

const ShopActivationPage = () => {
  const navigate = useNavigate();
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);

  useEffect(() => {
    if (seller && seller._id) {
      navigate(`/shop/dashboard`);
    }
  }, [seller, navigate]);
  return (
    <div>
      <ShopActivation />
    </div>
  );
};

export default ShopActivationPage;
