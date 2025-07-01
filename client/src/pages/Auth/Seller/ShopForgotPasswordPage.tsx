import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SellerState } from "../../../types";
import ShopForgotPassword from "../../../components/Shop/Auth/ShopForgotPassword";

const ShopForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);

  useEffect(() => {
    if (seller) {
      navigate("/");
    }
  }, [seller, navigate]);

  return (
    <div>
      <ShopForgotPassword />
    </div>
  );
};

export default ShopForgotPasswordPage;
