import { AddImageDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyOtpDto } from "../dto/dto";
import { AuthRequest } from "../middleware/authMiddleware";
import { Service } from "../services/service";
import { Request, Response } from "express";

export class Controller {
  private _service = new Service();

  login = async (req: Request, res: Response) => {
    try {
      const dto: LoginDto = {
      email: req.body.email,
      password: req.body.password
    };
      const result = await this._service.loginRequest(dto);
      if (!result) return;
      if (result.success) {
        res.status(200).json({ success: true, token: result.token });
        return;
      }

      res.json({ success: false, message: result.message });
    } catch (error) {
      console.log(error);
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: RegisterDto = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password
    };

      const result = await this._service.registerRequest(dto);

      console.log('register',result);
      

      if (!result?.success) {
        res.json({ success: false, message: result?.message });
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Registration failed",
      });
    }
  };

  verifyOtp = async (req: Request, res: Response) => {
    try {
      const dto: VerifyOtpDto = {
      email: req.body.email,
      otp: req.body.otp
    };
      const result = await this._service.verifyOtp(dto);
      console.log('result ',result);
      
      if (result?.success) {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, message: result?.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

    resendOtp = async (req: Request, res: Response) => {
    try {
      const {  email } = req.body;

      const result = await this._service.resendOtp(email);
      console.log('result ',result);
      
      if (result?.success) {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    } catch (error) {
      console.log(error);
    }
  };

      forgotPassword = async (req: Request, res: Response) => {
    try {
      const {  email } = req.body;

      const result = await this._service.forgotPassword(email);
      console.log('result ',result);
      
      if (result?.success) {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false , message : result?.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const dto: ResetPasswordDto = {
      email: req.body.email,
      newPassword: req.body.newPassword
    };

      const result = await this._service.resetPassword(dto);
     res.json({success : true})
    } catch (error) {
      console.log(error);
    }
  };

addImage = async (req: AuthRequest, res: Response) => {
  try {

    const dto: AddImageDto = {
      userId: req.user?.id as string,
      titles: req.body.titles,
      files: req.files as Express.Multer.File[]
    };

    const result = await this._service.addImage(dto);

    res.json(result);

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

  getImages = async (req: AuthRequest, res: Response) => {
    try {
      const id = req.user?.id;
      const page = Number(req.params.page);

      const result = await this._service.getImages(id as string, page);

      res.json({
        success: true,
        images: result?.images,
        totalPages: result?.totalPages,
      });
    } catch (error) {
      console.log(error);
    }
  };

  changeOrder = async (req: Request, res: Response) => {
    const images = req.body.images;

    this._service.changeOrder(images);

    res.json({ success: true });
  };


  deleteImage = async (req: Request, res: Response) => {

    const id = req.params.id
    
    this._service.deleteImage(id as string);

    res.json({ success: true });
  };

  editImage = async (req: Request, res: Response) => {

    const id = req.params.id
    const title = req.body.title
    
    this._service.editImage(id as string, title);

    res.json({ success: true });
  };
}
