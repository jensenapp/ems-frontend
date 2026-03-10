import apiClient from "../../api/apiClient";


const BASE="/auth";

export const login=(data)=>apiClient.post(BASE+"/login",data);

export const register=(data)=>apiClient.post(BASE+"/register",data);