import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import isRecruiter from '../middleware/isRecruiter.js';
import {
    applyForJob,
    checkApplicationStatus,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus
} from '../controllers/application.controller.js';
import { singleUpload } from '../middleware/resumeUpload.middleware.js';
const router = express.Router();


router.post('/apply/:jobId', isAuthenticated, singleUpload, applyForJob);
router.get('/status/:jobId', isAuthenticated, checkApplicationStatus);
router.get('/my-applications', isAuthenticated, getMyApplications);

router.get('/job/:jobId/applicants', isAuthenticated, isRecruiter, getJobApplicants);
router.put('/:id/status', isAuthenticated, isRecruiter, updateApplicationStatus);

export default router;
