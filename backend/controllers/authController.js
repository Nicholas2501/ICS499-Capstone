const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Register a new user
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      Name: name,
      Email: email,
      Password: hashedPassword,
      Role: role || "Employee", // Default role is Employee
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

// Login an existing user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { Email: email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT
    const token = jwt.sign(
      { userId: user.id, role: user.Role },
      "your-secret-key", // Replace with a strong secret key
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Failed to log in" });
  }
};

// Export the functions
module.exports = { register, login };