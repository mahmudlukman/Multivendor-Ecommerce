import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { SellerState } from "../types";

const PrivateShopRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);

  if (!seller) {
    return <Navigate to="/login-shop" />;
  }

  if (!allowedRoles.includes(seller.role)) {
    return (
      <Navigate
        to={seller.role === "seller" ? "/shop/dashboard" : "/user/dashboard"}
      />
    );
  }

  return <Outlet />;
};

export default PrivateShopRoute;
