import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActivationMutation } from "../redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { ServerError } from "../types";

const ActivationPage: React.FC = () => {
  const { activation_token } = useParams<{ activation_token: string }>();
  const navigate = useNavigate();
  const [activateUser, { isLoading, isSuccess, isError }] =
    useActivationMutation();

  const onSubmit = useCallback(async () => {
    if (!activation_token) {
      toast.error("Missing token");
      return;
    }

    try {
      const result = await activateUser({ activation_token }).unwrap();
      toast.success(result.message || "Account activated successfully");
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message || serverError.message || "Activation failed";
      toast.error(errorMessage);
    }
  }, [activation_token, activateUser]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  const handleRedirect = () => {
    navigate("/login");
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

export default ActivationPage;
