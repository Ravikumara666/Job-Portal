import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Briefcase, Camera, Edit3, Save, X, Settings, Download, Share2, Bell, Key, Building, Award, FileText, Calendar, Upload, CheckCircle, AlertCircle, Eye, Trash2, Star, TrendingUp
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/features/AuthSlice';

export default function UserDashboard() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.user);
  
  const [resumeUploaded, setResumeUploaded] = useState(userData?.profile?.resume);
  console.log(resumeUploaded+" resumeUploaded");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: userData?.fullName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    role: userData?.role || '',
    profileImage: userData?.profileImage || ''
  });
  const [dragActive, setDragActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  
  const [image, setImage] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const USER_END_POINT = import.meta.env.VITE_USER_END_POINT;

  // Initialize edit data when userData changes
  useEffect(() => {
    if (userData) {
      setEditData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || '',
        profileImage: userData.profileImage || ''
      });
    }
  }, [userData]);

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('profileImage', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

//  Fixed handleSave method for your dashboard
const handleSave = async () => {
  setLoading(true);
  try {

    const formData = new FormData();
    let hasChanges = false;
    
    // Compare each field with original userData and only add changed fields
    if (editData.fullName !== userData.fullName) {
      formData.append('fullName', editData.fullName);
      hasChanges = true;
      console.log('✏️ fullName changed:', editData.fullName);
    }
    /// resume code  
    if (resume) {
        formData.append('resume', resume);
        hasChanges = true;
      }

    if (editData.email !== userData.email) {
      formData.append('email', editData.email);
      hasChanges = true;
      console.log('✏️ email changed:', editData.email);
    }

    if (editData.phone !== userData.phone) {
      formData.append('phone', editData.phone);
      hasChanges = true;
      console.log('✏️ phone changed:', editData.phone);
    }

    // Add image if a new file was selected
    if (image) {
      formData.append('file', image);
      hasChanges = true;
      console.log('📁 New image selected');
    }

    // Only make API call if there are actual changes
    if (!hasChanges) {
      setToast({ message: 'No changes to save', type: 'info' });
      setIsEditing(false);
      setTimeout(() => setToast({ message: '', type: '' }), 3000);
      return;
    }

    console.log('🚀 Sending update request to backend...');
    
    // Debug: Log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(`FormData - ${key}:`, value);
    }

    const result = await axios.put(`${USER_END_POINT}/profile/update`, formData, {
      withCredentials: true,
      headers: { 
        'Content-Type': 'multipart/form-data' 
      },
    });

    if (result.status === 200) {
      console.log('✅ Profile updated successfully',result.data.user);
      
      // Update Redux store with the complete updated user data from backend
      dispatch(setUser(result.data.user));
      
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      setImage(null);
      
      // Reset editData to match the updated userData
      setEditData({
        fullName: result.data.user.fullName || '',
        email: result.data.user.email || '',
        phone: result.data.user.phone || '',
        role: result.data.user.role || '',
        profileImage: result.data.user.profile?.file || ''
      });
      
      setTimeout(() => setToast({ message: '', type: '' }), 3000);
    }
  } catch (error) {
    console.error('❌ Update error:', error);
    const message = error.response?.data?.message || 'Failed to update profile';
    setToast({ message, type: 'danger' });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  } finally {
    setLoading(false);
  }
};

