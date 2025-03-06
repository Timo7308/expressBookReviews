// Import necessary modules
const express = require('express');

// Import database of books and authentication functions
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

// Create a router instance for public user routes
const public_users = express.Router();

// Route: Register a new user
public_users.post("/register", (req, res) => {
  // Extract user data from request body
  const { username, password } = req.body;

  // Check if required fields are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username is already taken
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Hash the password before saving it to the database (using bcrypt, for example)
  const hashedPassword = hashPassword(password);

  // Save the user data to the database
  const newUser = { username, password: hashedPassword };
  users.push(newUser);

  return res.status(200).json({ message: "User registered successfully" });
});

// Function to hash the password
function hashPassword(password) {
  // Implement password hashing logic (using bcrypt or any other suitable library)
  return password; // For demonstration purposes, returning the password as is
}

// Route: Get the list of available books using promises and callbacks
public_users.get('/', function (req, res) {
  // Wrap your logic in a promise
  new Promise((resolve, reject) => {
    const availableBooks = Object.values(books.books); 

    if (availableBooks.length === 0) {
      reject(new Error("No books available"));
    } else {
      resolve(availableBooks);
    }
  })
  .then((availableBooks) => {
    return res.status(200).json(availableBooks);
  })
  .catch((error) => {
    return res.status(404).json({ message: error.message });
  });
});




// Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await getBookByISBN(isbn); // Await the promise from getBookByISBN
    return res.status(200).json(book); // Send the book if found
  } catch (error) {
    return res.status(404).json({ message: error.message }); 
  }
});

// Function to get book by ISBN (simulated async function)
async function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    const book = books.books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });
}




// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const booksByAuthor = await getBooksByAuthor(author); // Await the promise from getBooksByAuthor
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor); // Return books by the specified author
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Function to get books by author (simulated async function)
async function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books.books).filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject(new Error("No books found by this author"));
    }
  });
}




// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const booksByTitle = await getBooksByTitle(title); // Await the promise from getBooksByTitle
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle); // Return books with the specified title
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Function to get books by title (simulated async function)
async function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books.books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject(new Error("No books found with this title"));
    }
  });
}







module.exports = public_users;
