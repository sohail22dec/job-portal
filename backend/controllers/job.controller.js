import asyncHandler from 'express-async-handler';
import { Job } from '../models/job.model.js';

// POST /api/v1/job/post - Create a new job
export const postJob = asyncHandler(async (req, res) => {
    const { title, description, requirements, salary, location, jobType, experience, position } = req.body;

    if (!title || !description || !salary || !location || !jobType || experience === undefined) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const job = await Job.create({
        title,
        description,
        requirements: requirements || [],
        salary,
        location,
        jobType,
        experience,
        position: position || 1,
        createdBy: req.userId
    });

    res.status(201).json({
        success: true,
        job
    });
});

// GET /api/v1/job/all - Get all jobs
export const getAllJobs = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword || "";

    const query = {
        $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } }
        ]
    };

    const jobs = await Job.find(query)
        .populate({
            path: 'createdBy',
            select: 'fullname profile.company'
        })
        .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
        return res.status(404).json({
            message: "No jobs found",
            success: false
        });
    }

    res.status(200).json({
        success: true,
        jobs
    });
});

// GET /api/v1/job/:id - Get single job by ID
export const getJobById = asyncHandler(async (req, res) => {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
        .populate({
            path: 'createdBy',
            select: 'fullname email profile.company'
        });

    if (!job) {
        res.status(404);
        throw new Error("Job not found");
    }

    res.status(200).json({
        success: true,
        job
    });
});

// GET /api/v1/job/recruiter/jobs - Get all jobs posted by this recruiter
export const getRecruiterJobs = asyncHandler(async (req, res) => {
    const recruiterId = req.userId;

    const jobs = await Job.find({ createdBy: recruiterId })
        .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
        return res.status(404).json({
            message: "You haven't posted any jobs yet",
            success: false
        });
    }

    res.status(200).json({
        success: true,
        jobs
    });
});

// PUT /api/v1/job/update/:id - Update a job
export const updateJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const { title, description, requirements, salary, location, jobType, experience, position, status } = req.body;

    // Check if job exists and belongs to this recruiter
    const job = await Job.findById(jobId);

    if (!job) {
        res.status(404);
        throw new Error("Job not found");
    }

    if (job.createdBy.toString() !== req.userId) {
        res.status(403);
        throw new Error("You are not authorized to update this job");
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { title, description, requirements, salary, location, jobType, experience, position, status },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        message: "Job updated successfully",
        success: true,
        job: updatedJob
    });
});

// DELETE /api/v1/job/delete/:id - Delete a job
export const deleteJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;

    // Check if job exists and belongs to this recruiter
    const job = await Job.findById(jobId);

    if (!job) {
        res.status(404);
        throw new Error("Job not found");
    }

    if (job.createdBy.toString() !== req.userId) {
        res.status(403);
        throw new Error("You are not authorized to delete this job");
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({
        message: "Job deleted successfully",
        success: true
    });
});
