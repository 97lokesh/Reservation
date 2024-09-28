import utilSecurity from '../util/security.js'

const checkJWT = function checkJWT(req, res, next) {
  let token = req.get("Authorization") || req.query.token;
  if (token && token.startsWith("Bearer ")) {
    token = token.replace("Bearer ", "");
    try {
      const jwt = utilSecurity.verifyJWT(token);
      req.user = jwt.payload;
    } catch (err) {
      console.log(err);
      req.user = null;
    }
  }
  next();
}

const checkLogin = function checkLogin(req, res, next) {
  if (!req.user) return res.status(401).send({message:"Unauthorized"});
  next();
}

const checkIfOwner = function checkIfOwner(req, res, next) {
  if (!req.user) return res.status(401).send({message:"Unauthorized"})
  if (!req.user.isOwner) return res.status(401).send({message:"Unauthorized"})
  next();
}

export default {
    checkJWT,
  checkLogin,
  checkIfOwner
}