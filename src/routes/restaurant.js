import express from "express"
const router = express.Router();
import securityMiddleware from "../middlewares/security.js"
import restaurantController from "../controllers/restaurant.js"


router.get("/", restaurantController.getAllRestaurants);
router.get("/user",securityMiddleware.checkIfOwner,restaurantController.getRestaurantByOwnerId);
router.get("/:restId", restaurantController.getRestaurant);
router.post("/create",securityMiddleware.checkIfOwner,restaurantController.createRestaurant);
router.post("/:restId/edit",securityMiddleware.checkIfOwner,restaurantController.editRestaurant);
router.delete("/:restId/delete",securityMiddleware.checkIfOwner,restaurantController.deleteRestaurant);
export default router 