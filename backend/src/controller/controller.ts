import { AuthRequest } from "../middleware/authMiddleware";
import { Service } from "../services/service";
import { Request, Response } from "express";

export class Controller {
  private _service = new Service();

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this._service.loginRequest(email, password);
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
      const { name, phone, email, password } = req.body;
      console.log(name, email, password, phone);

      const result = await this._service.registerRequest(
        name,
        phone,
        email,
        password,
      );

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

addImage = async (req: AuthRequest, res: Response) => {
  try {

    const id = req.user?.id;
    const titles = req.body.titles;
    const files = req.files as Express.Multer.File[];

    const result = await this._service.addImage(
      id as string,
      titles,
      files
    );

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
