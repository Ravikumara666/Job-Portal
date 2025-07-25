import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, LogOut, UserPlus, Briefcase,FileText, Building, Home, PlusCircle, User, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import ToastMessage from './ToastMessage';

import { persistor } from "../redux/Store";
import { setUser } from "../redux/features/AuthSlice";

export default function NavBar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const USER_END_POINT = import.meta.env.VITE_USER_END_POINT;

  const [toast, setToast] = useState({ message: '', type: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const name = user?.fullName;
  const role = user?.role;

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${USER_END_POINT}/logout`, {
        withCredentials: true
      });
      setToast({ message: result.data.message, type: 'success' });
      dispatch(setUser(null));
      persistor.purge();
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };
  
  const handleProfileClick = () => {
    navigate('/dashboard');
    setIsProfileDropdownOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/jobs', label: 'Jobs', icon: Briefcase },
  ];

   if (role === 'recruiter') {
    navItems.push(
      { path: '/myposts', label: 'My Posts', icon: FileText },
      
    );
  }
  if (role === 'recruiter') {
    navItems.push({ path: '/postjob', label: 'Post Job', icon: PlusCircle },
      { path: '/applicationrecived', label: 'Applications Received', icon: PlusCircle }
    );
  }
  if (role === 'student') {
    navItems.push({ path: '/companies', label: 'Companies', icon: Building });
  }

  return (
    <>
      <ToastMessage 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: '' })} 
      />
      
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:scale-105">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-300">
                  Job
                </span>
                <span className="text-2xl font-bold text-red-500 ml-1 group-hover:text-pink-500 transition-colors duration-300">
                  Portal
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {role ? (
                <div className="flex items-center space-x-4">
                  {/* Profile Section */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 hover:border-gray-300 transition-all duration-300 group"
                    >
                      <div className="relative">
                        <img
                          src={user?.profile?.file || "/default-avatar.png"}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800 truncate max-w-24">
                          {name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{role}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                        <button
                          onClick={handleProfileClick}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 group"
                        >
                          <User className="w-4 h-4 text-gray-500 group-hover:text-blue-500 transition-colors duration-200" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Dashboard</span>
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-red-50 transition-colors duration-200 group"
                        >
                          <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSignup}
                    className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                  <button
                    onClick={handleLogin}
                    className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute left-0 right-0 top-16 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl animate-in slide-in-from-top-2 duration-300">
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left rounded-xl text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group"
                    >
                      <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  {role ? (
                    <>
                      <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
                        <img
                          src={user?.profile?.file || "/default-avatar.png"}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{name}</p>
                          <p className="text-sm text-gray-500 capitalize">{role}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleProfileClick();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-left rounded-xl text-gray-700 hover:text-blue-500 hover:bg-blue-50 transition-all duration-300"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-left rounded-xl text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          handleSignup();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg"
                      >
                        <UserPlus className="w-5 h-5" />
                        <span>Sign Up</span>
                      </button>
                      <button
                        onClick={() => {
                          handleLogin();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg"
                      >
                        <LogIn className="w-5 h-5" />
                        <span>Login</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Click outside to close dropdown */}
        {isProfileDropdownOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsProfileDropdownOpen(false)}
          ></div>
        )}
      </nav>
    </>
  );
}