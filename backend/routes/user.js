const express = require("express");
const {
    registerUser,
    getAllUsers,
    deleteUser,
    updateUser,
    getUser,
} = require("../controllers/userController");

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Get all users
router.get("/", getAllUsers);
router.get('/users/:id', getUser);

// Delete a user by ID
router.delete("/:id", deleteUser);

// Update a user by ID
router.put("/:id", updateUser);

module.exports = router;