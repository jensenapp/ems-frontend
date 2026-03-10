import { redirect, useLoaderData } from 'react-router-dom';
import { createEmployee, getEmployee, listEmployees, updateEmployee } from './services/EmployeeService';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState} from 'react';
import { toast } from 'react-toastify';

const EmployeeComponent = () => {

  const loaderData=useLoaderData();
  
  const [firstName, setFirstName] = useState(loaderData?.firstName || "");
  const [lastName,  setLastName]  = useState(loaderData?.lastName || "");
  const [email,     setEmail]     = useState(loaderData?.email || "");


  const [errors,setErrors] =useState({
    firstName:"",
    lastName:"",
    email:""
  });

  const navigate=useNavigate();
  const {id}=useParams();

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { ...errors };

    if (firstName.trim()) {
        errorsCopy.firstName = '';
    } else {
        errorsCopy.firstName = 'First name is required';
        valid = false;
    }

    if (lastName.trim()) {
        errorsCopy.lastName = '';
    } else {
        errorsCopy.lastName = 'Last name is required';
        valid = false;
    }

    if (email.trim()) {
        errorsCopy.email = '';
    } else {
        errorsCopy.email = 'Email is required';
        valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  }

  const pageTitle=()=>{
      if (id) {
        return <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Employee</h2>
      }else{
        return <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add Employee</h2>
      }
  }

 async function saveOrUpdateEmployee(e) {
    e.preventDefault();
    const employee = { firstName, lastName, email };

    if(validateForm()){
      
      try {
      if(id){
       await updateEmployee(id,employee);
       toast.success("更新資料完成");
      }else{        
       await createEmployee(employee);
        toast.success("創建新資料完成");
      }
      navigate("/employees");

      } catch (error) {
        console.error("save error",error);
        toast.error(error.response?.data?.message || "儲存失敗，請確認資料是否正確。");
      }

    }
  }



  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* 表單卡片外框 */}
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          
          {pageTitle()}
          
          <div>
            <form onSubmit={saveOrUpdateEmployee} className="space-y-5">
              
              {/* First Name 欄位 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  placeholder="Enter Employee First Name"
                  name="firstName" 
                  value={firstName} 
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.firstName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                { errors.firstName && <div className='text-red-500 text-sm mt-1.5'> { errors.firstName } </div> }
              </div>

              {/* Last Name 欄位 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Enter Employee Last Name"
                  name="lastName" 
                  value={lastName} 
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.lastName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  onChange={(e) => setLastName(e.target.value)}
                />
                { errors.lastName && <div className='text-red-500 text-sm mt-1.5'> { errors.lastName } </div> }
              </div>

              {/* Email 欄位 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="text" 
                  placeholder="Enter Employee Email"
                  name="email" 
                  value={email} 
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  onChange={(e) => setEmail(e.target.value)} 
                />
                { errors.email && <div className='text-red-500 text-sm mt-1.5'> { errors.email } </div> }
              </div>

              {/* 提交按鈕 */}
              <button 
                type="submit"
                className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200"
              >
                Submit
              </button>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeComponent;

export async function employeeDetailLoader({params}){
if(!params.id){
  return null;
  }

    const token=localStorage.getItem("jwtToken");
  if(!token){
    return redirect("/login");
  }
  
 try {
    const response=await getEmployee(params.id);
     return response.data;
 } catch (error) {
  throw new Response(
     error.response?.data?.errorMessage || 
      error.message || 
      "Failed to fetch products. Please try again.",
      { status: error.status || 500 }
  );
 }
 
}