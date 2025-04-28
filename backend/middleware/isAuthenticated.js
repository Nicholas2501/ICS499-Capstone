const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    // User is not logged in, allow access to the route
    return next();
  }

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken; // Attach the decoded user information to the request object

    // Redirect logged-in users to the dashboard or another appropriate page
    return res.redirect("/dashboard");
  } catch (error) {
    // Invalid or expired token, treat as unauthenticated
    return next();
  }
};

module.exports = isAuthenticated;