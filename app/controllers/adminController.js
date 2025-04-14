const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};


exports.getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};




exports.adminAddUser = async (req, res) => {
  const { username, email, mobile, password, role } = req.body;

  if (!username || !email || !mobile || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

  if (!isValidEmail(email)) 
  {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!isValidMobile(mobile)) 
  {
    return res.status(400).json({ message: "Mobile must be 10 digits" });
  }

  if (password.length < 6) 
  {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  if (!['user', 'admin'].includes(role)) 
  {
    return res.status(400).json({ message: "Role must be either 'user' or 'admin'" });
  }

  try {

    const existingUser = await User.findOne({ email });

    if (existingUser) 
    {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      mobile,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully by admin", user: newUser });

  } catch (err) {
    res.status(500).json({ message: "Server error while creating user", error: err.message });
  }
};





exports.updateUser = async (req, res) => {
  try {
    const { ID, username, email, mobile, role } = req.body;

    if (!ID || !mongoose.Types.ObjectId.isValid(ID)) {
      return res.status(400).json({ message: "Valid user ID required" });
    }

    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (mobile) updateFields.mobile = mobile;
    if (role) {
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Role must be either 'user' or 'admin'" });
      }
      updateFields.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      ID,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found for update" });
    }

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

exports.countUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (err) {
    res.status(500).json({ message: "Error counting users", error: err.message });
  }
};
