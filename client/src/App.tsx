import './App.css'
import { useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  // LoginPage,
  // SignupPage,
  // ActivationPage,
  HomePage,
  // SellerActivationPage,
} from "./routes/Routes";

const App = () => {
  const { user } = useSelector((state: any) => state.auth);


  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<HomePage />} />
        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route
          path="/seller/activation/:activation_token"
          element={<SellerActivationPage />}
        /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
