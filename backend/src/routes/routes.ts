import express from "express"
import { Controller } from "../controller/controller";
import multer from 'multer'
import { authMiddleware } from "../middleware/authMiddleware";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,'src/assets');
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  },
});

const upload = multer({storage})

const router = express.Router();

const controller = new Controller

router.post('/register',authMiddleware , controller.register)

router.post('/login',controller.login)

router.post('/addImage',upload.array('images'),authMiddleware , controller.addImage)

router.get('/getImages/:page',authMiddleware,controller.getImages)

router.post('/changeOrder',authMiddleware,controller.changeOrder)

router.delete('/deleteImage/:id',authMiddleware,controller.deleteImage)

router.put('/imageEdit/:id',authMiddleware,controller.editImage)


export default router