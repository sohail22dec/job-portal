import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: false
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['job_seeker', 'recruiter'],
        required: false
    },
    profile: {
        profilePhoto: {
            type: String,
            default: ""
        },
        // Job Seeker profile fields
        bio: {
            type: String,
            default: ""
        },
        skills: [{
            type: String
        }],
        resume: {
            type: String,
            default: ""
        },
        experience: [{
            company: { type: String, required: true },
            title: { type: String, required: true },
            startDate: { type: String, required: true },
            endDate: { type: String },
            currentlyWorking: { type: Boolean, default: false },
            description: { type: String }
        }],
        education: [{
            institute: { type: String, required: true },
            degree: { type: String, required: true },
            fieldOfStudy: { type: String },
            startYear: { type: String, required: true },
            endYear: { type: String }
        }],
        // Company info for recruiters
        company: {
            name: { type: String },
            description: { type: String },
            website: { type: String },
            logo: { type: String },
            address: { type: String }
        }
    },
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
