import React, { useState, useEffect } from 'react';
import NavBar from '../component/NavBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ToastMessage from '../component/ToastMessage';
import { ImagePlus, User, Mail, Lock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Registration() {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ message: '', type: '' });

  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: '',
  });

  const [image, setImage] = useState(null);
  const USER_END_POINT = import.meta.env.VITE_USER_END_POINT;

  const handleOnChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in userData) formData.append(key, userData[key]);
      if (image) formData.append('file', image);

      const result = await axios.post(`${USER_END_POINT}/register`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (result.status === 200) {
        setToast({ message: result.data.message, type: 'success' });
        setTimeout(() => {
          setToast({ message: '', type: '' });
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      setToast({ message, type: 'danger' });
      console.error(message);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-x-hidden">
      <NavBar />

      <ToastMessage
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ rotateY: 15, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 1, type: 'spring' }}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-white/30"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-lg">
            Create an Account
          </h2>

          {[
            { icon: User, name: 'fullName', type: 'text', placeholder: 'Full Name' },
            { icon: Mail, name: 'email', type: 'email', placeholder: 'Email' },
            { icon: Lock, name: 'password', type: 'password', placeholder: 'Password' },
            { icon: Phone, name: 'phone', type: 'text', placeholder: 'Phone' },
          ].map(({ icon: Icon, name, type, placeholder }) => (
            <div className="mb-4 relative" key={name}>
              <Icon className="absolute left-3 top-3 text-gray-400" />
              <input
                name={name}
                onChange={handleOnChange}
                type={type}
                placeholder={placeholder}
                className="pl-10 w-full py-3 rounded-lg bg-white bg-opacity-80 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="text-white font-medium">Select Role</label>
            <select
              name="role"
              onChange={handleOnChange}
              className="w-full mt-2 py-3 px-3 rounded-lg bg-white bg-opacity-80 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Choose one</option>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-white font-medium">Upload Profile Image</label>
            <div className="relative mt-2">
              <ImagePlus className="absolute left-3 top-3 text-gray-500" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full pl-10 py-3 rounded-lg bg-white bg-opacity-80 shadow-inner file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
          </div>

          <div className="flex items-center mb-6 text-white">
            <input type="checkbox" id="terms" className="mr-2" />
            <label htmlFor="terms">I agree to the Terms of Service</label>
          </div>

          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition-transform transform shadow-xl"
          >
            Register
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}


