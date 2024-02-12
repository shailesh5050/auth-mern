import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcrypt";
import jwt from "jsonwebtoken";
export async function signup(req, res, next) {
  const { username, email, password } = req.body;

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
export async function googleAuth(req, res, next) {
  const { name, email, photo } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      //random 8 digit password
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(password, 10);
      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          (Math.floor(Math.random() * (10000 - 10 + 1)) + 10).toString(),
        email,
        password: hashedPassword,
        profilePicture: photo,
      });
      const userRes = await newUser.save();
      // excluede password from user data
      delete userRes.password;

      const token = jwt.sign(
        { email: userRes.email, id: userRes._id },
        process.env.JWT
      );
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(201)
        .json({ ...userRes._doc, message: "User Created Successfully" });
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
    next(errorHandler(500, error.message));
  }
}

export function signout(req, res) {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Sign Out Success" });
}
