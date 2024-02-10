import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcrypt";
import jwt from "jsonwebtoken";
export async function signup(req, res, next) {
  const { username, email, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ username });
  if (user) {
    next(errorHandler(200, "User already Exist"));
    return;
  }
  // Hash the password
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    const userRes = await newUser.save();
    res
      .json({ ...userRes._doc, message: "User Created Successfully" })
      .status(201);
  } catch (err) {
    next(errorHandler(500, err.message));
  }
}

export async function signin(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      next(errorHandler(401, "User not found"));
      return;
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      next(errorHandler(401, "Invalid Credentials"));
      return;
    }
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT
    );
    // Exclude password from user data
    const userData = { ...user._doc };
    delete userData.password;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ ...userData, message: "Sign In Success" });
  } catch (error) {
    next(errorHandler(500, err.message));
  }
}
