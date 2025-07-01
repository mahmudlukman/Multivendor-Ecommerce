import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login from "../../components/Auth/Login";
import { RootState } from "../../types";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    }
    if (user?.role === "user") {
      navigate("/user/profile");
    }
  }, [user, navigate]);

  return (
    <div>
      <Login />
    </div>
  );
};

export default LoginPage;
