const appUrl = process.env.API_URL;
const ProductController = require("../controllers/ProductControllers");
const authMiddleware = require("../middleware/AuthMIddleware");
const multer = require("multer");

exports.routesConfig = function (app) {
  app.get("/" + appUrl + "products", authMiddleware, ProductController.Index);
  app.get(
    "/" + appUrl + "product/:id",
    authMiddleware,
    ProductController.Index
  );
  app.post(
    "/" + appUrl + "product",
    multer().any(),
    authMiddleware,
    ProductController.Create
  );
  app.delete(
    "/" + appUrl + "product/:id",
    authMiddleware,
    ProductController.Delete
  );
  app.put(
    "/" + appUrl + "product/:id",
    authMiddleware,
    ProductController.Update
  );
};
