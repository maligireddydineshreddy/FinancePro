const User = require("../models/UserModel"); // Adjust the path to your User model
const bcrypt = require("bcrypt");

const UserController = {
  // Signup function
  signUp: async (req, res) => {
    try {
      const { name, email, password, income } = req.body;

      // Validate input
      if (!name || !email || !password || !income) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered." });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create the user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        income,
      });

      await newUser.save();

      // Remove password from response
      const userResponse = newUser.toObject();
      delete userResponse.password;

      res
        .status(201)
        .json({ message: "User registered successfully.", user: userResponse });
    } catch (error) {
      console.error("Signup error:", error);
      res
        .status(500)
        .json({ message: "Error signing up.", error: error.message });
    }
  },

  // Login function with migration support for old plaintext passwords
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Check if password is stored as bcrypt hash (starts with $2a$, $2b$, or $2y$)
      const isBcryptHash = user.password && (
        user.password.startsWith('$2a$') || 
        user.password.startsWith('$2b$') || 
        user.password.startsWith('$2y$')
      );

      let isMatch = false;

      if (isBcryptHash) {
        // New password format: use bcrypt comparison
        isMatch = await bcrypt.compare(password, user.password);
      } else {
        // Old password format: plaintext comparison (for backward compatibility)
        isMatch = user.password === password;
        
        // If login successful with old password, upgrade to bcrypt hash
        if (isMatch) {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          user.password = hashedPassword;
          await user.save();
          console.log(`Password upgraded to bcrypt for user: ${email}`);
        }
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password." });
      }

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({ message: "Login successful.", user: userResponse });
    } catch (error) {
      console.error("Login error:", error);
      res
        .status(500)
        .json({ message: "Error logging in.", error: error.message });
    }
  },

  // Get a single user with populated data
  getSingleUser: async (req, res) => {
    try {
      const { userId } = req.params;

      // Find the user by ID and populate expenses and savings
      const user = await User.findById(userId)
        .populate("expenses")
        .populate("savings")
        .populate("bills");

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json({ message: "User retrieved successfully.", user });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving user.", error: error.message });
    }
  },
};

module.exports = UserController;
