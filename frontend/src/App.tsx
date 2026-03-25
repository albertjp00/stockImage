import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/register/register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/login/login";
import Home from "./pages/home";
import VerifyOtp from "./components/otp/verifyOtp";
import ForgotPassword from "./components/resetPassword/forgotPassword";
import ResetPassword from "./components/resetPassword/resetPassword";
import VerifyResetOtpPassword from "./components/resetPassword/verifyResetPassOtp";
import { Toaster } from "react-hot-toast";
import PublicRoute from "./components/protectedRoute/protectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Toaster position="top-center" />

      <Routes>
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/home" element={<Home />} />
        <Route path="/verifyOtp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
        <Route path="/forgotPassword" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/resetPassword" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/verifyresetPasswordOtp" element={<PublicRoute><VerifyResetOtpPassword /></PublicRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
