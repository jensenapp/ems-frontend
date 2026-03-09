import React, { useState,useEffect} from 'react'
import { deleteEmployee, listEmployees } from './services/EmployeeService';
import { useNavigate } from 'react-router-dom';

const ListEmployeeComponent = () => {

    const[employees,setEmployees]=useState([]);

    const navigate=useNavigate();

    const handleAddEmployee=()=>navigate("/add-employee");

 
   const getAllEmployee=()=>{
  listEmployees().then((response)=>{
        setEmployees(response.data)
     }).catch((error)=>{
        console.error(error);
     });
   }
  

    useEffect(()=>{
      getAllEmployee();
    },[]);


      const removeEmployee=(id)=>{
       deleteEmployee(id).then((response)=>{
            getAllEmployee();
       }).catch((error)=>{
         console.error(error);
       });
      }

      const updateEmployee=(id)=>{
      navigate(`/update-employee/${id}`);
    }

  return (
    <div className="container">
      <h1 className="text-center">List of Employees</h1>
      <button className="btn btn-primary mb-2" onClick={handleAddEmployee}>
        Add Employee
      </button>
      <table className="table table-striped table-bordered">
        <thead>
            <tr>
                <th>Id</th>
                <th>firstName</th>
                <th>lastName</th>
                <th>email</th>
                <th>action</th>
            </tr>
        </thead>
        <tbody>
            {employees.map((item)=>(
                <tr key={item.employeeId}>
                    <td>{item.employeeId}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.email}</td>
                    <td>
                      <button className='btn btn-info' onClick={()=>updateEmployee(item.employeeId)}>Update</button>
                       <button className='btn btn-danger' style={{ marginLeft: '10px' }} onClick={()=>removeEmployee(item.employeeId)}>Delete</button>
                      </td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListEmployeeComponent