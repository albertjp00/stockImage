import "./navbar.css";
// import { logoutUser } from "../../assets/services/services";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate()

    const logout = async()=>{
        try {
            // await logoutUser()
            localStorage.removeItem('userToken')
            navigate('/login')
            
        } catch (error) {
            console.log(error);
            
        }
    }
  return (
    <nav className="navbar">
      <div className="logo">StockImage</div>

      <div className="nav-links">
        
        <p onClick={logout} className="logout">logout</p>
      </div>
    </nav>
  );
};

export default Navbar;