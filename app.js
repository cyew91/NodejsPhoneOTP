require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

var index = require("./routes/index");
var register = require("./routes/register");
var user = require("./routes/user");
var verify = require("./routes/verify");
var status = require("./routes/status");
var cors = require("cors");
const isUndefined = require("lodash/isUndefined");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(index);
app.use(register);
app.use(user);
app.use(verify);
app.use(status);
app.use(cors());
cors({ credentials: true, origin: true });

app.use((error, req, res, next) => {
   let errorMessage = "Something went wrong...";
   console.log(error);
   if (!isUndefined(error.data)) {
      // Error message from Joi validator.
      errorMessage = error.data[0].message.replace(/"/g, "");
   }

   if (!isUndefined(error.name) && error.name === "CustomError") {
      // Error message from custom_error.js
      errorMessage = error.message;
   }

   res.send({
      statusCode: error.statusCode || 400,
      errorMessage: errorMessage
   });
});

const server = app.listen(process.env.PORT || 5000, () => {
   console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});

module.exports = app;
