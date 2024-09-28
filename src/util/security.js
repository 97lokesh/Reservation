import  jwt from "jsonwebtoken"
import 'dotenv/config'


function createJWT(payload) {
  return jwt.sign(
    
    { payload },
    process.env.SECRET,
    { expiresIn: "24h" }
  );
}

function getExpiry(token) {
  const payloadBase64 = token.split(".")[1];
  const decodedJson = Buffer.from(payloadBase64, "base64").toString();
  const decoded = JSON.parse(decodedJson);
  const exp = decoded.exp;
  return exp;
}

function verifyJWT(token) {
  const payload = jwt.verify(
    token,
    process.env.SECRET,
    function (err, decoded) {
      
      if (err) {
        return null;
      }
      return decoded;
    }
  );
  return payload;
}


export default {
    createJWT,
  getExpiry,
  verifyJWT
}