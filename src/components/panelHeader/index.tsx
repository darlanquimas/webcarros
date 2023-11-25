import { signOut } from "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../services/firebaseConnection";

const PanelHeader = () => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="w-full items-center flex h-10 bg-red-500 rounded-lg text-white font-medium gap-4 px-4 mb-4">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/add-new">Cadastrar carro</Link>
      <button className="ml-auto" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
};

export default PanelHeader;
