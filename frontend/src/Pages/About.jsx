import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import dayjs from "dayjs";
import API_CONFIG from "../config/api";

const HomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const [bills, setBills] = useState([]);
  const [tomorrowBills, setTomorrowBills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const getUser = async () => {
    try {
      const { data } = await axios.get(
        `${API_CONFIG.BACKEND_URL}/users/user/${userId}`
      );

      const userBills = data?.user?.bills || [];
      setBills(userBills);

      // Check for bills with dueDate of tomorrow
      const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
      const filteredBills = userBills.filter(
        (bill) => dayjs(bill.dueDate).format("YYYY-MM-DD") === tomorrow
      );
      setTomorrowBills(filteredBills);

      // Show modal if there are bills for tomorrow
      if (filteredBills.length > 0) {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header Section */}
      <Header />

      {/* Bills Due Tomorrow Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Bills Due Tomorrow
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <ul className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {tomorrowBills.map((bill, index) => (
                <li
                  key={bill._id}
                  className="p-5 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border-l-4 border-red-500 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-red-700 font-semibold text-lg mb-2">
                    {bill.name}
                  </p>
                  <div className="space-y-1">
                    <p className="text-gray-700">
                      <span className="font-semibold">Amount:</span> ₹
                      {bill.amount?.toLocaleString('en-IN')}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Due Date:</span>{" "}
                      {dayjs(bill.dueDate).format("DD MMM YYYY")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Manage Your Finances with <span className="text-yellow-300">Ease</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto opacity-95 animate-fade-in-up animation-delay-200">
            FinancePro helps you track your expenses, manage your budget, and
            grow your savings with our easy-to-use tools. Simplify your
            financial life.
          </p>
          <button className="mt-10 bg-white text-indigo-600 font-bold py-4 px-8 rounded-full hover:bg-gray-100 transform hover:scale-110 shadow-2xl transition-all duration-300 animate-fade-in-up animation-delay-400">
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in-up">
            Why Choose <span className="text-gradient">FinancePro?</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mt-4 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Our app comes with a set of features designed to give you control
            over your finances.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: "https://www.freshbooks.com/wp-content/uploads/2022/02/expense-tracking.jpg",
                title: "Track Expenses",
                desc: "Easily keep track of all your transactions and manage your spending habits.",
                gradient: "from-blue-500 to-cyan-500",
                delay: 0
              },
              {
                img: "https://www.budgetease.biz/hubfs/bigstock-Financial-Accounting-Flat-Lay--394015448.jpeg",
                title: "Set Budgets",
                desc: "Plan your financial goals and set monthly budgets to keep your spending on track.",
                gradient: "from-purple-500 to-pink-500",
                delay: 200
              },
              {
                img: "https://www.sapphire-essentials.com/wp-content/uploads/2022/02/2022-03-14-Saving-for-the-Future.jpg",
                title: "Save for the Future",
                desc: "Use our savings tools to set aside money for long-term financial security.",
                gradient: "from-emerald-500 to-teal-500",
                delay: 400
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="card-modern card-hover group animate-fade-in-up"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div className={`relative h-48 w-full rounded-xl mb-6 overflow-hidden bg-gradient-to-r ${feature.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}>
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto text-center px-4">
          <div className="card-modern max-w-4xl mx-auto animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              About <span className="text-gradient">FinancePro</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              FinancePro was created to simplify financial management for
              individuals and businesses. Our mission is to provide easy-to-use
              tools that empower users to take control of their financial futures.
              Whether you want to track daily expenses, plan for retirement, or
              set aside money for future investments, FinancePro has everything
              you need in one convenient place.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in-up">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mt-4 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Have any questions or need help? Reach out to us, and we'll be happy
            to assist you!
          </p>
          <button 
            onClick={() => setShowContactModal(true)}
            className="btn-primary text-lg px-8 py-4 animate-fade-in-up animation-delay-400"
          >
            Contact Us
          </button>
        </div>
      </section>

      {/* Contact Modal */}
      {showContactModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
          onClick={() => setShowContactModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Contact Us</h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 mb-6">Reach out to us at:</p>
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-500 hover:shadow-lg transition-shadow duration-300">
                <p className="text-gray-700 font-semibold mb-2">Email 1:</p>
                <a 
                  href="mailto:maligireddydineshreddy@gmail.com"
                  className="text-indigo-600 hover:text-indigo-800 break-all font-medium transition-colors"
                >
                  maligireddydineshreddy@gmail.com
                </a>
              </div>
              <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
                <p className="text-gray-700 font-semibold mb-2">Email 2:</p>
                <a 
                  href="mailto:pramodmalipatil64@gmail.com"
                  className="text-purple-600 hover:text-purple-800 break-all font-medium transition-colors"
                >
                  pramodmalipatil64@gmail.com
                </a>
              </div>
            </div>
            <button
              onClick={() => setShowContactModal(false)}
              className="mt-6 w-full btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
