import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const register = asyncHandler(async (req, res) => {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
        res.status(400);
        throw new Error("Please provide fullname, email and password");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        fullname,
        email,
        password: hashedPassword,
        role,
    });

    // Generate JWT token for auto-login after registration
    const tokenData = {
        userId: newUser._id
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

    // Return user data without password
    const user = {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile
    };

    return res
        .status(201)
        .cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict'
        })
        .json({
            message: "Account created successfully",
            success: true,
            user
        });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        res.status(400);
        throw new Error("Please provide email, password and role");
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    // check role is correct or not
    if (role !== user.role) {
        res.status(403);
        throw new Error("Account doesn't exist with current role");
    }

    const tokenData = {
        userId: user._id
    };

    // jwt.sign is synchronous, no need for await
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

    // Prepare user data (exclude password)
    const userData = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile
    };

    return res
        .status(200)
        .cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict'
        })
        .json({
            user: userData,
        });
});

export const logout = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .cookie("token", "", { maxAge: 0 })
        .json({
            message: "Logged out successfully.",
            success: true
        });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    // req.userId comes from isAuthenticated middleware
    const userId = req.userId;

    let user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Update user fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills;

    await user.save();

    user = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile
    };

    return res.status(200).json({
        message: "Profile updated successfully.",
        user,
        success: true
    });
});

// Get current user profile
export const getMe = asyncHandler(async (req, res) => {
    // req.userId is set by isAuthenticated middleware
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({
        success: true,
        user
    });
});
