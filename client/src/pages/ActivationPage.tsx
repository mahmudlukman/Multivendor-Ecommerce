import React, { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useActivationMutation } from "../redux/features/auth/authApi";
import { toast } from "react-hot-toast";

const ActivationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activateUser, { isLoading, isSuccess, isError }] = useActivationMutation();
  const token = searchParams?.get('token');

  const onSubmit = useCallback(async () => {
    if (!token) {
      toast.error('Missing token');
      return;
    }

    try {
      const result = await activateUser({ activation_token: token }).unwrap();
      toast.success(result.message || 'Account activated successfully');
    } catch (error: any) {
      toast.error(error.data?.message || 'Something went wrong!');
    }
  }, [token, activateUser]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  const handleRedirect = () => {
    navigate('/login');
  };

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}>
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