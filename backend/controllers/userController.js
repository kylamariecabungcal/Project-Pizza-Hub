const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const SECRET_KEY = 'admin';




const createUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password before saving:', hashedPassword); 

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

   
    console.log('Password from DB:', user.password);  
    console.log('Password from request (trimmed):', password.trim()); 


    const isMatch = await bcrypt.compare(password.trim(), user.password);

    console.log('Password comparison result:', isMatch); 

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};







const getUser = async (req, res) => {
  const userId = req.params.id;  

  try {
    const user = await User.findById(userId);  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { loginUser, getUser, createUser };
