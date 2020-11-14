if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOverride  = require('method-override');

const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(methodOverride('_method'));
/* To serve static files such as images, CSS files, and JavaScript files, 
use the express.static built-in middleware function in Express. */
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));//sending value by url

//---------------------- Database Connection--------------------------------//
//connection for database
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

//-------------------------------------------------------//
app.use("/", indexRouter);
app.use("/authors", authorRouter);//if we want to use routes folder that why we added
app.use("/books", bookRouter); 

app.listen(process.env.PORT || 3000); //for hosting in which port
