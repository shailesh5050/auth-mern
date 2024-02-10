import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcrypt";
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
