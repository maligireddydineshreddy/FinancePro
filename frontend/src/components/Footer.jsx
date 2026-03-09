import React from "react";
import { FaChartLine } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-8 text-center w-full mt-auto">
      <div className="container mx-auto px-4 animate-fade-in">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
            <FaChartLine className="text-white text-lg" />
          </div>
          <span className="text-white text-xl font-bold">FinancePro</span>
        </div>
        <p className="text-gray-300 text-sm">
          &copy; 2025 FinancePro. All rights reserved.
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Empowering your financial journey
        </p>
      </div>
    </footer>
  );
};

export default Footer;
