import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { toggleSaveJob, getSavedJobs, checkIfSaved } from '../controllers/savedJobs.controller.js';

const router = express.Router();

// All routes require authentication
router.post('/toggle/:jobId', isAuthenticated, toggleSaveJob);
router.get('/', isAuthenticated, getSavedJobs);
router.get('/check/:jobId', isAuthenticated, checkIfSaved);

export default router;
