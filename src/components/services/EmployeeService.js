import apiClient from "../../api/apiClient";



const BASE="/employees";

export const listEmployees = () => apiClient.get(BASE); 
export const createEmployee = (employee) => apiClient.post(BASE,employee); 
export const getEmployee=(id)=>apiClient.get(BASE+"/"+id);
export const updateEmployee=(id,employee)=>apiClient.put(BASE+"/"+id,employee);
export const deleteEmployee=(id)=>apiClient.delete(BASE+"/"+id)