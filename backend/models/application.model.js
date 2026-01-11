import mongoose from 'mongoose';

const application = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'accepted', 'rejected'],
        default: 'pending'
    },
    coverLetter: {
        type: String,
        trim: true
    },
    resume: {
        type: String, // URL or file path
        trim: true
    }
}, { timestamps: true });

// Index for faster queries
application.index({ job: 1, applicant: 1 }, { unique: true }); // Prevent duplicate applications
application.index({ applicant: 1 }); // Fast lookup of user's applications
application.index({ job: 1 }); // Fast lookup of job's applicants

export const Application = mongoose.model('Application', application);
