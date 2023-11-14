/**
 * @module Autheer
 * @version 1.1.0
 * @description A set of authentication and user management functions
 *   designed to simplify user authentication and authorization in Node.js
 *   applications.
 * @author Kizito S.M.
 * @email kizomanizo@gmail.com
 */

// Importing functions from the middleware module
// prettier-ignore
import {
  authenticateToken,
  loginUser,
  registerUser,
  getUsers,
  saveUsers,
} from "./middleware.js";

// Exporting the imported functions to make them available for other modules
// prettier-ignore
export {
  authenticateToken,
  loginUser,
  registerUser,
  getUsers,
  saveUsers,
};
