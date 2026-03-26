import React, { useState } from 'react';
import { useAuth } from "../store/auth-context";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { changePassword } from './services/AuthService';
import PageTitle from './PageTitle';

export default function ChangePasswordComponent() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const[formData,setFormData]=useState({
    oldPassword:"",
    newPassword:"",
    confirmPassword:""
  });

  

 const handleChange=(e)=>{
   setFormData({...formData,[e.target.name]:e.target.value});
 }

  
  const handleSubmit = async (e) => { 
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("新密碼與確認密碼不一致！");
      return;
    }
    if (formData.newPassword.length < 8) {
      toast.error("新密碼長度必須至少 8 個字元");
      return;
    }

    try {
      // API 呼叫
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      
      
      toast.success("密碼修改成功！請使用新密碼重新登入。");
      logout();
      navigate("/login");

    } catch (error) {
    
      console.error("Change password error:", error);
      toast.error(error.response?.data?.statusMsg || "密碼修改失敗，請確認舊密碼是否正確！");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
      <PageTitle title="Change Password" />
      
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 w-full max-w-sm bg-white p-6 rounded shadow-md">
        
        <div>
          <label htmlFor="oldPassword" className="block mb-1 text-gray-700">舊密碼 (Old Password)</label>
          <input 
            type="password" 
            id="oldPassword" 
            name="oldPassword"
            value={formData.oldPassword} 
            onChange={handleChange}      
            placeholder="請輸入舊密碼" 
            required 
            minLength={5} 
            maxLength={20}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block mb-1 text-gray-700">新密碼 (New Password)</label>
          <input 
            type="password" 
            id="newPassword" 
            name="newPassword"
            value={formData.newPassword} 
            onChange={handleChange}      
            placeholder="請輸入新密碼" 
            required 
            minLength={8} 
            maxLength={20}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-1 text-gray-700">確認新密碼 (Confirm Password)</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword"
            value={formData.confirmPassword} 
            onChange={handleChange}         
            placeholder="請再次輸入新密碼" 
            required 
            minLength={8} 
            maxLength={20}
            className="border p-2 rounded w-full"
          />
        </div>

        
        <button type="submit" className="bg-blue-600 text-white py-2 rounded mt-2 hover:bg-blue-700 transition">
          Submit
        </button>

      </form>
    </div>
  );
}