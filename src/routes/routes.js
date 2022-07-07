const express = require('express');
const router = express.Router();

const bookController = require("../controllers/bookController");
const userController = require("../controllers/userController");
const middlewares = require("../middlewares/auth")


let { createUser, userLogin } = userController;
let { createBook,deleteBook } = bookController;
let { authenticate, authorise } = middlewares;

// ==========> Create User Api <=============   
router.post("/register", createUser);

// ===========> Login User Api <=============   
router.post("/login", userLogin);

// ===========> Create Books Api <=============
router.post("/books", authenticate ,createBook);

// ===========> Delete Books Api <=============
router.delete("/books/:bookId", authenticate ,deleteBook);



module.exports = router;
