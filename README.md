# Autheer

Autheer is a Node.js authentication package that simplifies user authentication using JWT tokens and provides methods for user registration and login. You do not need to create auth logic everytime you are creating a NodeJS application, just import _autheer_ and you are good to go.

## Installation

To install Autheer, use npm:
`npm install autheer`

## Usage

Here's how you can use Autheer in your Node.js application:

### ENV Variables

Before you begin to use the package, you have to create a file named .env on the root file of your project if you do not have one.

For example, for a fresh application called _my_app_ and add a .env file in it, you can use the following command:

`mkdir my_app && cd my_app && touch .env && echo "# .env file\n\nJWT_SECRET=Top53cre7\nTOKEN_EXPIRY="2d"\nPORT=3003" > .env && touch users.json && echo "[]" > users.json && touch .gitignore && echo "node_modules\n.env\nusers.json" > .gitignore`

This command will create a folder called my_app (Change it to whatever you need to call your app), add a .env file in it, add JWT secret and its expiry and the node port to the .env, it will also create an empty users.json file for you. You only need to change the secret in the .env to another secret and add token expiry to something suitable for you e.g. 2d, 1h, 3y, 3w etc. The command will also add a .gitignore file and add node_modules folder, .env file and users.json file in it to prevent them from being commited to a GIT repo.

A completedn .env file can look like:

```env
# .env file

JWT_SECRET=Top53cre7
TOKEN_EXPIRY="2d"
PORT=3003
```

### Creating A new App

Create a new express app (or any other), for a quick node app, once inside the my_app directory above; you can use the initialization command.

`npm init`

Respond to all the questions then install Express and all of this app dependencies using:

`npm install express jsonwebtoken bcrypt dotenv`

Once that is done you can create a file called index.js and use any editor to open it. In the editor create a basic Express application like so:

```javascript
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const port = process.env.PORT;

const { authenticateToken, loginUser, registerUser, getUsers, saveUsers } = require("autheer");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Put your routes here

// Start the server
app.listen(port, () => {
  console.log("Server is listening on: " + port);
});
```

### Initializing Admin

Your app must have at least a single admin user in order to allow some routes to be accessible. This package will help you to create that user, just create a route with any name and ask it to initialize the user you put in body payload. To do this, in the app create a new route call it e.g. _initialize_ then run the app and access the route via POST with email and password in body, the package will create a new admin account using details you send to it. The route may look like:

```javascript
// Put your routes here
app.post("/users/initialize", async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = registerUser(email, password);
    res.status(201).json({
      success: true,
      message: newUser,
    });
  } catch (error) {
    console.error(error.message);
    return "Error in initializing";
  }
});
```

To access this route, start the application with `node index.js` then when it says server is listening, go to your tool of choice like cURL or Insomnia or Postman and issue a POST request to the route: `http://localhost:3003/users/initialize` and the Content-Type is application/json with the following format:

```json
{ "email": "dummy@example.com", "password": "GoodPassword" }
```

_**NOTE** Change the password to something good for you!_

This will create the first initial user that you can use to access other routes that are secured such as registering a user, finding a user and deleting a user.

### Login User

To create a login route, just add another route below the initializer, then use loginUser() method available in Autheer. The route can look like:

```javascript
// Login an existing user
app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isAuthenticated = await loginUser(email, password);

    if (isAuthenticated) {
      const users = getUsers();
      const user = users.find((u) => u.email === email);
      const secret = process.env.JWT_SECRET;
      const expiry = process.env.TOKEN_EXPIRY;
      let token = jwt.sign({ email: email, id: user.id }, secret, { expiresIn: expiry });
      res.status(200).json({ success: true, message: token });
    } else {
      throw new Error("Authentication failed!");
    }
  } catch (error) {
    console.error(error.message);
    return "Error in login";
  }
});
```

To access the login route, one must send a POST request with a JSON content containing a valid registered email and password, if it is the first time, this must be the credentials used in the initialization process. If it is successful it will respond with a token like:

```json
{
  "success": true,
  "message": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWQiOiIxOGIwMjJmZi1lMWI0LTQ0ZjUtYTcwNC1iZmYzNDViNDU3OWEiLCJpYXQiOjE2OTQ3OTg2NDUsImV4cCI6MTY5NDk3MTQ0NX0.NS3n8i7EL8xfj_XlhSy3kviChvWI7gdo3El_S9-eCoY"
}
```

### Register New User

To register a new user, a similar route must be created in the `index.js` for registration, it is similar to the login route but it utilized registerUser() method. It can look like:

```javascript
// Register a new user
app.post("/users/register", async (req, res) => {
  try {
    authenticateToken(req);

    const { email, password } = req.body;
    const newUser = registerUser(email, password);
    res.status(200).json({ success: true, message: await newUser });
  } catch (error) {
    console.error(error.message);
    return "Error registering user";
  }
});
```

To use this route, you have to access the endpoint http://localhost:3003/users/register and use POST method with paylod JSON like:

```json
{
  "email": "another-dummy@example.com",
  "password": "whatta-Pass"
}
```

And add a Header called Authorization with content being the token that you received from the LOGIN route. e.g. _"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWQiOiIxOGIwMjJmZi1lMWI0LTQ0ZjUtYTcwNC1iZmYzNDViNDU3OWEiLCJpYXQiOjE2OTQ3OTg2NDUsImV4cCI6MTY5NDk3MTQ0NX0.NS3n8i7EL8xfj_XlhSy3kviChvWI7gdo3El_S9-eCoY"_

