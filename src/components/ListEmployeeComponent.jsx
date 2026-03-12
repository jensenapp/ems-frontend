import React from 'react';
import { deleteEmployee, listEmployees } from './services/EmployeeService';
import { redirect, useNavigate } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import { useRevalidator } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../store/auth-context";

const ListEmployeeComponent = () => {
  
  const navigate = useNavigate();

  const handleAddEmployee = () => navigate("/add-employee");

  const handleCreateAccount = () => navigate("/register"); 

  const employees=useLoaderData();

  const revalidator=useRevalidator();

  const {user}=useAuth();

  const isAdmin=user?.roles?.includes("ROLE_ADMIN");

  const removeEmployee = async(id) => {
   try {
     await deleteEmployee(id);
     toast.success("成功刪除員工");
     revalidator.revalidate();
   } catch (error) {
    console.error("Delete Error:", error);
    toast.error("刪除失敗，請確認權限或網路狀態。");
   }
  }

  const updateEmployee = (id) => {
    navigate(`/update-employee/${id}`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10 mb-20">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">List of Employees</h1>
    
    {
    isAdmin && <div className="mb-4 flex justify-start gap-4">
        {/* 新增創建帳號的按鈕 */}
        <button 
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors" 
          onClick={handleCreateAccount}
        >
          Create Account
        </button>
      </div>
   }

   {
    isAdmin && <div className="mb-4 flex justify-start">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
          onClick={handleAddEmployee}
        >
          Add Employee
        </button>
      </div>
   }

     
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Id</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">First Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((item) => (
              /* even:bg-gray-50 做出斑馬紋效果，hover:bg-gray-100 讓滑鼠移過去有回饋 */
              <tr key={item.employeeId} className="even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.employeeId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{item.firstName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  
                 
                  <button 
                    className="bg-teal-500 hover:bg-teal-600 text-white py-1.5 px-3 rounded-md shadow-sm transition-colors duration-200 mr-2" 
                    onClick={() => updateEmployee(item.employeeId)}
                  >
                    Update
                  </button>
                  
                  
                  {isAdmin && <button 
                    className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded-md shadow-sm transition-colors duration-200 ml-2" 
                    onClick={() => removeEmployee(item.employeeId)}
                  >
                    Delete
                  </button>}
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export async function employeeLoader() {

    const token=localStorage.getItem("jwtToken");
  if(!token){
    return redirect("/login");
  }

  try {
   
    const response = await listEmployees();
    return response.data;
  } catch (error) {
    // 核心步驟：拋出 Response 物件
    // 參數 1 (Body): 錯誤訊息
    // 參數 2 (Options): 包含 status 等元數據
    throw new Response(
     error.response?.data?.errorMessage || 
      error.message || 
      "Failed to fetch products. Please try again.",
      { status: error.status || 500 }
    );
  }
}

export default ListEmployeeComponent