import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../types";
import ForgotPassword from "../../components/Auth/ForgotPassword";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <ForgotPassword />
    </div>
  );
};

export default ForgotPasswordPage;
