import { useNavigate, useParams } from 'react-router-dom';
import { createEmployee, getEmployee, updateEmployee } from './services/EmployeeService';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const EmployeeComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // 是否為更新模式
  const isUpdateMode = Boolean(id);

  // --- 狀態管理 ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "", 
    employeeCode: "",
    department: "",
    jobTitle: "",
    hireDate: new Date().toISOString().split('T')[0],
    status: "Active"
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isUpdateMode);

  // --- 使用 useEffect 取得資料 ---
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!isUpdateMode) return; 

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const response = await getEmployee(id);
        const data = response.data;
        
        setFormData({
          name: data.name || "",
          email: data.email || "",
          mobileNumber: data.mobileNumber || "",
          password: "", 
          employeeCode: data.employeeCode || "",
          department: data.department || "",
          jobTitle: data.jobTitle || "",
          hireDate: data.hireDate || new Date().toISOString().split('T')[0],
          status: data.status || "Active"
        });
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(error.response?.data?.errorMessage || "獲取員工資料失敗");
        navigate("/employees"); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id, isUpdateMode, navigate]);

  // --- 處理欄位變更 ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // --- 基礎驗證 ---
  const validateForm = () => {
    let newErrors = {};
    let valid = true;

    if (!formData.name.trim()) { newErrors.name = 'Name is required'; valid = false; }
    if (!formData.email.trim()) { newErrors.email = 'Email is required'; valid = false; }
    if (!formData.mobileNumber.trim()) { newErrors.mobileNumber = 'Mobile Number is required'; valid = false; }
    
    if (!isUpdateMode && !formData.password.trim()) { 
        newErrors.password = 'Password is required for new accounts'; 
        valid = false; 
    }
    
    if (!formData.employeeCode.trim()) { newErrors.employeeCode = 'Employee Code is required'; valid = false; }
    if (!formData.department.trim()) { newErrors.department = 'Department is required'; valid = false; }
    if (!formData.jobTitle.trim()) { newErrors.jobTitle = 'Job Title is required'; valid = false; }

    setErrors(newErrors);
    return valid;
  };

  // --- 送出表單 ---
  async function saveOrUpdateEmployee(e) {
    e.preventDefault();

    if (validateForm()) {
      try {
        if (isUpdateMode) {
          const { password, ...updateData } = formData; 
          await updateEmployee(id, updateData);
          toast.success("更新員工資料完成！");
        } else {
          await createEmployee(formData); 
          toast.success("新員工建立完成！");
        }
        navigate("/employees");
      } catch (error) {
        console.error("Save error:", error);
        if(error.response?.status === 400 && typeof error.response.data === 'object'){
           setErrors(error.response.data);
           toast.error("資料驗證失敗，請檢查輸入內容。");
        } else {
           toast.error(error.response?.data?.errorMessage || "儲存失敗，請確認資料是否正確。");
        }
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading employee data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 mt-10 mb-20">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {isUpdateMode ? "Update Employee" : "Onboard New Employee"}
          </h2>
          
          <form onSubmit={saveOrUpdateEmployee} className="space-y-6">
            
            {/* 區塊 1: 帳號資訊 */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Account Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                          errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                          errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                      <input
                        type="text"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="0912345678"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                          errors.mobileNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {errors.mobileNumber && <div className="text-red-500 text-xs mt-1">{errors.mobileNumber}</div>}
                    </div>
                    
                    {/* Temporary Password */}
                    {!isUpdateMode && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 8 characters"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                              errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                          />
                          {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                        </div>
                    )}
                </div>
            </div>

            {/* 區塊 2: 員工資訊 */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Employment Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Employee Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee Code</label>
                      <input
                        type="text"
                        name="employeeCode"
                        value={formData.employeeCode}
                        onChange={handleChange}
                        placeholder="EMP-001"
                        disabled={isUpdateMode}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          isUpdateMode ? 'bg-gray-100 text-gray-500' : 'bg-white'
                        } ${
                          errors.employeeCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {errors.employeeCode && <div className="text-red-500 text-xs mt-1">{errors.employeeCode}</div>}
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="IT, HR, Sales..."
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                          errors.department ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {errors.department && <div className="text-red-500 text-xs mt-1">{errors.department}</div>}
                    </div>

                    {/* Job Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="Software Engineer"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                          errors.jobTitle ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {errors.jobTitle && <div className="text-red-500 text-xs mt-1">{errors.jobTitle}</div>}
                    </div>

                    {/* Hire Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                      <input
                        type="date"
                        name="hireDate"
                        value={formData.hireDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white ${
                          errors.hireDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      />
                      {errors.hireDate && <div className="text-red-500 text-xs mt-1">{errors.hireDate}</div>}
                    </div>
                </div>
                
                {/* Status */}
                {isUpdateMode && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            <option value="Active">Active (在職)</option>
                            <option value="On-Leave">On-Leave (留職停薪)</option>
                            <option value="Terminated">Terminated (離職)</option>
                        </select>
                    </div>
                )}
            </div>

            <button
              type="submit"
              className="w-full mt-8 px-4 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
              {isUpdateMode ? "Save Changes" : "Complete Onboarding"}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeComponent;