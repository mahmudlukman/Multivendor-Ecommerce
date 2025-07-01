import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SellerState } from "../../../types";
import ShopResetPassword from "../../../components/Shop/Auth/ShopResetPassword";

const ShopResetPasswordPage = () => {
  const navigate = useNavigate();
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);

  useEffect(() => {
    if (seller) {
      navigate("/");
    }
  }, [seller, navigate]);

  return (
    <div>
      <ShopResetPassword />
    </div>
  );
};

export default ShopResetPasswordPage;
