import { Router } from "express";
import { getProducts, createProduct } from "../controller/productController";

const routerProducts = Router();

routerProducts.get("/products", getProducts);
routerProducts.post("/products", createProduct);

export default routerProducts;
