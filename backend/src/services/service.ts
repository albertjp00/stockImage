import { Repository } from "../repository/repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { generateOtp } from "../utils/otp";
import { sendOtp } from "../utils/sendOtp";
import { otpStore } from "../utils/otpStore";
import { AddImageDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyOtpDto } from "../dto/dto";
import { resourceLimits } from "worker_threads";
import { mapImagesToDto } from "../mapper/mapper";

export interface ImageOrder {
  id: string;
  order: number;
}

export class Service {
  private _repository = new Repository();

  loginRequest = async (dto : LoginDto) => {
    try {
      const { email, password } = dto;
      const user = await this._repository.findUser(email);

      if (!user) {
        return { success: false, message: "Invalid email" };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, message: "Incorrect Password" };
      }
      // const id = user._id.toString()

      const accessToken = jwt.sign({ id: user._id }, process.env.secret_key!, {
        expiresIn: "1h",
      });

      return { success: true, token: accessToken };
    } catch (error) {
      console.log(error);
    }
  };

  registerRequest = async (dto : RegisterDto) => {
    try {
      const { name, phone, email, password } = dto;
      const user = await this._repository.findUser(email);
      if (user) {
        return { success: false, message: "User Exists" };
      }

      const otp = generateOtp();
      const defaultEmail = email;
      await sendOtp(defaultEmail, otp);

      otpStore.set(email, {
        name,
        email,
        password,
        phone,
        otp,
        expiresAt: Date.now() + 60 * 1000,
      });

      console.log("register request ", otpStore);

      return { success: true, message: "OTP SEND to MAIL" };
    } catch (error) {
      console.log(error);
    }
  };

  verifyOtp = async (dto : VerifyOtpDto) => {
    try {
      const {otp , email } = dto
      const storedData = otpStore.get(email);

      if (!storedData) {
        return { success: false, message: "OTP NOT FOUND" };
      }

      if (Date.now() > storedData.expiresAt) {
        otpStore.delete(email);
        return { success: false, message: "OTP EXPIRED" };
      }

      if (storedData.otp !== otp) {
        return { success: false, message: "INVALID OTP" };
      }

      const hashedPassword = await bcrypt.hash(storedData.password, 10);

      const result = await this._repository.create(
        storedData.name,
        email,
        storedData.phone,
        hashedPassword,
      );

      return { success: true, message: "Registration Succesfull" };
    } catch (error) {
      console.log(error);
    }
  };

  resendOtp = async (email: string) => {
    try {
      const otp = generateOtp();

      const storedData = otpStore.get(email);
      console.log("storedData", storedData);

      if (!storedData) {
        return { success: false };
      }

      const defaultEmail = email;
      await sendOtp(defaultEmail, otp);

      otpStore.set(email, {
        ...storedData,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });
      return { success: true, message: "Otp send" };
    } catch (error) {
      console.log(error);
    }
  };

  forgotPassword = async (email: string) => {
    try {
      const user = await this._repository.findUser(email);
      if (!user) {
        return { success: false, message: "Invalid Email" };
      }

      const otp = generateOtp();

      otpStore.set(email, {
        name: user.name,
        phone: user.phone,
        password: user.password,
        email: email,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      const defaultEmail = email;
      await sendOtp(defaultEmail, otp);

      return { success: true };
    } catch (error) {
      console.log(error);
    }
  };

  async resetPassword(dto : ResetPasswordDto) {
    try {
      const {email , newPassword} = dto
      const user = await this._repository.findUser(email);
      if (!user) {
        return { success: false, message: "USER NOT FOUND" };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this._repository.changePassword(user.id, hashedPassword);

      return { success: true, message: "PASSWORD CHANGED" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "RESET_FAILED" };
    }
  }

  addImage = async (dto : AddImageDto) => {
    try {

      const {userId , titles , files} = dto
      const images = files.map((file, index) => ({
        title: Array.isArray(titles) ? titles[index] : titles,
        image: file.filename,
        index: index,
      }));

      const count = (await this._repository.getCount(userId)) || 0;

      for (const img of images) {
        const imageExists = await this._repository.getImage(img.title);

        if (imageExists) {
          return { success: false, message: `${img.title} already exists` };
        }
        const order = count + img.index + 1;
        await this._repository.addImage(userId, img.title, img.image, order);
      }

      return { success: true, message: "Images uploaded successfully" };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Image upload failed" };
    }
  };

  getImages = async (id: string, page: number) => {
    try {
      const result = await this._repository.getImages(id, page);    
      const images = mapImagesToDto(result?.images ?? [])      
      return {images  , totalPages : result?.totalPages};
    } catch (error) {
      console.log(error);
    }
  };

  changeOrder = async (images: ImageOrder[]) => {
    console.log("images ", images);

    for (const img of images) {
      this._repository.changeOrder(img.id, img.order);
    }
    return true;
  };

  deleteImage = async (imageId: string) => {
    const deletedImage = await this._repository.imageDelete(imageId);

    if (deletedImage) {
      const filePath = path.join("src/assets", deletedImage.image);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("File delete error:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
    }
    return true;
  };

  editImage = async (imageId: string, title: string) => {
    
    this._repository.imageEdit(imageId, title);
    return true;
  };
}
