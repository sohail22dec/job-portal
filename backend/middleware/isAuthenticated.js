import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const isAuthenticated = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401);
        throw new Error("User not authenticated");
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
        res.status(401);
        throw new Error("Invalid token");
    }

    // Attach userId to request object for use in controllers
    req.userId = decoded.userId;
    next();
});

export default isAuthenticated;
