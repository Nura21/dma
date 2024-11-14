const jwt = require("jsonwebtoken");
const responseCode = require("../config/env.response");

const authMiddleware = (req, res, next) => {
  let apiResult = {};

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    apiResult.meta = responseCode.Fail.unauthenticated;

    return res.status(401).json(apiResult);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      apiResult.meta = responseCode.Fail.forbidden;

      return res.status(403).json(apiResult);
    }

    req.user = decoded;

    next();
  });
};

module.exports = authMiddleware;
