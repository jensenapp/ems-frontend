import React from 'react'
import { toast } from 'react-toastify';
import {useNavigate } from 'react-router-dom';
import { useAuth } from "../store/auth-context";

const HeaderComponent = () => {

  const navigate=useNavigate();

const { isAuthenticated,user,logout } = useAuth(); 

  const handleLogout=()=>{
     logout();
   toast.success("成功登出");
   navigate("/login");
  }


  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-gray-900 px-6 py-4 shadow-md flex items-center justify-between">
        <a 
          href="/" 
          className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors duration-200"
        >
          Employee Management System
        </a>
      { isAuthenticated && (
          <div className="flex gap-4">
            <button 
              onClick={() => navigate("/change-password")} 
              className="text-white hover:text-blue-300 transition font-medium"
            >
              修改密碼
            </button>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 text-white px-5 py-1.5 rounded hover:bg-red-600 transition shadow"
            >
              登出
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}

export default HeaderComponent