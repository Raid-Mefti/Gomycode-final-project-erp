import { Router } from "express";
import { getProducts } from "../controller/products";
const productRouter = Router();

productRouter.get("/", getProducts);

export default productRouter;
