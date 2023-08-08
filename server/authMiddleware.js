const jwt = require('jsonwebtoken');

// Middleware function to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
    // Get the token from the header (typically in the 'Authorization' header)
    const authHeader = req.headers.authorization;

    // Check if the token exists
    if (authHeader) {
        // The token is usually in the format "Bearer TOKEN_VALUE"
        const token = authHeader.split(' ')[1];

        // Verify the token using the JWT_SECRET from the environment variables
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            // If there's an error (e.g., token expired or is invalid), return a 403 (Forbidden) status
            if (err) {
                return res.sendStatus(403);
            }

            // Add the user payload from the JWT to the request object
            // This means in your routes, you can access the user's data (like user id or username) 
            // that you stored in the JWT payload
            req.user = user;

            // Proceed to the next middleware or the route handler
            next();
        });
    } else {
        // If no token is provided, return a 401 (Unauthorized) status
        res.sendStatus(401);
    }
};

module.exports = {
    authenticateJWT
};
