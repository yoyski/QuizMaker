import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
    
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "sign up error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({
        message: "Incorrect Email",
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({
        message: "Incorrect Password",
      });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true, //true if using HTTPS
      })
      .json({
        message: "Login Successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    return res.status(403).json({ message: "Error in Login server", error });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged Out" });
};

export const getMe = async (req, res) => {
  try {
    // req.user comes from protect middleware (decoded JWT)
    res.json({
      user: { id: req.user.id, name: req.user.name, email: req.user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
