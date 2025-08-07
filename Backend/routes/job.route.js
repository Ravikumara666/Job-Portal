import express from 'express';
const JobRouter = express.Router();

import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getJobsByRecruiter,
  updateJob
} from '../controller/jobController.js';

import { isAuthenticated } from '../middleware/authMiddleware.js';
import { isRecruiter } from '../middleware/isRecruiter.js';

// Public route - all jobs visible to everyone
JobRouter.route('/').get(getAllJobs);

// Protected routes - only recruiters can create/update/delete
JobRouter.route('/').post(isAuthenticated,isRecruiter, createJob);
// JobRouter.route('/:id').get(getJobById);
JobRouter.route('/recruiter').get(isAuthenticated,getJobsByRecruiter);
JobRouter.route('/:id').put(isAuthenticated, updateJob);
JobRouter.route('/:id').delete(isAuthenticated, deleteJob);


export default JobRouter;
