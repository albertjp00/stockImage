import { Repository } from "../repository/repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export interface ImageOrder {
  id: string;
  order: number;
}

export class Service {
  private _repository = new Repository();

  loginRequest = async (email: string, password: string) => {
    try {
      const user = await this._repository.findUser(email);

      if (!user) {
        return { success: false, message: "Invalid email" };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        return {success : false , message : "Incorrect Password"}
      }
      // const id = user._id.toString()
      
      const accessToken = jwt.sign({ id: user._id }, process.env.secret_key!, { expiresIn: "1h" });

      return {success : true , token : accessToken}
    } catch (error) {
      console.log(error);
    }
  };

  registerRequest = async (name : string , phone : number ,email : string , password: string) => {
    try {
      const user = await this._repository.findUser(email);
      if (user) {
        return { success: false, message: "User Exists" };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await this._repository.create(name , email, phone , hashedPassword);

      return {success : true , message : "Registration Succesfull"};
    } catch (error) {
      console.log(error);
    }
  };


addImage = async (
  id: string,
  titles: string[] | string,
  files: Express.Multer.File[]
) => {
  try {

    const images = files.map((file, index) => ({
      title: Array.isArray(titles) ? titles[index] : titles,
      image: file.filename,
      index: index
    }));

    const count  = await this._repository.getCount(id) || 0

    for (const img of images) {

      const imageExists = await this._repository.getImage(img.title);

      if (imageExists) {
        return { success: false, message: `${img.title} already exists` };
      }
      const order = count + img.index + 1
      await this._repository.addImage(id, img.title, img.image , order);

    }

    return { success: true, message: "Images uploaded successfully" };

  } catch (error) {
    console.log(error);
    return { success: false, message: "Image upload failed" };
  }
};

    getImages = async (id : string , page : number) => {
    try {
      const images = await this._repository.getImages(id , page );

      return images;
    } catch (error) {
      console.log(error);
    }
  };

  changeOrder = async (images : ImageOrder[]) => {
  
    console.log('images ',images);
    
    for (const img of images) {      
      this._repository.changeOrder(img.id,  img.order );
    }
    return true
  };

  deleteImage = async (imageId : string) => {
  
    
      this._repository.imageDelete(imageId)
    return true
  };

  editImage = async (imageId : string , title : string) => {
  
      this._repository.imageEdit(imageId , title )
    return true
  };

}
