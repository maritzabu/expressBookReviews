const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const data = await Promise.resolve(books);
        res.send(JSON.stringify(data, null, 4));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const data = await Promise.resolve(books);
        const isbn = req.params.isbn;

        if (data[isbn]) {
            res.send(JSON.stringify(data[isbn], null, 4));
        } else {
            res.status(404).send("Book not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const data = await Promise.resolve(books);
        const author = req.params.author;
        const result = {};

        Object.keys(data).forEach(key => {
            if (data[key].author === author) {
                result[key] = data[key];
            }
        });

        res.send(JSON.stringify(result, null, 4));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const data = await Promise.resolve(books);
        const title = req.params.title;
        const result = {};

        Object.keys(data).forEach(key => {
            if (data[key].title === title) {
                result[key] = data[key];
            }
        });

        res.send(JSON.stringify(result, null, 4));
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
    try {
        const data = await Promise.resolve(books);
        const isbn = req.params.isbn;

        if (data[isbn]) {
            res.send(JSON.stringify(data[isbn].reviews, null, 4));
        } else {
            res.status(404).send("Book not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports.general = public_users;
