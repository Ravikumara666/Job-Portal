import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  User, 
  Briefcase, 
  Calendar,
  Eye,
  ChevronDown,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import NavBar from './NavBar';
import axios from 'axios';
import { useSelector } from 'react-redux';

// Mock NavBar component for demonstration

const BASE_URL = import.meta.env.VITE_ORIGINAL_BASE_URL;
const RecruiterApplications = () => {
  const user = useSelector((state) => state.auth.user);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/applications/recruiter/applications`, {
          withCredentials: true,
        });
        setApplications(response.data.applications);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    let filtered = applications.filter(app => {
      const matchesSearch = 
        app.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });

    // Sort applications
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.appliedAt) - new Date(a.createdAt || a.appliedAt);
        case 'oldest':
          return new Date(a.createdAt || a.appliedAt) - new Date(b.createdAt || b.appliedAt);
        case 'name':
          return (a.applicantId?.name || '').localeCompare(b.applicantId?.name || '');
        case 'job':
          return (a.jobId?.title || '').localeCompare(b.jobId?.title || '');
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, searchTerm, filterStatus, sortBy]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'hired':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'hired':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading applications...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar/>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Applications</h1>
            <p className="text-gray-600">Manage and review candidate applications</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by job title, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">By Name</option>
                  <option value="job">By Job Title</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">By Name</option>
                  <option value="job">By Job Title</option>
                </select>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredApplications.length} of {applications.length} applications
            </p>
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {applications.length === 0 ? 'No Applications Yet' : 'No Matching Applications'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {applications.length === 0 
                  ? 'Applications will appear here once candidates start applying to your job postings.'
                  : 'Try adjusting your search terms or filters to find the applications you\'re looking for.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Main Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {app.name || 'N/A'}
                            </h3>
                            <div className="flex items-center gap-2 text-lg text-blue-600 font-medium">
                              <Briefcase className="w-5 h-5" />
                              {app.jobId?.title || 'Job Title Not Available'}
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            {app.status || 'Pending'}
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{app.applicantId?.email || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{app.phone || 'N/A'}</span>
                          </div>
                        </div>

                        {/* Application Date */}
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          Applied on {formatDate(app.createdAt || app.appliedAt)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        {app.applicantId?.profile?.resume && (
                          <a
                            href={app.applicantId.profile.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            <FileText className="w-4 h-4" />
                            View Resume
                          </a>
                        )}
                        
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Application Detail Modal */}
          {selectedApplication && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Applicant Information</h3>
                      <div className="space-y-2 text-gray-700">
                        <p><strong>Name:</strong> {selectedApplication.applicantId?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {selectedApplication.applicantId?.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {selectedApplication.phone || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Job Information</h3>
                      <div className="space-y-2 text-gray-700">
                        <p><strong>Position:</strong> {selectedApplication.jobId?.title || 'N/A'}</p>
                        <p><strong>Applied:</strong> {formatDate(selectedApplication.createdAt || selectedApplication.appliedAt)}</p>
                        <p><strong>Status:</strong> {selectedApplication.status || 'Pending'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedApplication.coverLetter && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Cover Letter</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    {selectedApplication.applicantId?.profile?.resume && (
                      <a
                        href={selectedApplication.applicantId.profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Resume
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecruiterApplications;