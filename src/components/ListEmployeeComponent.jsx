import React, { useState } from 'react'; // 1. 記得引入 useState
import { deleteEmployee, listEmployees } from './services/EmployeeService';
import { redirect, useNavigate } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';
import { useRevalidator } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from "../store/auth-context";

const ListEmployeeComponent = () => {
  const navigate = useNavigate();
  const handleAddEmployee = () => navigate("/add-employee");
  
  const employees = useLoaderData();
  const revalidator = useRevalidator();
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  // 2. 建立搜尋字串的 State
  const [searchTerm, setSearchTerm] = useState("");

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

  // 3. 過濾員工資料 (這裡設定可搜尋姓名、Email、部門與職稱)
  const filteredEmployees = employees.filter((item) => {
    
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = item.name?.toLowerCase().includes(searchLower);
    const emailMatch = item.email?.toLowerCase().includes(searchLower);
    const deptMatch = item.department?.toLowerCase().includes(searchLower);
    const jobMatch = item.jobTitle?.toLowerCase().includes(searchLower);

    return nameMatch || emailMatch || deptMatch || jobMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10 mb-20">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">List of Employees</h1>

  
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          {isAdmin && (
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
              onClick={handleAddEmployee}
            >
              Add Employee
            </button>
          )}
        </div>

        {/* 搜尋輸入框 UI */}
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            placeholder="搜尋姓名、信箱、部門或職稱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white shadow-sm"
          />
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Id</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mobile Number</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Dept</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">JobTitle</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">HireDate</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            
           
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((item) => (
                <tr key={item.employeeId} className="even:bg-gray-50 hover:bg-gray-100 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.employeeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.mobileNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.jobTitle}</td> 
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.hireDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <button 
                      className="bg-teal-500 hover:bg-teal-600 text-white py-1.5 px-3 rounded-md shadow-sm transition-colors duration-200 mr-2" 
                      onClick={() => updateEmployee(item.employeeId)}
                    >
                      Update
                    </button>
                    {isAdmin && (
                      <button 
                        className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded-md shadow-sm transition-colors duration-200 ml-2" 
                        onClick={() => removeEmployee(item.employeeId)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  找不到符合條件的員工資料。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export async function employeeLoader() {
  const token = localStorage.getItem("jwtToken");
  if(!token){
    return redirect("/login");
  }

  try {
    const response = await listEmployees();
    return response.data;
  } catch (error) {
    throw new Response(
     error.response?.data?.errorMessage || 
      error.message || 
      "Failed to fetch employees. Please try again.",
      { status: error.status || 500 }
    );
  }
}

export default ListEmployeeComponent;