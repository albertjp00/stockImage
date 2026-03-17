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
        const res  = await api.post("/image",formData ,{
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
        const res  = await api.get(`/image/${page}`)
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
  return api.delete(`/image/${id}`);
};

export const editImage = (id: string, title: string) => {
    console.log(title,'asdlkfhalsdkjfh');
    
  return api.put(`/imageEdit/${id}`, { title });
};


export const  verifyOtp = async(otp : string , email : string)=>{
    // eslint-disable-next-line no-useless-catch
    try {
        const res  = await api.post(`/verifyOtp`,{otp , email})
        return res
    } catch (error) {   
        throw error
    }
}

export const  resendOtp = async(email:string)=>{
    try {
        
        const res  = await api.post(`/resendOtp`,{email})
        return res
    } catch (error) {   
        console.log(error);
        throw error
    }
}


export const  forgotPassword = async(email:string)=>{
    try {
        
        const res  = await api.post(`/forgotPassword`,{email})
        return res
    } catch (error) {   
        console.log(error);
        throw error
    }
}

export const  resetPassword = async(email:string , newPassword : string)=>{
    try {
        
        const res  = await api.post(`/resetPassword`,{email , newPassword})
        return res
    } catch (error) {   
        console.log(error);
        throw error
    }
}


export const  verifyResetOtp = async(otp : string , email : string)=>{
    // eslint-disable-next-line no-useless-catch
    try {
        const res  = await api.post(`/verifyResetOtp`,{otp , email})
        return res
    } catch (error) {   
        throw error
    }
}