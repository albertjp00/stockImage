import express from "express";
import { Controller } from "../controller/controller";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../utils/multer";



const router = express.Router();

const controller = new Controller();

router.post("/register",  controller.register);

router.post("/login", controller.login);

router.post("/verifyOtp", controller.verifyOtp);

router.post("/resendOtp", controller.resendOtp);

router.post("/forgotPassword", controller.forgotPassword);

router.post("/resetPassword", controller.resetPassword);

router.post("/image",authMiddleware,upload.array("images"),controller.addImage,);

router.get("/image/:page", authMiddleware, controller.getImages);

router.post("/changeOrder", authMiddleware, controller.changeOrder);

router.delete("/image/:id", authMiddleware, controller.deleteImage);

router.put("/imageEdit/:id", authMiddleware, controller.editImage);

export default router;
