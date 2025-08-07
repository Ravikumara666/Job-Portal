import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Building2, 
  Users, 
  Star, 
  Clock, 
  DollarSign,
  Eye,
  Heart,
  Share2,
  Edit,
  Trash2,
  Plus,
  X,
  LogIn,
  Zap,
  Award,
  Target,
  Filter,
  Search
} from 'lucide-react';
import NavBar from '../component/NavBar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/features/JobSlice.jsx';
import { useNavigate } from 'react-router-dom';

// Mock data for demonstration
// const mockJobs = [
//   {
//     _id: '1',
//     title: 'Senior Frontend Developer',
//     description: 'Join our dynamic team to build cutting-edge web applications using React, TypeScript, and modern tools. You\'ll work on exciting projects that impact millions of users worldwide.',
//     company: 'TechFlow Inc.',
//     location: 'San Francisco, CA',
//     salary: '$120,000 - $150,000',
//     jobType: 'Full-time',
//     experienceLevel: 'Senior',
//     skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
//     postedBy: 'recruiter1',
//     postedDate: '2024-01-15',
//     applicants: 23,
//     featured: true
//   },
//   {
//     _id: '2',
//     title: 'Product Designer',
//     description: 'Create beautiful and intuitive user experiences for our mobile and web applications. Work closely with engineers and product managers.',
//     company: 'Design Studio Pro',
//     location: 'New York, NY',
//     salary: '$90,000 - $120,000',
//     jobType: 'Full-time',
//     experienceLevel: 'Mid-level',
//     skills: ['Figma', 'Sketch', 'Prototyping', 'User Research', 'Design Systems'],
//     postedBy: 'recruiter2',
//     postedDate: '2024-01-10',
//     applicants: 15,
//     featured: false
//   },
//   {
//     _id: '3',
//     title: 'DevOps Engineer',
//     description: 'Build and maintain scalable infrastructure, implement CI/CD pipelines, and ensure high availability of our services.',
//     company: 'CloudTech Solutions',
//     location: 'Austin, TX',
//     salary: '$110,000 - $140,000',
//     jobType: 'Remote',
//     experienceLevel: 'Senior',
//     skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins'],
//     postedBy: 'recruiter1',
//     postedDate: '2024-01-08',
//     applicants: 31,
//     featured: true
//   }
// ];

// const mockUser = { role: 'student', email: 'student@example.com', _id: 'student1' };

export default function Jobs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
  dispatch(fetchJobs());
}, [dispatch]);

