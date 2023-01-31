import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import * as url from 'url';
import path from "path";

import AuthRoute from "./routes/auth.js";
import CategoryRoute from "./routes/category.js"
import ProductRoute from "./routes/product.js";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app = express()
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

//db connection
mongoose
.connect("mongodb+srv://admin:admin@ecom22.8rg4isq.mongodb.net/?retryWrites=true&w=majority", {
   useNewUrlParser: true,
   useUnifiedTopology: true
}).then(()=> console.log("DB Connected"))
.catch((err) => console.log("DB ERROR =>", err));

app.use(cors({
  origin: "http://localhost:3000"
}))
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));

//router middleware
app.use("/api", AuthRoute);
app.use("/api", CategoryRoute);
app.use("/api", ProductRoute);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname) + "/public/index.html");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})