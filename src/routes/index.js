import express from "express"
var router = express.Router();


router.get("/", function (req, res, next) {
  res.send({message:"Welcome to express"});
});

export default router