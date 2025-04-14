const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);


exports.signup = async (req, res) => {
  const { username, email, mobile, password, role } = req.body;

  if (!username || !email || !mobile || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!isValidMobile(mobile)) {
    return res.status(400).json({ message: 'Mobile must be 10 digits' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Role must be either user or admin' });
  }

  try 
  {
    const existing = await User.findOne({ email });
    if (existing) 
    {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, mobile, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};


exports.login = async (req, res) => {
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found with this email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
};
