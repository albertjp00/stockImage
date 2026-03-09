import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/register/register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/login/login";
import Home from "./pages/home";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
