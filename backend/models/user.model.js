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
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String },  // URL to resume file (for job seekers)
        resumeOriginalName: { type: String },
        profilePhoto: {
            type: String,
            default: ""
        },
        company: {  // For recruiters
            name: { type: String },
            description: { type: String },
            website: { type: String },
            logo: { type: String }  // URL to company logo
        }
    },
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
