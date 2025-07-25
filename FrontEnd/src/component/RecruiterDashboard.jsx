import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  User, 
  Code, 
  Building2, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Eye,
  Users,
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';
import NavBar from './NavBar';


const BASE_URL = import.meta.env.VITE_ORIGINAL_BASE_URL;

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/jobs/recruiter`, {
          credentials: 'include',
        });
        const data = await res.json();
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
      } catch (err) {
        console.error("❌ Failed to fetch jobs", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'recruiter') {
      fetchJobs();
    }
  }, [user]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.jobType.toLowerCase() === filterType);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, filterType]);

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/jobs/${id}`, { 
        method: 'DELETE',
        credentials: 'include' 
      });
      setJobs((prev) => prev.filter((job) => job._id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("❌ Delete failed", err);
    }
  };

  const startEditing = (job) => {
    setEditingJobId(job._id);
    setEditData({
      title: job.title,
      role: job.role,
      company: job.company,
      salary: job.salary,
      location: job.location,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      skills: job.skills.join(', '),
      description: job.description
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${BASE_URL}/api/jobs/${editingJobId}`, {
        ...editData,
        skills: editData.skills.split(',').map(skill => skill.trim())
      }, {
        withCredentials: true
      });

      const updatedJob = res.data.job;
      setJobs((prev) => prev.map((job) => (job._id === editingJobId ? updatedJob : job)));
      setEditingJobId(null);
    } catch (err) {
      console.error("❌ Update failed", err);
    }
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'full-time': 'bg-blue-100 text-blue-800 border-blue-200',
      'part-time': 'bg-green-100 text-green-800 border-green-200',
      'contract': 'bg-purple-100 text-purple-800 border-purple-200',
      'freelance': 'bg-orange-100 text-orange-800 border-orange-200',
      'remote': 'bg-cyan-100 text-cyan-800 border-cyan-200'
    };
    return colors[type?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getExperienceColor = (level) => {
    const colors = {
      'fresher': 'bg-emerald-100 text-emerald-800',
      'junior': 'bg-yellow-100 text-yellow-800',
      'mid-level': 'bg-orange-100 text-orange-800',
      'senior': 'bg-red-100 text-red-800',
      'lead': 'bg-purple-100 text-purple-800'
    };
    return colors[level?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    total: jobs.length,
    fullTime: jobs.filter(job => job.jobType?.toLowerCase() === 'full-time').length,
    remote: jobs.filter(job => job.jobType?.toLowerCase() === 'remote').length,
    thisMonth: jobs.filter(job => {
      const jobDate = new Date(job.createdAt);
      const now = new Date();
      return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
    }).length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  My Job Posts
                </h1>
                <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
              </div>
              <p className="text-gray-600">Manage and track your job postings</p>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Jobs', value: stats.total, icon: Briefcase, color: 'blue', trend: '+12%' },
            { label: 'Full-time', value: stats.fullTime, icon: Clock, color: 'green', trend: '+8%' },
            { label: 'Remote', value: stats.remote, icon: MapPin, color: 'purple', trend: '+23%' },
            { label: 'This Month', value: stats.thisMonth, icon: TrendingUp, color: 'orange', trend: '+15%' }
          ].map((stat, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-white/20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Start by posting your first job opportunity'}
              </p>
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:scale-105">
                <Plus className="w-5 h-5" />
                Post New Job
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <div 
                key={job._id} 
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {editingJobId === job._id ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Edit Job</h3>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-3">
                      <input 
                        name="title" 
                        value={editData.title} 
                        onChange={handleEditChange} 
                        placeholder="Job Title" 
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <input 
                        name="role" 
                        value={editData.role} 
                        onChange={handleEditChange} 
                        placeholder="Role" 
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <input 
                        name="company" 
                        value={editData.company} 
                        onChange={handleEditChange} 
                        placeholder="Company" 
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          name="salary" 
                          value={editData.salary} 
                          onChange={handleEditChange} 
                          placeholder="Salary" 
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <input 
                          name="location" 
                          value={editData.location} 
                          onChange={handleEditChange} 
                          placeholder="Location" 
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <select 
                          name="jobType" 
                          value={editData.jobType} 
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Remote">Remote</option>
                        </select>
                        <select 
                          name="experienceLevel" 
                          value={editData.experienceLevel} 
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="Fresher">Fresher</option>
                          <option value="Junior">Junior</option>
                          <option value="Mid-level">Mid-level</option>
                          <option value="Senior">Senior</option>
                          <option value="Lead">Lead</option>
                        </select>
                      </div>
                      <input 
                        name="skills" 
                        value={editData.skills} 
                        onChange={handleEditChange} 
                        placeholder="Skills (comma separated)" 
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <textarea 
                        name="description" 
                        value={editData.description} 
                        onChange={handleEditChange} 
                        placeholder="Job Description" 
                        rows={3}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button 
                        onClick={handleUpdate} 
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:scale-105"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button 
                        onClick={() => setEditingJobId(null)} 
                        className="flex items-center justify-center gap-2 bg-gray-500 text-white py-3 px-4 rounded-xl hover:bg-gray-600 transition-all duration-200 hover:scale-105"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Job Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{job.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{job.role}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getJobTypeColor(job.jobType)}`}>
                        {job.jobType}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExperienceColor(job.experienceLevel)}`}>
                        {job.experienceLevel}
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium text-gray-700">Skills Required</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {job.skills?.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                            {skill}
                          </span>
                        ))}
                        {job.skills?.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description Preview */}
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50/50 rounded-xl">
                      <div className="text-center">
                        <Eye className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Views</p>
                        <p className="text-sm font-semibold">124</p>
                      </div>
                      <div className="text-center">
                        <Users className="w-4 h-4 text-green-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Applications</p>
                        <p className="text-sm font-semibold">28</p>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Match Rate</p>
                        <p className="text-sm font-semibold">87%</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => startEditing(job)} 
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 hover:scale-105"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(job._id)} 
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 hover:scale-105"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full transform animate-pulse">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Job Post?</h3>
              <p className="text-gray-600">This action cannot be undone. The job post will be permanently removed.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}