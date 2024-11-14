const appUrl = process.env.API_URL;
const TransactionController = require("../controllers/TransactionControllers");

exports.routesConfig = function (app) {
  app.get("/" + appUrl + "transactions", TransactionController.Index);
  app.get("/" + appUrl + "transaction/:id", TransactionController.Detail);
  app.post("/" + appUrl + "transaction", TransactionController.Create);
  app.get("/" + appUrl + "transactions/income", TransactionController.Income);
  // app.delete('/' + appUrl + 'transaction/:id', TransactionController.Delete)
};
