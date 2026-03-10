import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/routes";
import path from "node:path";



const app = express();

dotenv.config();


app.use(cors({
  origin : process.env.frontend_url,
  methods : ["GET" , "POST" , "PUT" , "PATCH" , "DELETE"],
  credentials : true
}));


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Running...");
});

app.use("/assets", express.static(path.join(process.cwd(), "src/assets")));


app.use("/", router);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));

export default app;