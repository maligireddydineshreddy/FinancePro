import React from "react";
import Header from "../components/Header";

const UserProfile = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm w-full">
          {/* Profile Banner */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-32 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 opacity-40"></div>
            <div className="absolute bottom-0 -mb-12 left-1/2 transform -translate-x-1/2">
              <img
                className="h-24 w-24 rounded-full border-4 border-white object-cover"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXQH83iHZFHSe8oftIjDikjz9XPpmQOKqBYVcW1UK3MRd7Z4PbbC2TkYfBN9zbdSkAd78&usqp=CAU"
                alt="User Avatar"
              />
            </div>
          </div>

          {/* Profile Information */}
          <div className="mt-16 text-center px-6 pb-6">
            <h2 className="text-2xl font-semibold text-gray-800">John Doe</h2>
            <p className="text-gray-500">Finance Manager</p>

            {/* Stats Section */}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-700">120</h3>
                <p className="text-gray-400">Transactions</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-700">$15,500</h3>
                <p className="text-gray-400">Balance</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-700">25</h3>
                <p className="text-gray-400">Accounts</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-around">
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full">
                Edit Profile
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
