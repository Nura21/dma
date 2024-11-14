const appUrl = process.env.API_URL;
const UserController = require("../controllers/UsersControllers");
const authMiddleware = require("../middleware/AuthMIddleware");

exports.routesConfig = function (app) {
  app.post("/" + appUrl + "register", UserController.RegisterUser);
  app.post("/" + appUrl + "login", UserController.loginUser);
  app.delete(
    "/" + appUrl + "logout",
    authMiddleware,
    UserController.logoutUser
  );
  app.get(
    "/" + appUrl + "users/profile",
    authMiddleware,
    UserController.getUserProfile
  );
};
