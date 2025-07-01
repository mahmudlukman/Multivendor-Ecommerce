import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../types";
import ResetPassword from "../../components/Auth/ResetPassword";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <div>
      <ResetPassword />
    </div>
  );
};

export default ResetPasswordPage;
