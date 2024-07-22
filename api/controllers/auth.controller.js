import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res
      .status(201)
      .json({ message: "Account created successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) return res.status(401).json({ message: "User not found" });
    const isPassvalid = await bcrypt.compare(password, user.password);
    if (!isPassvalid)
      return res.status(401).json({ message: "Invalid password" });

    const age = 1000 * 60 * 60 * 24 * 10;
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: age,
    });
    const { password:userPassword, ...userInfo } = user;
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json({ message: "Login successful", userInfo });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
export const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Logged out successfully" });
  //db operatins
};
