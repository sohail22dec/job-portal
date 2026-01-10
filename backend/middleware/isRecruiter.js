import { User } from '../models/user.model.js';

export default async (req, res, next) => {
    try {
        // req.userId is set by isAuthenticated middleware
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check if user role is recruiter
        if (user.role === 'recruiter') {
            next();
        } else {
            return res.status(403).json({
                message: "Access denied. Only recruiters can perform this action.",
                success: false
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error checking recruiter status",
            success: false
        });
    }
};
