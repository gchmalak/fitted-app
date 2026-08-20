import { UserRole } from "./user";

 export interface LoginRequest {
    email:string;
    password:string;
}
export interface RegisterRequest{
username:string;
email:string;
password:string;
role?:UserRole;
adminCode?:string;
}
