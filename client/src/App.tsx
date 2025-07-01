import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  ProductDetailsPage,
  ProfilePage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
  OrderDetailsPage,
  TrackOrderPage,
  UserInbox,
  ForgotPasswordPage,
  ResetPasswordPage,
} from "./routes/Routes";
import {
  AdminDashboardPage,
  AdminDashboardUsers,
  AdminDashboardSellers,
  AdminDashboardOrders,
  AdminDashboardProducts,
  AdminDashboardEvents,
  AdminDashboardWithdraw,
} from "./routes/AdminRoutes";
import {
  ShopDashboardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopCreateEvents,
  ShopAllEvents,
  ShopAllCoupons,
  ShopPreviewPage,
  ShopAllOrders,
  ShopOrderDetails,
  ShopAllRefunds,
  ShopSettingsPage,
  ShopWithDrawMoneyPage,
  ShopInboxPage,
  ShopForgotPasswordPage,
  ShopResetPasswordPage,
} from "./routes/ShopRoutes";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./routes/ProtectedAdminRoute";
import PrivateShopRoute from "./routes/ShopProtectedRoute";
import ShopHomePage from "./pages/Shop/ShopHomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/sign-up",
    element: <SignupPage />,
  },
  {
    path: "/activation/:activation_token",
    element: <ActivationPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/login-shop",
    element: <ShopLoginPage />,
  },
  {
    path: "/create-shop",
    element: <ShopCreatePage />,
  },
  {
    path: "/shop/activation/:activation_token",
    element: <SellerActivationPage />,
  },
  {
    path: "/shop-forgot-password",
    element: <ShopForgotPasswordPage />,
  },
  {
    path: "/shop-reset-password",
    element: <ShopResetPasswordPage />,
  },
  {
    path: "/products",
    element: <ProductsPage />,
  },
  {
    path: "/products/:id",
    element: <ProductDetailsPage />,
  },
  {
    path: "/best-selling",
    element: <BestSellingPage />,
  },
  {
    path: "/events",
    element: <EventsPage />,
  },
  {
    path: "/faq",
    element: <FAQPage />,
  },
  {
    path: "/order/success",
    element: <OrderSuccessPage />,
  },
  {
    path: "/shop/preview/:id",
    element: <ShopPreviewPage />,
  },
  // Admin Routes (Protected)
  {
    path: "/admin",
    element: <PrivateRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "users",
        element: <AdminDashboardUsers />,
      },
      {
        path: "sellers",
        element: <AdminDashboardSellers />,
      },
      {
        path: "orders",
        element: <AdminDashboardOrders />,
      },
      {
        path: "products",
        element: <AdminDashboardProducts />,
      },
      {
        path: "events",
        element: <AdminDashboardEvents />,
      },
      {
        path: "withdraw-request",
        element: <AdminDashboardWithdraw />,
      },
    ],
  },
  // Seller Routes (Protected)
  {
    path: "/shop",
    element: <PrivateShopRoute allowedRoles={["seller"]} />,
    children: [
      {
        path: "dashboard",
        element: <ShopDashboardPage />,
      },
      {
        path: "settings",
        element: <ShopSettingsPage />,
      },
      {
        path: "shop/:id",
        element: <ShopHomePage />,
      },
      {
        path: "create-product",
        element: <ShopCreateProduct />,
      },
      {
        path: "orders",
        element: <ShopAllOrders />,
      },
      {
        path: "refunds",
        element: <ShopAllRefunds />,
      },
      {
        path: "order/:id",
        element: <ShopOrderDetails />,
      },
      {
        path: "products",
        element: <ShopAllProducts />,
      },
      {
        path: "create-event",
        element: <ShopCreateEvents />,
      },
      {
        path: "events",
        element: <ShopAllEvents />,
      },
      {
        path: "coupons",
        element: <ShopAllCoupons />,
      },
      {
        path: "withdraw-money",
        element: <ShopWithDrawMoneyPage />,
      },
      {
        path: "messages",
        element: <ShopInboxPage />,
      },
    ],
  },
  // User Routes (Protected)
  {
    path: "/user",
    element: <PrivateRoute allowedRoles={["user"]} />,
    children: [
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "inbox",
        element: <UserInbox />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "order/:id",
        element: <OrderDetailsPage />,
      },
      {
        path: "track/order/:id",
        element: <TrackOrderPage />,
      },
      {
        path: "payment",
        element: <PaymentPage />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </>
  );
};

export default App;
