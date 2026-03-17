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

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Toaster position="top-center" />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/verifyOtp" element={<VerifyOtp />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/verifyresetPasswordOtp" element={<VerifyResetOtpPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
