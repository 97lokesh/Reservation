import express from "express"
const router = express.Router();
import bookingController from "../controllers/booking.js"
import securityMiddleware from "../middlewares/security.js"


router.get("/",securityMiddleware.checkLogin,bookingController.getAllByUserId);
router.get("/restaurant",securityMiddleware.checkIfOwner,bookingController.getAllByRestaurantId);
router.get("/:id", securityMiddleware.checkLogin, bookingController.getOneById);
router.post("/create",securityMiddleware.checkLogin,bookingController.createBooking);
router.post("/:id", bookingController.updateBooking);
router.delete("/:id",securityMiddleware.checkLogin,bookingController.deleteBooking);

export default router