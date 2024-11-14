const appUrl = process.env.API_URL
const ServiceController = require('../controllers/ServiceControllers')

exports.routesConfig = function (app) {
    app.get('/' + appUrl , ServiceController.Index)
}
