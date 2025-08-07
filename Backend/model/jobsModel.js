import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  salary: {
    type: String, // e.g., "10-15 LPA", "₹50,000/month"
    required: true
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Remote', 'Contract'],
    default: 'Full-time'
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', '1-3 years', '3-5 years', '5+ years'],
    default: 'Fresher'
  },
  skills: {
    type: [String], // Array of strings like ['React', 'Node.js']
    required: true
  },
  description: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing your recruiter (from user collection)
    required: true
  }
}, { timestamps: true });

export const Job =mongoose.model('Job', jobSchema);