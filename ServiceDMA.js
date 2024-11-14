const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
let bodyParser = require("body-parser");
let methodOverride = require("method-override");
// const authMiddleware = require("./middleware/AuthMIddleware");
const cookieParser = require("cookie-parser");

const ServiceRoute = require("./routes/ServiceRoute");
const ProductRoute = require("./routes/ProductRoute");
const UserRoute = require("./routes/UserRoute");
const TransactionRoute = require("./routes/TransactionRoute");
const RefreshTokenRoute = require("./routes/RefreshTokenRoute");
const ReportRoute = require("./routes/ReportRoute");

const app = express();

// Set up session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and set up session middleware for Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  methodOverride(function (req, res, next) {
    if (Buffer.isBuffer(req.body)) {
      req.body = req.body.toString();
      req.body = JSON.parse(req.body);
    }
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range, x-api-key, x-forwarded-for"
  );
  if (req.method === "OPTIONS") {
    return res.json(200);
  } else {
    return next();
  }
});

// Routes with authentication
app.use(cookieParser());
// app.use((req, res, next) => {
//   if (req.path === "/login" || req.path === "/register") {
//     return next();
//   }
//   authMiddleware(req, res, next);
// });

ServiceRoute.routesConfig(app);
ProductRoute.routesConfig(app);
UserRoute.routesConfig(app);
TransactionRoute.routesConfig(app);
RefreshTokenRoute.routesConfig(app);
ReportRoute.routesConfig(app);

app.use("/storage", express.static(__dirname + "/files/storage"));

var server = require("http").createServer(app);
server.listen(process.env.PORT, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Service DMA on Port ", host, port);
});
