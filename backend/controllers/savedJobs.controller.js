import { User } from "../models/user.model.js";
import asyncHandler from "express-async-handler";

// Toggle save job (save if not saved, unsave if already saved)
export const toggleSaveJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const userId = req.userId; // From isAuthenticated middleware

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Check if job is already saved
    const jobIndex = user.savedJobs.indexOf(jobId);

    if (jobIndex > -1) {
        // Job is saved, so unsave it
        user.savedJobs.splice(jobIndex, 1);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Job unsaved successfully",
            isSaved: false
        });
    } else {
        // Job is not saved, so save it
        user.savedJobs.push(jobId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Job saved successfully",
            isSaved: true
        });
    }
});

// Get all saved jobs for current user
export const getSavedJobs = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const user = await User.findById(userId).populate({
        path: 'savedJobs',
        populate: {
            path: 'createdBy',
            select: 'fullname email profile'
        }
    });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    return res.status(200).json({
        success: true,
        savedJobs: user.savedJobs || []
    });
});

// Check if specific job is saved
export const checkIfSaved = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const isSaved = user.savedJobs.some(id => id.toString() === jobId);
    return res.status(200).json({
        success: true,
        isSaved
    });
});
