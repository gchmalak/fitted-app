 export type UserRole ="owner"|"admin" |"user";
 
 export interface User{
    _id:string;
    email:string;
    username:string;
    role:UserRole;
    bio?:string;
    avatarUrl:string;
    isActive:boolean;
    isAdmin:boolean;
    createdAt:string;
    updatedAt:string;
}