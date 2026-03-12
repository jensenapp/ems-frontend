import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ListEmployeeComponent, { employeeLoader } from "./components/ListEmployeeComponent"
import EmployeeComponent, { employeeDetailLoader } from "./components/EmployeeComponent"
import HomeComponent from "./components/HomeComponent"
import { createBrowserRouter, RouterProvider,createRoutesFromElements,Route } from "react-router-dom";
import App from './App.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import './index.css'
import ProtectedRoute from "./components/ProtectedRoute"
import Login, { loginAction } from './components/Login.jsx'
import { AuthProvider } from './store/auth-context.jsx'
import Register, { registerAction } from './components/Register.jsx'


// 定義路由變數
const routeDefinitions = createRoutesFromElements(
  <Route path="/" element={<App />} errorElement={<ErrorPage />}>
    
    {/* 公開路由 (所有人都能看) */}
    <Route index element={<HomeComponent />} />
    <Route path="/login" element={<Login />} action={loginAction} />
    
    {/* 受保護的路由 (必須登入才能看) */}
    <Route element={<ProtectedRoute />}>
      <Route path="/employees" element={<ListEmployeeComponent />} loader={employeeLoader}/>
      <Route path="/add-employee" element={<EmployeeComponent />} loader={employeeDetailLoader} key="add"/>
      <Route path="/update-employee/:id" element={<EmployeeComponent />}  loader={employeeDetailLoader} key="update"/>
      <Route path="/register" element={<Register />} action={registerAction} />
    </Route>

  </Route>
);

// 將定義好的路由結構傳入 createBrowserRouter
const appRouter = createBrowserRouter(routeDefinitions);


createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    
   
    <AuthProvider>
     <RouterProvider router={appRouter} />
    </AuthProvider>
    
    <ToastContainer
      position="top-center"        // 位置：上方置中
      autoClose={3000}             // 自動關閉時間：3秒
      hideProgressBar={false}      // 是否隱藏進度條
      newestOnTop={false}          // 最新訊息是否在最上方
      closeOnClick                 // 點擊關閉
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover               // 主題：light, dark, colored
      transition={Bounce}          // 動畫效果
    />
   
  </StrictMode>,
)
