import { ImageModel } from "../models/images";
import { UserModel } from "../models/profile";

export class Repository {
  findUser = async (email: string) => {
    try {
      const user = await UserModel.findOne({ email: email });
      return user;
    } catch (error) {
      console.log(error);
    }
  };


  create = async (name : string , email: string, phone: number, password: string) => {
    try {
        console.log('database',name , email , phone );
        
      const user = await UserModel.create({name , email, phone , password });
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  addImage = async (id: string , title: string, image: string , order : number) => {
    try {        
      const user = await ImageModel.create({ userId : id , title:title  , image:image , order : order });
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  getImage = async (title : string) => {
    try {
        
      const images = await ImageModel.findOne({title});
      return images;
    } catch (error) {
      console.log(error);
    }
  };

  getCount = async (id : string) => {
    try {
        
      const count = await ImageModel.countDocuments({userId : id});
      return count;
    } catch (error) {
      console.log(error);
    }
  };


  getImages = async (id : string , page : number) => {
    try {
      const limit = 10
      const count = await ImageModel.countDocuments({userId : id})
      const totalPages = Math.ceil(count/limit)
      const skip = (page-1)*limit
      const images = await ImageModel.find({userId : id}).skip(skip).limit(limit).sort({order : 1})
      return {images , totalPages } ;
    } catch (error) {
      console.log(error);
    }
  };

  changeOrder = async (id:string  , order : number) => {
  
    const change = await ImageModel.findByIdAndUpdate(id ,{ order : order})

    };


    imageDelete = async (imageId : string) => {
  
    return await ImageModel.findByIdAndDelete(imageId)

    };

    imageEdit = async (imageId : string , title : string) => {
  
    return await ImageModel.findByIdAndUpdate(imageId , {title})

    };
}
