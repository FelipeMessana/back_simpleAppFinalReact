import { Router } from "express";
import {
  auth,
  adminAuth,
  createUsers,
  logIn,
  addProduct,
  deleteProduct,
} from "../controller/users";

const routerUsers = Router();

routerUsers.post("/login", logIn);
routerUsers.post("/user/usersp", createUsers);
routerUsers.post("/product", auth, adminAuth, addProduct);
routerUsers.delete("/product/:id", auth, adminAuth, deleteProduct);

export default routerUsers;
