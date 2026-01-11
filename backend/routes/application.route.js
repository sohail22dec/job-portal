import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import isRecruiter from '../middleware/isRecruiter.js';
import {
    applyForJob,
    getMyApplications,
    getApplicationById,
    getJobApplicants,
    updateApplicationStatus
} from '../controllers/application.controller.js';

const router = express.Router();

// Job seeker routes
router.post('/apply/:jobId', isAuthenticated, applyForJob);
router.get('/my-applications', isAuthenticated, getMyApplications);
router.get('/:id', isAuthenticated, getApplicationById);

// Recruiter routes
router.get('/job/:jobId/applicants', isAuthenticated, isRecruiter, getJobApplicants);
router.put('/:id/status', isAuthenticated, isRecruiter, updateApplicationStatus);

export default router;
