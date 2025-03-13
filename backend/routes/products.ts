import { Router } from "express";
import { getProducts } from "../controller/products.js";
const productRouter = Router();

productRouter.get("/", getProducts);

export default productRouter;
