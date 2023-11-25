import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.svg";
import { FiUser, FiLogIn } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const Header = () => {
  const { signed, loadingAuth, user } = useContext(AuthContext);

  return (
    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
      <header className="flex w-full max-w-7xl items-center justify-between px-4 mx-auto">
        <Link to="/">
          <img src={logoImg} alt="logo" />
        </Link>

        {!loadingAuth && signed && (
          <div className="flex flex-row items-center">
            <p className="  mr-2">Olá {user?.name?.split(" ")[0]}</p>
            <Link to="/dashboard">
              <div className="border-2 rounded-full p-1 border-green-900">
                <FiUser size={24} color="#000" />
              </div>
            </Link>
          </div>
        )}

        {!loadingAuth && !signed && (
          <Link to="/login">
            <FiLogIn size={24} color="#000" />
          </Link>
        )}
      </header>
    </div>
  );
};

export default Header;
