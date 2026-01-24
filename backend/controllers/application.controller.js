import asyncHandler from 'express-async-handler';
import { Application } from '../models/application.model.js';
import { Job } from '../models/job.model.js';

// Apply for a job
export const applyForJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const { coverLetter } = req.body;
    const applicantId = req.userId;

    // Get resume from file upload
    const resume = req.file ? req.file.path : null;

    if (!resume) {
        return res.status(400).json({
            message: 'Resume is required (PDF format)',
            success: false
        });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
        return res.status(404).json({
            message: 'Job not found',
            success: false
        });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
        job: jobId,
        applicant: applicantId
    });

    if (existingApplication) {
        return res.status(400).json({
            message: 'You have already applied for this job',
            success: false
        });
    }

    // Create application
    const application = await Application.create({
        job: jobId,
        applicant: applicantId,
        coverLetter,
        resume
    });

    return res.status(201).json({
        message: 'Application submitted successfully',
        success: true,
        application
    });
});

// Check if user has applied to a job
export const checkApplicationStatus = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const applicantId = req.userId;

    const application = await Application.findOne({
        job: jobId,
        applicant: applicantId
    });

    return res.status(200).json({
        hasApplied: !!application,
        applicationId: application?._id,
        status: application?.status,
        success: true
    });
});

// Get all applications for current user (job seeker)
export const getMyApplications = asyncHandler(async (req, res) => {
    const applicantId = req.userId;

    const applications = await Application.find({ applicant: applicantId })
        .populate({
            path: 'job',
            populate: {
                path: 'createdBy',
                select: 'fullname email'
            }
        })
        .sort({ createdAt: -1 });

    return res.status(200).json({
        applications,
        success: true
    });
});

// Get all applicants for a job (recruiter only)
export const getJobApplicants = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const recruiterId = req.userId;

    // Check if job exists and belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
        return res.status(404).json({
            message: 'Job not found',
            success: false
        });
    }

    if (job.createdBy.toString() !== recruiterId) {
        return res.status(403).json({
            message: 'Not authorized to view applicants for this job',
            success: false
        });
    }

    const applications = await Application.find({ job: jobId })
        .populate('applicant', 'fullname email phoneNumber')
        .sort({ createdAt: -1 });

    return res.status(200).json({
        applications,
        success: true
    });
});

// Update application status (recruiter only)
export const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const recruiterId = req.userId;

    // Validate status
    const validStatuses = ['pending', 'reviewing', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Invalid status',
            success: false
        });
    }

    const application = await Application.findById(id)
        .populate('job')
        .populate('applicant', 'fullname email phoneNumber');

    if (!application) {
        return res.status(404).json({
            message: 'Application not found',
            success: false
        });
    }

    // Check if recruiter owns the job
    if (application.job.createdBy.toString() !== recruiterId) {
        return res.status(403).json({
            message: 'Not authorized to update this application',
            success: false
        });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
        message: 'Application status updated successfully',
        success: true,
        application
    });
});
