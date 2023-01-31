import express from "express";
import ExpressFormidable from "express-formidable";

//controllers
import {create, update, list, read, photo, remove, filterProduct, productCount, listProducts, productsSearch } from "../controllers/product.js"

//middlewares
import { requireSignin, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/product", requireSignin, isAdmin, ExpressFormidable(), create);
router.put("/product/:productId", requireSignin, isAdmin,ExpressFormidable(), update);
router.get("/products", list);
router.get("/product/:slug", read);
router.get("/product/photo/:productId", photo);
router.delete("/product/:productId", remove);

router.post("/filter-products", filterProduct);
router.get("/products-count", productCount);
router.get("/list-products/:page", listProducts);
router.get("/products/search/:keyword", productsSearch);


export default router;