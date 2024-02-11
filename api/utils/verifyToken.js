import jwt from "jsonwebtoken";
export async function verifyToken(req, res, next) {
  const token = req.cookies.access_token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Token" });
  try {
    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized User" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Error" });
  }
}
