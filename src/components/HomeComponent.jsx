import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../store/auth-context";


export default function HomeComponent() {

const { isAuthenticated,user,logout } = useAuth(); 
const navigate=useNavigate();

const handleLogout=()=>{
   logout();
 toast.success("成功登出");
 navigate("/login");
}

  return (

    isAuthenticated ? (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold mb-4">歡迎，{user?.name}！來到員工管理系統</h1>
      <a href="/employees" className='bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition'>返回管理頁面</a>
      
    </div>
    ) : (
         <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl font-bold mb-4">歡迎來到員工管理系統</h1>
      <p className="text-gray-600 mb-8">請登入系統以進行員工資料管理。</p>
      <Link 
        to="/login" 
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        前往登入
      </Link>
    </div>
    )
    
    
  );
}