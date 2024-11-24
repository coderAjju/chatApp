import jwt from "jsonwebtoken";
export const tokenGenerator = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
  });
};
