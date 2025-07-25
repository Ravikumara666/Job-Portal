import { Job } from '../model/jobsModel.js';
import fs from 'fs';
import cloudinary from 'cloudinary';
import { Application } from '../model/Application.js';

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { name, email, phone } = req.body;
    const applicantId = req.user._id;

    // Check resume in user profile
    const resumeUrl = req.user.profile?.resume;
    if (!resumeUrl) {
      return res.status(400).json({ message: 'Resume not found in user profile' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Prevent duplicate application
    const alreadyApplied = await Application.findOne({ jobId, applicantId });
    if (alreadyApplied) {
      return res.status(409).json({ message: 'You have already applied for this job.' });
    }

    const application = new Application({
      jobId,
      recruiterId: job.postedBy,
      applicantId,
      name,
      email,
      phone,
      resume: resumeUrl,
    });

    await application.save();

    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Error applying for job:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRecruiterApplications = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const applications = await Application.find({ recruiterId })
      .populate('applicantId', 'name email profile.resume')
      .populate('jobId', 'title');

    res.status(200).json({ applications });
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};
