import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChartLine, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/about", label: "Home" },
    { path: "/balance", label: "Service" },
    { path: "/chart", label: "Charts" },
    { path: "/transactions", label: "Transactions" },
    { path: "/investment", label: "Investment Calculator" },
    { path: "/budgetPlanner", label: "Budget Planner" },
    { path: "/bills", label: "Bills" },
    { path: "/news", label: "News" },
    { path: "/stockInfo", label: "Stock Information" },
    { path: "/stockpred", label: "Stock Prediction" },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/90 backdrop-blur-sm shadow-md'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Brand Name */}
          <Link 
            to="/about" 
            className="flex items-center space-x-2 group animate-fade-in"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <FaChartLine className="text-white text-xl" />
            </div>
            <span className="text-2xl font-bold text-gradient group-hover:scale-105 transition-transform duration-300">
              FinancePro
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex space-x-1 animate-fade-in">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-scale-in"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Logout Button */}
          <Link
            to="/"
            className="hidden lg:block btn-primary text-sm py-2 px-5 animate-fade-in"
          >
            LogOut
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 animate-fade-in-down border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-indigo-600 bg-indigo-50 border-l-4 border-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary text-center mt-2"
              >
                LogOut
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
