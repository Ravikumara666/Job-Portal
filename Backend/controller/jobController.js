import { Job } from "../model/jobsModel.js";

export const createJob = async (req, res) => {
  try {
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: "Only recruiters can post jobs" });
    }

    const newJob = new Job({
      ...req.body,
      postedBy: req.user._id
    });

    const savedJob = await newJob.save();
    res.status(201).json({ success: true, job: savedJob });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "fullName email");
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "fullName email");

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ message: "Error fetching job" });
  }
};
export const getJobsByRecruiter = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const jobs = await Job.find({ postedBy: recruiterId }).populate("postedBy", "fullName email");

    res.status(200).json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs by recruiter" });
  }
};


export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own jobs" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, job: updatedJob });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own jobs" });
    }

    await job.deleteOne();
    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
