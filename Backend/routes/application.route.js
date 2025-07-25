import express from 'express';
import { applyForJob, getRecruiterApplications } from '../controller/applicationController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js'; // ✅ missing import

const ApplicationRouter = express.Router();

// Route to apply for a job
ApplicationRouter.post('/apply/:jobId', isAuthenticated, applyForJob);

// Route to get all applications for jobs posted by the recruiter
ApplicationRouter.get('/recruiter/applications', isAuthenticated, getRecruiterApplications);

export default ApplicationRouter;
