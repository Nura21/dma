const appUrl = process.env.API_URL;
const RefreshTokenControllers = require("../controllers/RefreshTokenControllers");
const authMiddleware = require("../middleware/AuthMIddleware");

exports.routesConfig = function (app) {
  app.get("/" + appUrl + "refreshToken", RefreshTokenControllers);
};
