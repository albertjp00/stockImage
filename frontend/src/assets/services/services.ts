import api from '../../../api/api'
import type { ILoginForm, IRegisterForm } from "../../interfaces/interface";

export const  registerUser = async(formData : IRegisterForm)=>{
    try {
        const res  = await api.post("/register", formData)
        return res
    } catch (error) {
        console.log(error);
        throw error
        
    }
}

export const  loginUser = async(formData : ILoginForm)=>{
    try {
        const res  = await api.post("/login", formData)
        return res
    } catch (error) {
        console.log(error);
        throw error
        
    }
}

export const  logoutUser = async()=>{
    try {
        localStorage.removeItem('userToken')
        // const res  = await api.post("/logout")
        
    } catch (error) {
        console.log(error);
        throw error
        
    }
}

export const  addImage = async(formData : FormData)=>{
    try {
        const res  = await api.post("/addImage",formData ,{
            headers :{
                "Content-Type " : "multipart/form-data"
            },
        })
        return res
    } catch (error) {
        console.log(error);
        throw error
        
    }
}

export const  getImages = async(page : number)=>{
    try {
        const res  = await api.get(`/getImages/${page}`)
        return res
    } catch (error) {
        console.log(error);
        throw error
        
    }
}


export const  changeOrder = async(reordered:{id : string , order : number}[])=>{
    try {
        console.log(reordered);
        
        const res  = await api.post(`/changeOrder`,{
             images: reordered 
        })
        return res
    } catch (error) {   
        console.log(error);
        throw error
    }
}


export const deleteImage = (id: string) => {
  return api.delete(`/deleteImage/${id}`);
};

export const editImage = (id: string, title: string) => {
  return api.put(`/imageEdit/${id}`, { title });
};