const handleResumeUpload = (file) => {
    if (
      file &&
      (file.type === 'application/pdf' ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx'))
    ) {
      setResume(file);
      setResumeUploaded(true);
      setToast({
        message: `Resume "${file.name}" uploaded successfully!`,
        type: 'success',
      });
    } else {
      setToast({
        message: 'Please upload a PDF or Word document',
        type: 'error',
      });
    }

    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };
//   useEffect(() => {
//   if (resumeUploaded && resume) {
//     handleSave();
//     setResumeUploaded(false); // reset flag to prevent repeated calls
//   }
// }, [resumeUploaded, resume]);


  const handleCancel = () => {
    setEditData({
      fullName: userData?.fullName || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      role: userData?.role || '',
      profileImage: userData?.profileImage || ''
    });
    setImage(null);
    setIsEditing(false);
  };

  // Toast Component
  const ToastMessage = ({ message, type, onClose }) => {
    if (!message) return null;
    
    const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'danger' ? 'bg-red-500' : 'bg-blue-500';
    
    return (
      <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2`}>
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };


  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleResumeUpload(e.dataTransfer.files[0]);
    }
  };



  // // Toast Component
  // const ToastMessage = ({ message, type, onClose }) => {
  //   if (!message) return null;
    
  //   const bgColor = type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
  //                  type === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-500' : 
  //                  type === 'info' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
  //                  'bg-gradient-to-r from-purple-500 to-indigo-500';
    
  //   return (
  //     <div className={`fixed top-6 right-6 ${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center space-x-3 animate-slide-in-right backdrop-blur-sm border border-white/20`}>
  //       {type === 'success' && <CheckCircle className="w-5 h-5" />}
  //       {type === 'error' && <AlertCircle className="w-5 h-5" />}
  //       <span className="font-medium">{message}</span>
  //       <button onClick={onClose} className="ml-3 text-white/80 hover:text-white transition-colors">
  //         <X className="w-4 h-4" />
  //       </button>
  //     </div>
  //   );
  // };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 lg:p-6">
      <ToastMessage
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5"></div>
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Welcome Back!
                </h1>
                <p className="text-gray-600 text-lg">Good to see you, {userData.fullName}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span className="font-medium">{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <X className="w-5 h-5" />
                    <span className="font-medium">Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Edit3 className="w-5 h-5" />
                  <span className="font-medium">Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Profile Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="relative">
                    <img
                      src={editData.profileImage || userData.profile.file || '/default-avatar.png'}
                      alt="Profile"
                      className="w-36 h-36 rounded-full object-cover shadow-2xl ring-4 ring-white/50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full"></div>
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-full cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105">
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full text-center text-xl font-bold bg-white/50 border-2 border-white/30 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                      placeholder="Full Name"
                    />
                    <input
                      type="text"
                      value={editData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="w-full text-center text-gray-600 bg-white/50 border-2 border-white/30 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
                      placeholder="Role"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {editData.fullName}
                    </h2>
                    <p className="text-gray-600 font-medium">{editData.role}</p>
                    <p className="text-gray-500 text-sm">{userData.profile?.bio}</p>
                  </div>
                )}
                
                <div className="mt-6 inline-flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Online & Active</span>
                </div>
              </div>
            </div>
            

                         {/* Enhanced Resume Upload Section - Only for students */}
            {editData?.role === 'student' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                      Resume Upload
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {isEditing ? 'Upload or replace your resume' : 'Enter edit mode to upload/replace resume'}
                    </p>
                  </div>

                  {/* Show upload interface only in edit mode OR if no resume exists */}
                  {isEditing ? (
                    <div
                      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer group ${
                        dragActive 
                          ? 'border-indigo-500 bg-indigo-50/50' 
                          : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50/50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('resume-upload').click()}
                    >
                      <div className="text-center">
                        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors duration-300 ${
                          dragActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'
                        }`} />
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                          {dragActive ? 'Drop your resume here' : 
                           resumeUploaded && !resume ? 'Replace your current resume' : 'Click to upload or drag & drop'}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Supports PDF, DOC, DOCX files up to 10MB
                        </p>
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300">
                          <Upload className="w-4 h-4" />
                          <span>{resumeUploaded && !resume ? 'Replace File' : 'Choose File'}</span>
                        </div>
                      </div>
                      <input
                        id="resume-upload"
                        type="file"
                        name='resume'
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => e.target.files[0] && handleResumeUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    /* Show resume status when not in edit mode */
                    resumeUploaded ? (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-green-800 text-sm">
                              Resume uploaded successfully
                            </p>
                            <p className="text-xs text-green-600">
                              Click "Edit Profile" to replace
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-12 h-12 bg-gray-400 rounded-xl flex items-center justify-center shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-gray-600 text-sm">
                              No resume uploaded
                            </p>
                            <p className="text-xs text-gray-500">
                              Click "Edit Profile" to upload
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {/* Show new resume preview if one is selected */}
                  {resume && isEditing && (
                    <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-blue-800 text-sm">
                              {resume.name}
                            </p>
                            <p className="text-xs text-blue-600">
                              {(resume.size / 1024 / 1024).toFixed(1)} MB - Ready to save
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setResume(null);
                            setResumeUploaded(!!userData?.profile?.resume);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

             {/* Recruiter Welcome */}
             {editData?.role === 'recruiter' && (
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center">Welcome, Recruiter!</h3>
                  <p className="text-purple-100 text-center text-sm">
                    Manage your job postings and find the perfect candidates for your organization.
                  </p>
                </div>
              </div>
             )}
          </div>

          {/* Enhanced Information Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8 flex items-center">
                <User className="w-6 h-6 mr-3 text-indigo-500" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form Fields */}
                {[
                  { label: 'Full Name', field: 'fullName', icon: User, color: 'text-blue-500' },
                  { label: 'Email Address', field: 'email', icon: Mail, color: 'text-green-500' },
                  { label: 'Phone Number', field: 'phone', icon: Phone, color: 'text-orange-500' },
                  { label: 'Position', field: 'role', icon: Briefcase, color: 'text-indigo-500' }
                ].map(({ label, field, icon: Icon, color }) => (
                  <div key={field} className="space-y-3">
                    <label className={`text-sm font-semibold text-gray-700 flex items-center`}>
                      <Icon className={`w-4 h-4 mr-2 ${color}`} />
                      {label}
                    </label>
                    {isEditing ? (
                      <input
                        type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                        value={editData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    ) : (
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                        <p className="font-semibold text-gray-800">{editData[field]}</p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Static Fields */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                    Location
                  </label>
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                    <p className="font-semibold text-gray-800">Bengaluru, India</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <Building className="w-4 h-4 mr-2 text-pink-500" />
                    Company
                  </label>
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50 backdrop-blur-sm">
                    <p className="font-semibold text-gray-800">Engineersmind</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-indigo-500" />
                Quick Actions
              </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
  {[
    { icon: Key, label: 'Password', color: 'from-blue-500 to-cyan-500' },
    { icon: Download, label: 'Download', color: 'from-green-500 to-emerald-500' },
    { icon: Share2, label: 'Share', color: 'from-purple-500 to-indigo-500' },
    { icon: Bell, label: 'Notifications', color: 'from-orange-500 to-red-500' },
    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-600' }
  ].map(({ icon: Icon, label, color }, index) => {
    const isDownload = label === 'Download';
    const canDownload = userData?.profile?.resume;

    return isDownload && canDownload ? (
      <a
        key={index}
        href={userData.profile.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-center space-y-3 p-4 bg-white/50 rounded-2xl border border-white/30 hover:bg-white/70 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
      >
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
          {label}
        </span>
      </a>
    ) : (
      <button
        key={index}
        onClick={() => {
          if (isDownload && !canDownload) {
            alert('No resume uploaded yet.');
          }
          // Add more custom actions here if needed for other buttons
        }}
        className="group flex flex-col items-center space-y-3 p-4 bg-white/50 rounded-2xl border border-white/30 hover:bg-white/70 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
      >
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
          {label}
        </span>
      </button>
    );
  })}
</div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import { 
//   User, Mail, Phone, MapPin, Briefcase, Camera, Edit3, Save, X, Settings, Download, Share2, Bell, Key, Building, Award, FileText, Calendar, Upload, CheckCircle, AlertCircle, Eye, Trash2, Star, TrendingUp
// } from 'lucide-react';

// export default function UserDashboard() {
//   // Mock user data for demonstration
//   const userData = {
//     fullName: "John Doe",
//     email: "john.doe@example.com",
//     phone: "+1 234 567 8900",
//     role: "student",
//     profileImage: "https://via.placeholder.com/150",
//     profile: {
//       file: "https://via.placeholder.com/150",
//       bio: "Passionate software developer with 3+ years of experience",
//       resume: "https://example.com/resume.pdf" // Set to null if no resume exists
//     }
//   };
  
//   const [resumeUploaded, setResumeUploaded] = useState(!!userData?.profile?.resume);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editData, setEditData] = useState({
//     fullName: userData?.fullName || '',
//     email: userData?.email || '',
//     phone: userData?.phone || '',
//     role: userData?.role || '',
//     profileImage: userData?.profileImage || ''
//   });
//   const [dragActive, setDragActive] = useState(false);
//   const [image, setImage] = useState(null);
//   const [toast, setToast] = useState({ message: '', type: '' });
//   const [loading, setLoading] = useState(false);
//   const [resume, setResume] = useState(null);

//   // Initialize edit data when userData changes
//   useEffect(() => {
//     if (userData) {
//       setEditData({
//         fullName: userData.fullName || '',
//         email: userData.email || '',
//         phone: userData.phone || '',
//         role: userData.role || '',
//         profileImage: userData.profileImage || ''
//       });
//     }
//   }, [userData]);

//   const handleInputChange = (field, value) => {
//     setEditData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handlePhotoUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         handleInputChange('profileImage', e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       let hasChanges = false;
      
//       // Compare each field with original userData and only add changed fields
//       if (editData.fullName !== userData.fullName) {
//         formData.append('fullName', editData.fullName);
//         hasChanges = true;
//       }
      
//       if (resume) {
//         formData.append('resume', resume);
//         hasChanges = true;
//       }

//       if (editData.email !== userData.email) {
//         formData.append('email', editData.email);
//         hasChanges = true;
//       }

//       if (editData.phone !== userData.phone) {
//         formData.append('phone', editData.phone);
//         hasChanges = true;
//       }

//       if (image) {
//         formData.append('file', image);
//         hasChanges = true;
//       }

//       if (!hasChanges) {
//         setToast({ message: 'No changes to save', type: 'info' });
//         setIsEditing(false);
//         setTimeout(() => setToast({ message: '', type: '' }), 3000);
//         return;
//       }

//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       setToast({ message: 'Profile updated successfully!', type: 'success' });
//       setIsEditing(false);
//       setImage(null);
//       setResume(null);
      
//       setTimeout(() => setToast({ message: '', type: '' }), 3000);
//     } catch (error) {
//       setToast({ message: 'Failed to update profile', type: 'error' });
//       setTimeout(() => setToast({ message: '', type: '' }), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResumeUpload = (file) => {
//     // Only allow upload if in editing mode
//     if (!isEditing) {
//       setToast({
//         message: 'Please enter edit mode to upload resume',
//         type: 'error',
//       });
//       setTimeout(() => setToast({ message: '', type: '' }), 3000);
//       return;
//     }

//     if (
//       file &&
//       (file.type === 'application/pdf' ||
//         file.name.endsWith('.doc') ||
//         file.name.endsWith('.docx'))
//     ) {
//       setResume(file);
//       setResumeUploaded(true);
//       setToast({
//         message: `Resume "${file.name}" uploaded successfully!`,
//         type: 'success',
//       });
//     } else {
//       setToast({
//         message: 'Please upload a PDF or Word document',
//         type: 'error',
//       });
//     }

//     setTimeout(() => setToast({ message: '', type: '' }), 3000);
//   };

//   const handleCancel = () => {
//     setEditData({
//       fullName: userData?.fullName || '',
//       email: userData?.email || '',
//       phone: userData?.phone || '',
//       role: userData?.role || '',
//       profileImage: userData?.profileImage || ''
//     });
//     setImage(null);
//     setResume(null); // Reset resume on cancel
//     setResumeUploaded(!!userData?.profile?.resume); // Reset to original state
//     setIsEditing(false);
//   };

//   // Toast Component
//   const ToastMessage = ({ message, type, onClose }) => {
//     if (!message) return null;
    
//     const bgColor = type === 'success' ? 'bg-green-500' : 
//                    type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
//     return (
//       <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2`}>
//         <span>{message}</span>
//         <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
//           <X className="w-4 h-4" />
//         </button>
//       </div>
//     );
//   };

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleResumeUpload(e.dataTransfer.files[0]);
//     }
//   };

//   if (!userData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mx-auto mb-6"></div>
//           <p className="text-gray-600 text-lg">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 lg:p-6">
//       <ToastMessage
//         message={toast.message}
//         type={toast.type}
//         onClose={() => setToast({ message: '', type: '' })}
//       />
      
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Enhanced Header */}
//         <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5"></div>
//           <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
//             <div className="flex items-center space-x-4">
//               <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
//                 <User className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//                   Welcome Back!
//                 </h1>
//                 <p className="text-gray-600 text-lg">Good to see you, {userData.fullName}</p>
//               </div>
//             </div>
            
//             <div className="flex space-x-3">
//               {isEditing ? (
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={handleSave}
//                     disabled={loading}
//                     className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <Save className="w-5 h-5" />
//                     <span className="font-medium">{loading ? 'Saving...' : 'Save Changes'}</span>
//                   </button>
//                   <button
//                     onClick={handleCancel}
//                     disabled={loading}
//                     className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//                   >
//                     <X className="w-5 h-5" />
//                     <span className="font-medium">Cancel</span>
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//                 >
//                   <Edit3 className="w-5 h-5" />
//                   <span className="font-medium">Edit Profile</span>
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Enhanced Profile Section */}
//           <div className="lg:col-span-1 space-y-6">
//             {/* Profile Card */}
//             <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
//               <div className="text-center">
//                 <div className="relative inline-block mb-6">
//                   <div className="relative">
//                     <img
//                       src={editData.profileImage || userData.profile.file || '/default-avatar.png'}
//                       alt="Profile"
//                       className="w-36 h-36 rounded-full object-cover shadow-2xl ring-4 ring-white/50"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full"></div>
//                   </div>
//                   {isEditing && (
//                     <label className="absolute bottom-2 right-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-full cursor-pointer hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105">
//                       <Camera className="w-5 h-5" />
//                       <input
//                         type="file"
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handlePhotoUpload}
//                       />
//                     </label>
//                   )}
//                 </div>
                
//                 {isEditing ? (
//                   <div className="space-y-4">
//                     <input
//                       type="text"
//                       value={editData.fullName}
//                       onChange={(e) => handleInputChange('fullName', e.target.value)}
//                       className="w-full text-center text-xl font-bold bg-white/50 border-2 border-white/30 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
//                       placeholder="Full Name"
//                     />
//                     <input
//                       type="text"
//                       value={editData.role}
//                       onChange={(e) => handleInputChange('role', e.target.value)}
//                       className="w-full text-center text-gray-600 bg-white/50 border-2 border-white/30 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur-sm"
//                       placeholder="Role"
//                     />
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//                       {editData.fullName}
//                     </h2>
//                     <p className="text-gray-600 font-medium">{editData.role}</p>
//                     <p className="text-gray-500 text-sm">{userData.profile?.bio}</p>
//                   </div>
//                 )}
                
//                 <div className="mt-6 inline-flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                   <span>Online & Active</span>
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Resume Upload Section - Only for students */}
//             {editData?.role === 'student' && (
//               <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
//                 <div className="text-center">
//                   <div className="mb-6">
//                     <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//                       <FileText className="w-8 h-8 text-white" />
//                     </div>
//                     <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
//                       Resume Upload
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       {isEditing ? 'Upload or replace your resume' : 'Enter edit mode to upload/replace resume'}
//                     </p>
//                   </div>

//                   {/* Show upload interface only in edit mode OR if no resume exists */}
//                   {isEditing ? (
//                     <div
//                       className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer group ${
//                         dragActive 
//                           ? 'border-indigo-500 bg-indigo-50/50' 
//                           : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50/50'
//                       }`}
//                       onDragEnter={handleDrag}
//                       onDragLeave={handleDrag}
//                       onDragOver={handleDrag}
//                       onDrop={handleDrop}
//                       onClick={() => document.getElementById('resume-upload').click()}
//                     >
//                       <div className="text-center">
//                         <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors duration-300 ${
//                           dragActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'
//                         }`} />
//                         <p className="text-lg font-semibold text-gray-700 mb-2">
//                           {dragActive ? 'Drop your resume here' : 
//                            resumeUploaded && !resume ? 'Replace your current resume' : 'Click to upload or drag & drop'}
//                         </p>
//                         <p className="text-sm text-gray-500 mb-4">
//                           Supports PDF, DOC, DOCX files up to 10MB
//                         </p>
//                         <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300">
//                           <Upload className="w-4 h-4" />
//                           <span>{resumeUploaded && !resume ? 'Replace File' : 'Choose File'}</span>
//                         </div>
//                       </div>
//                       <input
//                         id="resume-upload"
//                         type="file"
//                         name='resume'
//                         accept=".pdf,.doc,.docx"
//                         onChange={(e) => e.target.files[0] && handleResumeUpload(e.target.files[0])}
//                         className="hidden"
//                       />
//                     </div>
//                   ) : (
//                     /* Show resume status when not in edit mode */
//                     resumeUploaded ? (
//                       <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
//                         <div className="flex items-center justify-center space-x-3">
//                           <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
//                             <CheckCircle className="w-6 h-6 text-white" />
//                           </div>
//                           <div className="text-center">
//                             <p className="font-semibold text-green-800 text-sm">
//                               Resume uploaded successfully
//                             </p>
//                             <p className="text-xs text-green-600">
//                               Click "Edit Profile" to replace
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6">
//                         <div className="flex items-center justify-center space-x-3">
//                           <div className="w-12 h-12 bg-gray-400 rounded-xl flex items-center justify-center shadow-lg">
//                             <FileText className="w-6 h-6 text-white" />
//                           </div>
//                           <div className="text-center">
//                             <p className="font-semibold text-gray-600 text-sm">
//                               No resume uploaded
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               Click "Edit Profile" to upload
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     )
//                   )}

//                   {/* Show new resume preview if one is selected */}
//                   {resume && isEditing && (
//                     <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
//                             <FileText className="w-5 h-5 text-white" />
//                           </div>
//                           <div className="text-left">
//                             <p className="font-semibold text-blue-800 text-sm">
//                               {resume.name}
//                             </p>
//                             <p className="text-xs text-blue-600">
//                               {(resume.size / 1024 / 1024).toFixed(1)} MB - Ready to save
//                             </p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => {
//                             setResume(null);
//                             setResumeUploaded(!!userData?.profile?.resume);
//                           }}
//                           className="text-blue-600 hover:text-blue-800 transition-colors"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Recruiter Welcome */}
//             {editData?.role === 'recruiter' && (
//               <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
//                 <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
//                 <div className="relative">
//                   <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <Star className="w-8 h-8 text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2 text-center">Welcome, Recruiter!</h3>
//                   <p className="text-purple-100 text-center text-sm">
//                     Manage your job postings and find the perfect candidates for your organization.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Enhanced Information Section */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
//               <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8 flex items-center">
//                 <User className="w-6 h-6 mr-3 text-indigo-500" />
//                 Personal Information
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Form Fields */}
//                 {[
//                   { label: 'Full Name', field: 'fullName', icon: User, color: 'text-blue-500' },
//                   { label: 'Email Address', field: 'email', icon: Mail, color: 'text-green-500' },
//                   { label: 'Phone Number', field: 'phone', icon: Phone, color: 'text-orange-500' },
//                   { label: 'Position', field: 'role', icon: Briefcase, color: 'text-indigo-500' }
//                 ].map(({ label, field, icon: Icon, color }) => (
//                   <div key={field} className="space-y-3">
//                     <label className={`text-sm font-semibold text-gray-700 flex items-center`}>
//                       <Icon className={`w-4 h-4 mr-2 ${color}`} />
//                       {label}
//                     </label>
//                     {isEditing ? (
//                       <input
//                         type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
//                         value={editData[field]}
//                         onChange={(e) => handleInputChange(field, e.target.value)}
//                         className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
//                         placeholder={`Enter ${label.toLowerCase()}`}
//                       />
//                     ) : (
//                       <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50 backdrop-blur-sm">
//                         <p className="font-semibold text-gray-800">{editData[field]}</p>
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 {/* Static Fields */}
//                 <div className="space-y-3">
//                   <label className="text-sm font-semibold text-gray-700 flex items-center">
//                     <MapPin className="w-4 h-4 mr-2 text-purple-500" />
//                     Location
//                   </label>
//                   <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50 backdrop-blur-sm">
//                     <p className="font-semibold text-gray-800">Bengaluru, India</p>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <label className="text-sm font-semibold text-gray-700 flex items-center">
//                     <Building className="w-4 h-4 mr-2 text-pink-500" />
//                     Company
//                   </label>
//                   <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50 backdrop-blur-sm">
//                     <p className="font-semibold text-gray-800">Engineersmind</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Quick Actions */}
//             <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
//               <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6 flex items-center">
//                 <Settings className="w-6 h-6 mr-3 text-indigo-500" />
//                 Quick Actions
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//                 {[
//                   { icon: Key, label: 'Password', color: 'from-blue-500 to-cyan-500' },
//                   { icon: Download, label: 'Download', color: 'from-green-500 to-emerald-500' },
//                   { icon: Share2, label: 'Share', color: 'from-purple-500 to-indigo-500' },
//                   { icon: Bell, label: 'Notifications', color: 'from-orange-500 to-red-500' },
//                   { icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-600' }
//                 ].map(({ icon: Icon, label, color }, index) => {
//                   const isDownload = label === 'Download';
//                   const canDownload = userData?.profile?.resume;

//                   return isDownload && canDownload ? (
//                     <a
//                       key={index}
//                       href={userData.profile.resume}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="group flex flex-col items-center space-y-3 p-4 bg-white/50 rounded-2xl border border-white/30 hover:bg-white/70 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
//                     >
//                       <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
//                         <Icon className="w-6 h-6 text-white" />
//                       </div>
//                       <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
//                         {label}
//                       </span>
//                     </a>
//                   ) : (
//                     <button
//                       key={index}
//                       onClick={() => {
//                         if (isDownload && !canDownload) {
//                           alert('No resume uploaded yet.');
//                         }
//                       }}
//                       className="group flex flex-col items-center space-y-3 p-4 bg-white/50 rounded-2xl border border-white/30 hover:bg-white/70 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
//                     >
//                       <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
//                         <Icon className="w-6 h-6 text-white" />
//                       </div>
//                       <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
//                         {label}
//                       </span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes slide-in-right {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
        
//         .animate-slide-in-right {
//           animation: slide-in-right 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }