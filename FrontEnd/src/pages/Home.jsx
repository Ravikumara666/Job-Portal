import React from 'react'
import NavBar from '../component/NavBar'
import { useSelector } from 'react-redux';
import { MapPin, Search } from "lucide-react";
import heroImage from '../assets/manushya.png'
import flowImage from '../assets/flow.png'
import Footer from '../component/Footer';
  
export default function Home() {
  const userData = useSelector((state)=>state.auth.user)
  return (
    <div>
      <NavBar/>
      <HeroSection/>
      <Flow/>
      <Footer/>
    </div>
  )
}


// Hero Section function

function HeroSection() {
  return (
    <section className="bg-gray-50 py-16 px-4 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Section */}
        <div className="w-full md:w-[65%]">
          <div className="max-w-2xl mx-auto"> {/* Centers content inside 65% width */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find a job that suits <br className="hidden md:block" />
              your interest & skills.
            </h1>
            <p className="text-gray-600 mb-6">
              Aliquam vitae turpis in diam convallis finibus in at risus. Nullam
              in scelerisque leo, eget sollicitudin velit vestibulum.
            </p>

            {/* Search Bar */}
            <div className="bg-white shadow-md rounded-xl p-2 flex flex-wrap md:flex-nowrap items-center gap-2">
              <div className="flex items-center px-3 text-gray-400">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Job title, Keyword..."
                  className="outline-none px-2 py-2 w-full"
                />
              </div>
              <div className="flex items-center px-3 text-gray-400 border-l border-gray-200">
                <MapPin size={20} />
                <input
                  type="text"
                  placeholder="Your Location"
                  className="outline-none px-2 py-2 w-full"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition-all ml-auto">
                Find Job
              </button>
            </div>

            {/* Suggestions */}
            <p className="text-sm text-gray-500 mt-3">
              Suggestion:{" "}
              <span className="text-blue-600 font-medium">Designer</span>,{" "}
              <span className="text-blue-600 font-medium">Programming</span>,{" "}
              <span className="text-blue-600 font-medium">Digital Marketing</span>, Video, Animation.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 text-center">
              <div className="bg-white shadow rounded-xl py-4">
                <p className="text-2xl font-bold text-blue-600">1,75,324</p>
                <p className="text-gray-500 text-sm">Live Job</p>
              </div>
              <div className="bg-blue-600 text-white shadow rounded-xl py-4">
                <p className="text-2xl font-bold">97,354</p>
                <p className="text-sm">Companies</p>
              </div>
              <div className="bg-white shadow rounded-xl py-4">
                <p className="text-2xl font-bold text-blue-600">38,47,154</p>
                <p className="text-gray-500 text-sm">Candidates</p>
              </div>
              <div className="bg-white shadow rounded-xl py-4">
                <p className="text-2xl font-bold text-blue-600">7,532</p>
                <p className="text-gray-500 text-sm">New Jobs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[35%] hidden md:block">
          <img
            src={heroImage}
            alt="Job Search Illustration"
            className="w-full max-w-lg mx-auto"
          />
        </div>
      </div>
    </section>
  );
}

// Flow of the Our Job Portal

function Flow() {
  return (
    <div className="bg-white">
      <div className="container mx-auto p-4">
        <img
          src={flowImage}
          alt="Job Search Illustration"
          className="w-full" // Full width of parent
        />
      </div>
    </div>
  );
}

