const User = require("../models/userModel");


const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    return passwordRegex.test(password);
};


const registerUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (!isPasswordValid(password)) {
        return res.status(400).json({
            message:
                "Password must be 8-20 characters, include at least one uppercase letter, one number, and contain no spaces.",
        });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists." });
        }

        const user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); 
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve users." });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete user." });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    if (!username && !password) {
        return res.status(400).json({ message: "At least one field is required to update." });
    }

    try {
        const updates = {};
        if (username) updates.username = username;
        if (password) {
            if (!isPasswordValid(password)) {
                return res.status(400).json({
                    message:
                        "Password must be 8-20 characters, include at least one uppercase letter, one number, and contain no spaces.",
                });
            }
            updates.password = password;
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User updated successfully.", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update user." });
    }
};

module.exports = { registerUser, getAllUsers, deleteUser, updateUser };
