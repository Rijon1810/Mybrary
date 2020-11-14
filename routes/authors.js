const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");


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
    } catch {
        res.redirect("/");
    }
});

//New Author route
router.get("/new", (req, res) => {
    res.render("authors/new", {
        author: new Author()
    }); //creating a new author
});

//Create author Route
router.post("/", async (req, res) => {
    const author = new Author({
        name: req.body.name, //when we request from the request body we are getting name and added to the database
    });
    try {
        const newAuthor = await author.save();
        res.redirect(`authors/${newAuthor.id}`);
    } catch (err) {
        res.render("authors/new", {
            author: author, //as it is wrong what we wrote it will come again
            errorMessage: "Error creating Author",
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({
            author: author.id
        }).limit(6).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })

    } catch{
  
        res.redirect('/');
    }

})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render("authors/edit", {
            author: author
        });
    } catch {
        res.redirect('/authors');

    }

})

//update 

router.put('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
    } catch (err) {
        if (author == null) {
            res.redirect('/');
        } else {
            res.render("authors/edit", {
                author: author, //as it is wrong what we wrote it will come again
                errorMessage: "Error Updating Author",
            });
        }

    }
})
router.delete('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors');
    } catch (err) {
        if (author == null) {
            res.redirect('/');
        } else {
            res.redirect(`/authors/${author.id}`)
        }

    }
})

module.exports = router;