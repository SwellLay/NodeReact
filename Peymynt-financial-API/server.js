import express from "express";
import path from "path";
import favicon from "serve-favicon";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import routes from "./routes/index";
import authentication from "./routes/AuthenticationRoute";
import users from "./routes/UserRoute";
import customer from "./routes/CustomerRoute";
import business from "./routes/BusinessRoute";
import products from "./routes/ProductRoute";
import utilRoute from "./routes/UtilRoute";
import registration from "./routes/RegistrationRoute";
import taxes from "./routes/TaxRoute";
import estimates from "./routes/EstimateRoute";
import shareLink from "./routes/ShareLink";
import invoice from "./routes/InvoiceRoute";
import recurring from "./routes/RecurringRoute";
import checkout from "./routes/CheckoutRoute";
import payment from "./routes/PaymentRoute";
import refund from "./routes/RefundRoute";
import settings from "./routes/SettingRoute";
import aws from "./routes/AWSRoute";
import statement from "./routes/StatementRoute";
import vendor from "./routes/purchase/vendor.route";
import bill from "./routes/purchase/bill.route";
import receipt from "./routes/purchase/receipt.route";
import dashboard from "./routes/dashboard/dashboard.route";

import { } from "./schedular/reminderInvoice";

import { } from "./schedular/recurringInvoice";

import { } from "./util/db.config";

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(function (req, res, next) {
  req.basePath = __dirname;
  next();
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Authorization', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "x-peymynt-app-secret-key, x-peymynt-business-id, Authorization, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use("/", routes);
app.use("/api/v1/register", registration);
app.use("/api/v1/authenticate", authentication);
app.use("/api/v1/users", users);
app.use("/api/v1/customers", customer);
app.use("/api/v1/businesses", business);
app.use("/api/v1/products", products);
app.use("/api/v1/utility", utilRoute);
app.use("/api/v1/taxes", taxes);
app.use("/api/v1/estimates", estimates);
app.use("/api/v1/estimatesharelink", shareLink);
app.use("/api/v1/invoices", invoice);
app.use("/api/v1/recurring", recurring);
app.use("/api/v1/checkouts", checkout);
app.use("/api/v1/payments", payment);
app.use("/api/v1/refunds", refund);
app.use("/api/v1/settings", settings);
app.use("/api/v1/aws", aws);
app.use("/api/v1/statements", statement);

// Purchase routes
app.use("/api/v1/vendors", vendor);
app.use("/api/v1/bills", bill);
app.use("/api/v1/receipts", receipt);

// Dashboard route
app.use("/api/v1/dashboard", dashboard);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

Number.prototype.toFixedFloat = function (digits) {
  let re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
    m = this.toString().match(re);
  return m ? parseFloat(m[1]) : this.valueOf();
};
// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const port = process.env.PORT;
app.listen(port);
console.log("App listening on port " + port + " with environment : " + process.env.NODE_ENV);

module.exports = app;
