/**
 * @module Autheer
 * @version 1.0.0
 * @description A set of authentication and user management functions designed to simplify user authentication and authorization in Node.js applications.
 * @author Kizito S.M.
 * @email kizomanizo@gmail.com
 */

const { authenticateToken, loginUser, registerUser, getUsers, saveUsers } = require("./middleware");

/**
 * Authenticate a user based on a JWT token.
 *
 * @param {Object} request - The request object containing headers.
 * @returns {Object|boolean} - The verified user object or false if authentication fails.
 * @throws {Error} - If there's an error during token verification.
 */
function authenticateToken(request) {
  return authenticateToken(request);
}

/**
 * Authenticate a user by email and password.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {boolean|string} - True for successful authentication, false for failed authentication,
 *                            or an error message in case of an error.
 */
function loginUser(email, password) {
  return loginUser(email, password);
}

/**
 * Register a new user with the provided email and password.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Object|string} - The registered user object or an error message if registration fails.
 * @throws {Error} - If there's an error during user registration.
 */
function registerUser(email, password) {
  return registerUser(email, password);
}

/**
 * Get the list of registered users from the local JSON file.
 *
 * @returns {Array|Object|string} - The list of registered users, an error message, or an empty array.
 * @throws {Error} - If there's an error reading the user data file.
 */
function getUsers() {
  return getUsers();
}

/**
 * Save the updated user list to the local JSON file after registration.
 *
 * @param {Array} users - The updated user list.
 * @returns {string|Error} - A success message or an error message if the operation fails.
 */
function saveUsers(users) {
  return saveUsers(users);
}

module.exports = {
  authenticateToken,
  loginUser,
  registerUser,
  getUsers,
  saveUsers,
};

/*import { authenticateToken, loginUser, registerUser, getUsers, saveUsers } from "./middleware";

export default {
  authenticateToken,
  loginUser,
  registerUser,
  getUsers,
  saveUsers,
};
*/
