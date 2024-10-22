import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="mb-2 sm:mb-0">&copy; 2023 Seamless Payments. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300 transition-colors duration-200">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors duration-200">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
