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


router.post('/apply/:jobId', isAuthenticated, applyForJob);
router.get('/my-applications', isAuthenticated, getMyApplications);
router.get('/:id', isAuthenticated, getApplicationById);

router.get('/job/:jobId/applicants', isAuthenticated, isRecruiter, getJobApplicants);
router.put('/:id/status', isAuthenticated, isRecruiter, updateApplicationStatus);

export default router;