const { jobs, loading, error } = useSelector((state) => state.jobs);

  
  console.log(user)
  const [showPostForm, setShowPostForm] = useState(false);
  // const [loading, setLoading] = useState(bloading);
  // const [user] = useState(mockUser);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [likedJobs, setLikedJobs] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);


  const handleApply = async (jobId) => {
    if (!user) {
      alert('Please login to apply');
      return;
    }
    
    // Simulate application
    alert('Application submitted successfully! 🎉');
  };

  const toggleLike = (jobId) => {
    const newLikedJobs = new Set(likedJobs);
    if (newLikedJobs.has(jobId)) {
      newLikedJobs.delete(jobId);
    } else {
      newLikedJobs.add(jobId);
    }
    setLikedJobs(newLikedJobs);
  };

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'featured' && job.featured) ||
                         (selectedFilter === 'remote' && job.jobType === 'Remote');
    
    return matchesSearch && matchesFilter;
  });

  const JobCard = ({ job, index }) => (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br transition-all duration-500 ease-out cursor-pointer
        ${job.featured 
          ? 'from-violet-50 via-white to-blue-50 border-2 border-gradient-to-r border-violet-200' 
          : 'from-gray-50 via-white to-gray-50 border border-gray-200'
        }
        ${hoveredCard === job._id ? 'transform scale-[1.02] shadow-2xl shadow-blue-500/20' : 'hover:shadow-xl'}
      `}
      // onMouseEnter={() => setHoveredCard(job._id)}
      // onMouseLeave={() => setHoveredCard(null)}
      style={{
        animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
        transformOrigin: 'center bottom'
      }}
    >
      {/* Featured Badge */}
      {job.featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
            <Star className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
              hoveredCard === job._id ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {job.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-green-500" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(job._id);
              }}
              className={`p-2 rounded-full transition-all duration-300 ${
                likedJobs.has(job._id)
                  ? 'bg-red-100 text-red-500 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${likedJobs.has(job._id) ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-500 transition-all duration-300">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-medium">{job.salary}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{job.jobType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-500" />
            <span>{job.experienceLevel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            <span>{job.applicants} applicants</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Skills */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, skillIndex) => (
              <span
                key={skill}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  hoveredCard === job._id
                    ? 'bg-blue-500 text-white transform scale-110'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
                style={{ animationDelay: `${skillIndex * 0.05}s` }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {user?.role === 'student' && (
            <button
              onClick={() => handleApply(job._id)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                hoveredCard === job._id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Target className="w-4 h-4" />
              Apply Now
            </button>
          )}
          
          {!user && (
            <button onClick={()=>navigate('/login')} className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              Login to Apply
            </button>
          )}

          {user?.role === 'recruiter' && user._id === job.postedBy && (
            <div className="flex gap-2">
              <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Animated Background Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl`} />
      
      {/* Hover Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
    </div>
  );
// const JobCard = ({ job, index, user, likedJobs, toggleLike, handleApply }) => {
//   // ++ STATE MOVED INSIDE THE COMPONENT ++
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br transition-all duration-500 ease-out cursor-pointer
//         ${job.featured 
//           ? 'from-violet-50 via-white to-blue-50 border-2 border-gradient-to-r border-violet-200' 
//           : 'from-gray-50 via-white to-gray-50 border border-gray-200'
//         }
//         ${isHovered ? 'transform scale-[1.02] shadow-2xl shadow-blue-500/20' : 'hover:shadow-xl'}
//       `}
//       // ++ HANDLERS USE LOCAL STATE ++
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{
//         animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
//         transformOrigin: 'center bottom'
//       }}
//     >
//       {/* Featured Badge */}
//       {job.featured && (
//         <div className="absolute top-4 right-4 z-10">
//           <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
//             <Star className="w-3 h-3" />
//             Featured
//           </div>
//         </div>
//       )}

//       {/* Card Content */}
//       <div className="p-6 relative z-10">
//         {/* Header */}
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex-1">
//             {/* ++ CONDITION USES LOCAL STATE ++ */}
//             <h2 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
//               isHovered ? 'text-blue-600' : 'text-gray-900'
//             }`}>
//               {job.title}
//             </h2>
//             <div className="flex items-center gap-4 text-sm text-gray-600">
//               <div className="flex items-center gap-1">
//                 <Building2 className="w-4 h-4 text-blue-500" />
//                 <span className="font-medium">{job.company}</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <MapPin className="w-4 h-4 text-green-500" />
//                 <span>{job.location}</span>
//               </div>
//             </div>
//           </div>
          
//           {/* Action Buttons */}
//           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleLike(job._id);
//               }}
//               className={`p-2 rounded-full transition-all duration-300 ${
//                 likedJobs.has(job._id)
//                   ? 'bg-red-100 text-red-500 hover:bg-red-200'
//                   : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500'
//               }`}
//             >
//               <Heart className={`w-4 h-4 ${likedJobs.has(job._id) ? 'fill-current' : ''}`} />
//             </button>
//             <button className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-500 transition-all duration-300">
//               <Share2 className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Job Details */}
//         <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
//           <div className="flex items-center gap-2">
//             <DollarSign className="w-4 h-4 text-green-500" />
//             <span className="font-medium">{job.salary}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Clock className="w-4 h-4 text-blue-500" />
//             <span>{job.jobType}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Award className="w-4 h-4 text-purple-500" />
//             <span>{job.experienceLevel}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Users className="w-4 h-4 text-orange-500" />
//             <span>{job.applicants} applicants</span>
//           </div>
//         </div>

//         {/* Description */}
//         <p className="text-gray-600 text-sm mb-4 leading-relaxed">
//           {job.description}
//         </p>

//         {/* Skills */}
//         <div className="mb-6">
//           <div className="flex flex-wrap gap-2">
//             {job.skills.map((skill, skillIndex) => (
//               <span
//                 key={skill}
//                 // ++ CONDITION USES LOCAL STATE ++
//                 className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
//                   isHovered
//                     ? 'bg-blue-500 text-white transform scale-110'
//                     : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//                 }`}
//                 style={{ animationDelay: `${skillIndex * 0.05}s` }}
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3">
//           {user?.role === 'student' && (
//             <button
//               onClick={() => handleApply(job._id)}
//               // ++ CONDITION USES LOCAL STATE ++
//               className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
//                 isHovered
//                   ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
//                   : 'bg-blue-500 text-white hover:bg-blue-600'
//               }`}
//             >
//               <Target className="w-4 h-4" />
//               Apply Now
//             </button>
//           )}
          
//           {!user && (
//             <button className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2">
//               <LogIn className="w-4 h-4" />
//               Login to Apply
//             </button>
//           )}

//           {user?.role === 'recruiter' && user._id === job.postedBy && (
//             <div className="flex gap-2">
//               <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center gap-2">
//                 <Edit className="w-4 h-4" />
//                 Edit
//               </button>
//               <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center gap-2">
//                 <Trash2 className="w-4 h-4" />
//                 Delete
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Animated Background Effect */}
//       <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl`} />
      
//       {/* Hover Glow Effect */}
//       <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
//     </div>
//   );
// };

  // function handlePostJob() {
    
  // }


  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Briefcase className="w-10 h-10 text-blue-500" />
            Discover Amazing Opportunities
          </h1>
          <p className="text-gray-600 text-lg">Find your perfect job match from our curated collection</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {['all', 'featured', 'remote'].map(filter => (
              <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedFilter === filter
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
              >
                <Filter className="w-4 h-4" />
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Post Job Button */}
          {user?.role === 'recruiter' && (
            <button
            onClick={() => navigate('/postjob')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-green-500/25"
            >
              {showPostForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showPostForm ? 'Close Form' : 'Post a Job'}
            </button>
          )}
        </div>

        {/* Post Job Form */}
        {showPostForm && (
          <div className="mb-8 animate-fadeIn">
            {/* Placeholder for PostJobForm component */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Post a New Job</h3>
              <p className="text-gray-600">PostJobForm component would be rendered here</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading amazing opportunities...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-bold text-blue-600">{filteredJobs?.length}</span> opportunities
              </p>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs?.map((job, index) => (
                <JobCard key={job._id} job={job} index={index} />
              ))}
            </div>

            {/* Empty State */}
            {filteredJobs?.length === 0 || jobs?.length ===0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
          }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
              }
          to {
            opacity: 1;
            transform: translateY(0);
            }
            }
            
            .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
          }
          `}</style>
    </div>
    </>
  );
}


