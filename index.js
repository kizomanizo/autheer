/**
 * @module Autheer
 * @version 1.0.0
 * @description A set of authentication and user management functions designed to simplify user authentication and authorization in Node.js applications.
 * @author Kizito S.M.
 * @email kizomanizo@gmail.com
 */

const { authenticateToken, loginUser, registerUser, getUsers, saveUsers } = require("./middleware");

module.exports = {
  authenticateToken,
  loginUser,
  registerUser,
  getUsers,
  saveUsers,
};
