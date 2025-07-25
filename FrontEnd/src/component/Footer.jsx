import React from 'react'
import { Briefcase, ArrowRight, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 px-4 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* JobPortal Info */}
        <div>
          <div className="flex items-center text-white text-xl font-semibold mb-4">
            <Briefcase className="mr-2" />
            JobPortal
          </div>
          <p className="mb-2">
            <span className="text-white font-medium">Call now:</span> (319) 555-0115
          </p>
          <p className="text-sm">
            6391 Elgin St. Celina, Delaware 10299, New York, United States of America
          </p>
        </div>

        {/* Quick Link */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Link</h4>
          <ul className="space-y-2">
            <li>About</li>
            <li className="flex items-center gap-1">
              <ArrowRight size={14} /> <span>Contact</span>
            </li>
            <li>Pricing</li>
            <li>Blog</li>
          </ul>
        </div>

        {/* Candidate */}
        <div>
          <h4 className="text-white font-semibold mb-4">Candidate</h4>
          <ul className="space-y-2">
            <li>Browse Jobs</li>
            <li>Browse Employers</li>
            <li>Candidate Dashboard</li>
            <li>Saved Jobs</li>
          </ul>
        </div>

        {/* Employers */}
        <div>
          <h4 className="text-white font-semibold mb-4">Employers</h4>
          <ul className="space-y-2">
            <li>Post a Job</li>
            <li>Browse Candidates</li>
            <li>Employers Dashboard</li>
            <li>Applications</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li>FAQs</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-sm flex flex-col md:flex-row justify-between items-center text-gray-500">
        <p>@ 2021 JobPortal - Job Portal. All rights reserved</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
          <Youtube className="w-5 h-5 hover:text-white cursor-pointer" />
          <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
          <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}
