const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const users = getUsers() || "No users found";
const crypto = require("crypto");
require("dotenv").config();

function authenticateToken(request) {
  const token = request.headers.authorization;
  if (!token) {
    throw new Error("Access denied, invalid token");
    return false;
  } else {
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      return verified;
    } catch (error) {
      throw new Error("Error authenticating token:");
    }
  }
}

async function loginUser(email, password) {
  const user = users.find((u) => u.email === email);
  if (!user) return false;

  try {
    if (await bcrypt.compare(password, user.password)) {
      return true;
    }
  } catch (error) {
    console.error("Error comparing passwords:", error.message);
    return error.message;
  }
  return false;
}

async function registerUser(email, password) {
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    throw new Error("User already exists");
  }
  try {
    const id = crypto.randomUUID();
    const hashedPassword = bcrypt.hashSync(password, 10);

    users.push({ id, email, password: hashedPassword, active: true });
    saveUsers(users);

    const newUser = users.find((u) => u.id === id);

    return newUser;
  } catch (error) {
    console.error("Error registering user:", error.message);
    return error.messsage;
  }
}

function getUsers() {
  try {
    const usersFile = fs.readFileSync("./users.json");
    const usersParsed = JSON.parse(usersFile);
    return usersParsed;
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2), "utf8");
    return "User registered.";
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

module.exports = {
  authenticateToken,
  loginUser,
  registerUser,
  getUsers,
  saveUsers,
};
