import bcryptjs from "bcrypt";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export async function updateUser(req, res, next) {
  const { id } = req.params;

  // Check if the user is authorized to update this profile
  if (req.user.id !== id) {
    return next(errorHandler(403, "Forbidden"));
  }

  let hashedPassword = null;
  // If a new password is provided, hash it
  if (req.body.password) {
    hashedPassword = await bcryptjs.hash(req.body.password, 10);
  }

  try {
    // Update user document in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword, // Update hashed password
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true } // Return updated document
    );

    // Remove password field from the response
    const user = { ...updatedUser._doc, message: "User Updated Successfully" };
    delete user.password;

    res.json(user).status(200);
  } catch (error) {
    errorHandler(500, error.message);
  }
}
