import React, { useState,useEffect } from 'react'
import { listEmployees } from './services/EmployeeService';
import { useNavigate } from 'react-router-dom';

const ListEmployeeComponent = () => {

    const[employees,setEmployees]=useState([]);

    const navigate=useNavigate();

    const handleAddEmployee=()=>navigate("/add-employee");

    useEffect(()=>{
     listEmployees().then((response)=>{
        setEmployees(response.data)
     }).catch((error)=>{
        console.error(error);
     });
    },[]);


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
            </tr>
        </thead>
        <tbody>
            {employees.map((item)=>(
                <tr key={item.employeeId}>
                    <td>{item.employeeId}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.email}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListEmployeeComponent