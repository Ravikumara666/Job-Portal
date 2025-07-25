import React, { useState } from 'react';
import NavBar from '../component/NavBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../component/ToastMessage';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/AuthSlice';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [toast, setToast] = useState({ message: '', type: '' });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    role: ''
  });

  function handleOnChange(e) {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    console.log(loginData);
  }

  const USER_END_POINT = import.meta.env.VITE_USER_END_POINT;

  async function handleSubmit() {
    try {
      const SendData = await axios.post(
        `${USER_END_POINT}/login`,
        loginData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (SendData.status === 200) {
        setToast({ message: SendData.data.message, type: 'success' });
        dispatch(setUser(SendData.data.user));
        console.log(SendData.data.user);

        setTimeout(() => {
          setToast({ message: '', type: '' });
          navigate('/');
        }, 3000);
      }
    } catch (e) {
      const message = e.response?.data?.message || "Something went wrong";
      setToast({ message, type: 'danger' });
      setTimeout(() => {
        setToast({ message: '', type: '' });
      }, 3000);
      console.error(e);
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-purple-100 min-h-screen flex flex-col">
      <NavBar loginData={loginData} />
      <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      <div className="flex flex-col md:flex-row items-center justify-center flex-1 p-6 md:p-12">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            alt="Illustration"
            className="w-full max-w-md mx-auto animate-fadeIn"
          />
        </div>

        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-2xl p-8 border border-gray-200 animate-fadeInUp">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign in to your account</h2>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                onChange={handleOnChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                onChange={handleOnChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-1">Select Role</label>
            <select
              name="role"
              onChange={handleOnChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Choose one</option>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="!#" className="text-blue-600 hover:underline">Forgot password?</a>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Sign in <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}



