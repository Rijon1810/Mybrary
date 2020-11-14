const express = require("express");
const router = express.Router();
const Author = require("../models/author");

//All author Route
router.get("/", async (req, res) => {
  let searchOptions = {}; //store all the serach options empty object

  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i"); //case sensative
  }
  try {
    const authors = await Author.find(searchOptions);

    //rendering index of views folder
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query,
    });
  } catch (err) {
    res.redirect("/");
  }
});

//New Author route
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });//creating a new author
});

//Create author Route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name, //when we request from the request body we are getting name and added to the database
  });
  try {
    const newAuthor = await author.save();
    //res.redirect(`authors/${newAuthor.id`);
    res.redirect(`authors`);//save done back to main page that why redirect
  } catch (err) {
    res.render("authors/new", {
      author: author,//as it is wrong what we wrote it will come again
      errorMessage: "Error creating Author",
    });
  }
});

module.exports = router;
