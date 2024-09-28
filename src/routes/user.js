import express from "express"
import userController from "../controllers/user.js"
import securityMiddleware from "../middlewares/security.js"
const router = express.Router();

router.get("/login", userController.getLoginDetails);
router.post("/login", userController.loginUser);
router.post("/create", userController.createUser);
router.post("/logout",securityMiddleware.checkLogin,userController.logoutUser);
export default router