import apiClient from "../../api/apiClient";


const BASE="/auth";

export const login=(data)=>apiClient.post(BASE+"/login",data);

export const changePassword=(data)=>apiClient.put(BASE+"/change-password",data);
