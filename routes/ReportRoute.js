const appUrl = process.env.API_URL;
const ReportController = require("../controllers/ReportController");
const authMiddleware = require("../middleware/AuthMIddleware");

exports.routesConfig = function (app) {
  app.get("/" + appUrl + "reports", authMiddleware, ReportController.Index);
  app.post("/" + appUrl + "reports/:id", authMiddleware, ReportController.Exchange); // 1 = download, 0 = email
};