If it is successfull, you will get a response that shows you the success and the created user details:

```json
{
  "success": true,
  "message": {
    "id": "cd23d3c4-c6d1-49d8-9b6b-e10c9faceae1",
    "email": "another-dummy@example.com",
    "active": true
  }
}
```

### Find a specific user

Autheer can help you to find a specific user by using the user ID, this needs you to send a GET request to `localhost:3003/users/user-id-here` and use the following code for your find user route:

```javascript
// Find a specific user
app.get("/users/:id", async (req, res) => {
  try {
    authenticateToken(req);

    const users = getUsers();
    const id = req.params.id;
    const user = users.find((u) => u.id === id);
    res.status(200).json({ success: true, message: (await user) || "User not found!" });
  } catch (error) {
    console.error(error.message);
    return "Error searching user";
  }
});
```

If a user exists, this will return a success status and a message that contains the found user details like:

```json
{
  "success": true,
  "message": {
    "id": "da4dd118-73c9-4097-aade-997205c3f856",
    "email": "4901@example.com",
    "password": "$2b$10$EbvGikTWwhfqWiUh1aCwbeJo0s3EOLr4vfv7W280FFwy4aDGaMsYu",
    "active": true
  }
}
```

### Update a User

To update a user, the following route needs to be put in your index.js below the register route:

```javascript
// Update user details
app.patch("/users/:id", async (req, res) => {
  try {
    authenticateToken(req);

    const users = getUsers();
    const userToUpdate = users.find((u) => u.id === req.params.id);
    if (userToUpdate) {
      if (req.body.email != null) {
        userToUpdate.email = req.body.email;
      }
      if (req.body.active != null) {
        userToUpdate.active = req.body.active;
      }
      if (req.body.password != null) {
        userToUpdate.password = bcrypt.hashSync(req.body.password, 10);
      }
      await saveUsers(users);
      res.status(200).json({ success: true, message: await userToUpdate });
    } else {
      throw new Error("Invalid user ID!");
    }
  } catch (error) {
    console.error(error.message);
    return "Error updating user";
  }
});
```

If a user exists and you want to update any detail, you have to send a PATCH request to this endpoint `localhost:3003/users/user-id-here` e.g. `localhost:3003/users/cd23d3c4-c6d1-49d8-9b6b-e10c9faceae1` and use the payload with only the fields that you want to update e.g. active and password:

```json
{
  "active": false,
  "password": "NewP@55w0rd"
}
```

Likewise, you will get a success response and a new updated user object.

### List All Users

To list all users that have been registered and their details, you need to send a GET request with an Authorization token as you did in REGISTER to the endpoint `localhost:3003/users`, the route should have code that looks like:

```javascript
// List all users
app.get("/users", async (req, res) => {
  try {
    authenticateToken(req);
    const users = await getUsers();
    res.status(200).json({ success: true, message: await users });
  } catch (error) {
    console.error(error.message);
    return "Error listing users";
  }
});
```

If the request is successfull you will get a JSON response with success and message with the list of acc users in the system like:

```json
{
  "success": true,
  "message": [
    {
      "id": "130db08e-cef8-4bdb-9997-444aabe656b6",
      "email": "5703@example.com",
      "password": "$2b$10$GoCjXJoHQxhVIEFMui1OjOv3.B8qKcsevUwev9NXHFu34haoUQYHG",
      "active": false
    },
    {
      "id": "9ba4e6d9-ebff-4ced-a583-9cad84918c2c",
      "email": "5046@example.com",
      "password": "$2b$10$2Z3H2yQfwFC3lZGImMVdReF0URxEVS.DhH2CWLyY2NukTRL3Qz0LW",
      "active": false
    },
    {
      "id": "e5f8ac4f-b1ca-4612-8de4-9fbeca710ec3",
      "email": "7412@example.com",
      "password": "$2b$10$cTpWPB/dQpS.9PFY9wbzIuoRWInLmtH6Ip/y5jiDXtcWI8tV2AFIu",
      "active": true
    }
  ]
}
```

### Delete a User

To delete a user, you have to use the delete endpoint `localhost:3003/users/user-id-here` and use an actual id of the user then send a DELETE method and the user will be deleted. The route to delete users can look like:

```javascript
// Delete a specific user
app.delete("/users/:id", async (req, res) => {
  try {
    authenticateToken(req);

    const users = getUsers();
    const id = req.params.id;
    const userToDelete = users.find((u) => u.id === id);
    if (userToDelete) {
      const index = users.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.splice(index, 1);
        await saveUsers(users);
        res.status(200).json({ success: true, message: `User with ID: ${id} deleted!` });
      } else {
        console.error(`User with ID ${id} not found.`);
      }
    } else {
      throw new Error("Invalid user ID!");
    }
  } catch (error) {
    console.error(error.message);
    return "Error deleting user";
  }
});
```

The response will show you if the request was successfull and the ID of the just deleted user in case you want to keep records. The response will look like:

```json
{
  "success": true,
  "message": "User with ID: ff3d48a9-75ac-4af7-877e-99767b079486 deleted!"
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit/ "The MIT License") file for details.

## Author

Kizito S.M.

# Version

1.0.1
