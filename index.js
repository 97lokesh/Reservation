
import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import "dotenv/config"
import cors from "cors"
import indexRouter from './src/routes/index.js'
import userRouter from "./src/routes/user.js"
import restaurantRouter from "./src/routes/restaurant.js"
import bookingRouter from "./src/routes/booking.js"
import securityMiddleware from  "./src/middlewares/security.js"
const  app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(securityMiddleware.checkJWT);
app.use(indexRouter);
app.use(userRouter);
app.use(restaurantRouter);
app.use(bookingRouter);
app.use(function (req, res) {
  res.status(404).send({message:"Not Found"});
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
});

app.listen(process.env.PORT,()=>console.log("App listening PORT : "+process.env.PORT))
 