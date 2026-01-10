import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import isRecruiter from '../middleware/isRecruiter.js';
import { postJob, getAllJobs, getJobById, getRecruiterJobs, updateJob, deleteJob } from '../controllers/job.controller.js';

const router = express.Router();

// Public routes
router.get('/all', getAllJobs);
router.get('/:id', getJobById);

// Protected routes (authenticated users)
// Recruiter-only routes
router.post('/post', isAuthenticated, isRecruiter, postJob);
router.get('/recruiter/jobs', isAuthenticated, isRecruiter, getRecruiterJobs);
router.put('/update/:id', isAuthenticated, isRecruiter, updateJob);
router.delete('/delete/:id', isAuthenticated, isRecruiter, deleteJob);

export default router;
