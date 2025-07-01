import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShopLogin from "../../../components/Shop/Auth/ShopLogin";
import { SellerState } from "../../../types";

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);
  console.log(seller)

  useEffect(() => {
    if (seller) {
      navigate(`/shop/dashboard`);
    }
  }, [seller, navigate]);
  return (
    <div>
      <ShopLogin />
    </div>
  );
};

export default ShopLoginPage;
