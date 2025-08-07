import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Briefcase, MapPin, DollarSign, Clock, User, Code, FileText, Building2, Sparkles } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createJob } from '../redux/features/JobSlice.jsx';
import NavBar from './NavBar.jsx';

export default function PostJobForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    company: '',
    salary: '',
    location: '',
    jobType: 'Full-time',
    experienceLevel: 'Fresher',
    skills: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const canvasRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();

  // 3D Background Animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create floating geometric shapes
    const geometries = [
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.ConeGeometry(0.3, 0.6, 8),
      new THREE.OctahedronGeometry(0.4)
    ];

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.3 }),
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.3 }),
      new THREE.MeshPhongMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.3 }),
      new THREE.MeshPhongMaterial({ color: 0x10b981, transparent: true, opacity: 0.3 })
    ];

    const meshes = [];
    for (let i = 0; i < 12; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      scene.add(mesh);
      meshes.push(mesh);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x3b82f6, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 15;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    sceneRef.current = scene;
    rendererRef.current = renderer;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const fieldConfigs = [
    { name: 'title', label: 'Job Title', icon: Briefcase, placeholder: 'Senior Software Engineer' },
    { name: 'role', label: 'Role Type', icon: User, placeholder: 'Full-time Developer' },
    { name: 'company', label: 'Company', icon: Building2, placeholder: 'Tech Innovations Inc.' },
    { name: 'location', label: 'Location', icon: MapPin, placeholder: 'San Francisco, CA' },
    { name: 'salary', label: 'Salary Range', icon: DollarSign, placeholder: '$80,000 - $120,000' },
    { name: 'jobType', label: 'Job Type', icon: Clock, placeholder: 'Remote, Hybrid, On-site' },
    { name: 'experienceLevel', label: 'Experience Level', icon: User, placeholder: 'Mid-level, Senior' },
    { name: 'skills', label: 'Required Skills', icon: Code, placeholder: 'React, Node.js, Python' },
    { name: 'description', label: 'Job Description', icon: FileText, placeholder: 'Tell us about this amazing opportunity...', isTextarea: true }
  ];

  // This function should only be called when actually submitting the job (final step)
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    const jobData = {
      ...formData,
      skills: formData.skills.split(',').map((skill) => skill.trim()),
    };

    try {
      // Dispatch the Redux action to create the job
      dispatch(createJob(jobData));
      
      console.log('✅ Job posted:', jobData);

      // Show success popup
      setShowSuccessPopup(true);
      
      // Reset form
      setFormData({
        title: '', role: '', company: '', location: '', salary: '',
        jobType: 'Full-time', experienceLevel: 'Fresher', skills: '', description: ''
      });
      setCurrentStep(0);

      // Navigate to home after 2 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        // Add navigation logic here - you might need to use React Router
        // For example: navigate('/') or window.location.href = '/'
        window.location.href = '/'; // Simple redirect - adjust based on your routing
      }, 2000);

    } catch (err) {
      console.error('Failed to post job:', err);
      alert(`❌ ${err.message || err.error || 'Failed to post job.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent form submission for navigation
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(totalSteps+"totalSteps")
    console.log(currentStep+"currentStep")
    // Only submit if on the last step
    if (currentStep === totalSteps) {
        console.log(totalSteps+"totalSteps")
        console.log(currentStep+"currentStep")
      handleFinalSubmit();
    }
  };

  const nextStep = () => {
    // Only advance step if not on the last step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrentFields = () => {
    const startIndex = currentStep * 3;
    return fieldConfigs.slice(startIndex, startIndex + 3);
  };

  const totalSteps = 3; // Fixed to 3 steps instead of calculated
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <>
      <NavBar/>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* 3D Canvas Background */}
        <canvas 
          ref={canvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none z-0"
        />
        
        {/* Animated Background Gradients */}
        <div className="fixed inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse z-0" />
        
        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-8 rounded-3xl shadow-2xl text-center transform animate-pulse">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Success! 🎉</h2>
              <p className="text-white/90">Job posted successfully!</p>
              <div className="mt-4 w-full bg-white/20 rounded-full h-1">
                <div className="bg-white h-1 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </div>
              <p className="text-white/70 text-sm mt-2">Redirecting to home...</p>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
                <h1 className="text-4xl font-bold text-white">Post Your Dream Job</h1>
                <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
              </div>
              <p className="text-gray-300 text-lg">Create an amazing opportunity in just a few steps</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Step {currentStep + 1} of {totalSteps}</span>
                <span className="text-sm text-gray-300">{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Form Card */}
            <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 transition-all duration-500 hover:shadow-purple-500/25">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Dynamic Fields */}
                <div className="space-y-6">
                  {getCurrentFields().map((field, index) => {
                    const Icon = field.icon;
                    return (
                      <div 
                        key={field.name}
                        className="group transition-all duration-300"
                        style={{
                          animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                          <Icon className="w-4 h-4 text-blue-400" />
                          {field.label}
                        </label>
                        
                        {field.isTextarea ? (
                          <textarea
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => setFocusedField(null)}
                            rows={4}
                            className={`w-full p-4 rounded-xl bg-white/5 border transition-all duration-300 text-white placeholder-gray-400 resize-none
                              ${focusedField === field.name 
                                ? 'border-blue-400 bg-white/10 shadow-lg shadow-blue-500/25 scale-[1.02]' 
                                : 'border-white/20 hover:border-white/40'
                              }
                              focus:outline-none focus:ring-2 focus:ring-blue-400/50`}
                          />
                        ) : (
                          <input
                            type="text"
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full p-4 rounded-xl bg-white/5 border transition-all duration-300 text-white placeholder-gray-400
                              ${focusedField === field.name 
                                ? 'border-blue-400 bg-white/10 shadow-lg shadow-blue-500/25 scale-[1.02]' 
                                : 'border-white/20 hover:border-white/40'
                              }
                              focus:outline-none focus:ring-2 focus:ring-blue-400/50`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      currentStep === 0
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600 hover:scale-105 shadow-lg'
                    }`}
                  >
                    Previous
                  </button>

                  {currentStep === totalSteps? (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Post Job
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                    >
                      Next Step
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                Create opportunities that change lives ✨
              </p>
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
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
        `}</style>
      </div>
    </>
  );
}