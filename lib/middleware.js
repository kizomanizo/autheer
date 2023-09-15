const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const users = getUsers() || "No users found";
const crypto = require("crypto");
require("dotenv").config();
const apihelper = require("./apihelper");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return apihelper.success(req, res, 401, "Access denied, invalid token");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return apihelper.failure(req, res, 400, "Invalid token!");
  }
}

async function authenticateUser(email, password) {
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
    console.error("Error registering user: " + error.message);
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

async function getUserByEmail(email) {
  try {
    const user = users.find((u) => u.email === email);
    return user;
  } catch (error) {
    console.error("Error getting user by email: " + error);
    return error.message;
  }
}

async function getUserById(id) {
  try {
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error("User not found!");
    return user;
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2), "utf8");
    console.log("Saving registration...");
    return "User registered.";
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

module.exports = {
  authenticateToken,
  authenticateUser,
  registerUser,
  getUsers,
  saveUsers,
};
