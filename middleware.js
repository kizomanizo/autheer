/**
 * @module Autheer Middleware
 * @version 1.1.0
 * @description A set of authentication and user management functions
 *   designed to simplify user authentication and authorization in Node.js
 *   applications.
 * @author Kizito S.M.
 * @email kizomanizo@gmail.com
 */

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import { randomUUID } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const users = getUsers() || "No users found";

/**
 * Authenticate a user based on a JWT token.
 *
 * @param {Object} request - The request object containing headers.
 * @returns {Object|boolean} - The verified user object or false if
 *   authentication fails.
 * @throws {Error} - If there's an error during token verification.
 */
function authenticateToken(request) {
  const bearer = request.headers.authorization;
  const token = bearer.split(" ")[1];
  if (!token) {
    throw new Error("Access denied, invalid token");
  } else {
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      return verified;
    } catch (error) {
      throw new Error("Error authenticating token: " + error.message);
    }
  }
}

/**
 * Authenticate a user by email and password.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {boolean|string} - True for successful authentication, false for
 *   failed authentication, or an error message in case of an error.
 */
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

/**
 * Register a new user with the provided email and password.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Object|string} - The registered user object or an error message if
 *   registration fails.
 * @throws {Error} - If there's an error during user registration.
 */
async function registerUser(email, password) {
  try {
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const id = randomUUID();
    const hashedPassword = bcrypt.hashSync(password, 10);

    users.push({ id, email, password: hashedPassword, isActive: true });
    saveUsers(users);

    const newUser = users.find((u) => u.id === id);

    return newUser;
  } catch (error) {
    console.error("Error registering user:", error.message);
    return error.message;
  }
}

/**
 * Get the list of registered users from the local JSON file.
 *
 * @returns {Array|Object|string} - The list of registered users, an error
 *   message, or an empty array.
 * @throws {Error} - If there's an error reading the user data file.
 */
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

/**
 * Save the updated user list to the local JSON file after registration.
 *
 * @param {Array} users - The updated user list.
 * @returns {string|Error} - A success message or an error message if the
 *   operation fails.
 */
function saveUsers(users) {
  try {
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2), "utf8");
    return "User registered.";
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

// prettier-ignore
export {
  authenticateToken,
  loginUser,
  registerUser,
  getUsers,
  saveUsers,
};
