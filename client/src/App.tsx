// import './App.css'
// import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ForgotPasswordPage,
  ResetPasswordPage
  // SellerActivationPage,
} from './routes/Routes';
import { Toaster } from 'react-hot-toast';

const App = () => {
  // const { user } = useSelector((state: any) => state.auth);
  // const { isSeller } = useSelector((state: any) => state.seller);

  // console.log(user, isSeller)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route
          path="/activation"
          element={<ActivationPage />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />
        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />
        {/* <Route
          path="/seller/activation/:activation_token"
          element={<SellerActivationPage />}
        /> */}
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
};

export default App;
