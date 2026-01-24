import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import isRecruiter from '../middleware/isRecruiter.js';
import { generateJobDescription, generateCoverLetter } from '../controllers/ai.controller.js';

const router = express.Router();

// AI job description generation - only for authenticated recruiters
router.post('/generate-job-description', isAuthenticated, isRecruiter, generateJobDescription);

// AI cover letter generation - only for authenticated users (job seekers)
router.post('/generate-cover-letter', isAuthenticated, generateCoverLetter);

export default router;
