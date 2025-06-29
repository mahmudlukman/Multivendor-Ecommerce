import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useActivateSellerMutation } from "../redux/features/sellerAuth/sellerAuthApi";

const SellerActivationPage: React.FC = () => {
  const { activation_token } = useParams<{ activation_token: string }>();
  const navigate = useNavigate();
  const [activateSeller, { isLoading, isSuccess, isError }] =
    useActivateSellerMutation();

  const onSubmit = useCallback(async () => {
    if (!activation_token) {
      toast.error("Missing token");
      return;
    }

    try {
      const result = await activateSeller({ activation_token }).unwrap();
      toast.success(result.message || "Account activated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  }, [activation_token, activateSeller]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  const handleRedirect = () => {
    navigate("/login-shop");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading ? (
        <p>Activating your account...</p>
      ) : isError ? (
        <p>Activation failed. Please try again or contact support.</p>
      ) : isSuccess ? (
        <>
          <p>Activation successful! You can now log in.</p>
          <button
            onClick={handleRedirect}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Go to Login
          </button>
        </>
      ) : (
        <p>Waiting for activation...</p>
      )}
    </div>
  );
};

export default SellerActivationPage;
