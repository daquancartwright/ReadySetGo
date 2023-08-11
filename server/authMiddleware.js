// authMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware function to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
    // Get the token from the header (typically in the 'Authorization' header)
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ error: 'No token provided.' });
}

    // Check if the token exists
    if (authHeader) {
        // Format is as such "Bearer TOKEN_VALUE"
        const token = authHeader.split(' ')[1];

        // Log the token to the console
        // console.log('Extracted Token:', token);

        // Verify the token using the JWT_SECRET from the environment variables
        jwt.verify(token, 'KotoAmatsukami@1', (err, user) => {
            // If there's an error (e.g., token expired or is invalid), return a 403 (Forbidden) status
            if (err) {
                console.log("JWT Verification Error:", err);
                return res.status(403).json({ error: 'Failed to authenticate token.' });
            }

            // Add the user payload from the JWT to the request object
            // This means in your routes, you can access the user's data (like user id or username) 
            // that you stored in the JWT payload
            req.user = user;

            // Proceed to the next middleware or the route handler
            next();
        });
    } else {
        console.log('Authorization Header Missing')
        // If no token is provided, return a 401 (Unauthorized) status
        res.sendStatus(401);
    }
};

module.exports = {
    authenticateJWT
};
