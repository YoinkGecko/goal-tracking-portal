const prisma = require("../config/prisma");

const { hashPassword, comparePassword } = require("../utils/hashPassword");

const generateToken = require("../utils/generateToken");

const registerUser = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  });

  const token = generateToken(user);

  return {
    token,
    user,
  };
};

const loginUser = async (data) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordCorrect = await comparePassword(
    data.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);

  return {
    token,
    user,
  };
};

module.exports = {
  registerUser,
  loginUser,
};