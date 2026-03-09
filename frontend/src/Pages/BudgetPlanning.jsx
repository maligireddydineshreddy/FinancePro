import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import API_CONFIG from "../config/api";
import { formatNumberWithCommas, removeCommas } from "../utils/formatNumber";

const BudgetPlanning = () => {
  const [salary, setSalary] = useState(null);
  const [expensesList, setExpensesList] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newSaving, setNewSaving] = useState({
    amount: "",
    goal: "",
    date: "",
  });
  const [savings, setSavings] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Fetch user data
  const getUser = async () => {
    try {
      const { data } = await axios.get(
        `${API_CONFIG.BACKEND_URL}/users/user/${userId}`
      );
      setSalary(data?.user?.income);
      setSavings(data?.user?.savings || []); // Make sure savings is always an array
      setExpensesList(data?.user?.expenses || []);
      setTotalExpenses(
        data?.user?.expenses.reduce(
          (acc, expense) => acc + Number(expense.amount),
          0
        )
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Handle modal open/close
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Handle form submission for savings
  const handleSavingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_CONFIG.BACKEND_URL}/savings/add-saving`,
        {
          userId: userId,
          amount: removeCommas(newSaving.amount),
          date: newSaving.date,
          goal: removeCommas(newSaving.goal),
        }
      );
      console.log("Savings added successfully:", response.data);
      toggleModal();
      getUser();
    } catch (error) {
      console.error("Error adding savings:", error);
    }
  };

  // Format the date
  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-GB", options); // 'en-GB' for DD/MM/YYYY format
  };

  // Handle chat input change
  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Send message to the chatbot
  const sendMessage = async () => {
    if (!userInput.trim()) return;
    setChatMessages([...chatMessages, { user: true, message: userInput }]);

    try {
      const response = await axios.post(
        "https://api.example.com/gemini", // Replace with actual Gemini API URL
        { query: userInput }
      );
      const answer = response.data.answer; // Adjust this based on Gemini API response structure
      setChatMessages([
        ...chatMessages,
        { user: true, message: userInput },
        { user: false, message: answer },
      ]);
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      setChatMessages([
        ...chatMessages,
        { user: true, message: userInput },
        { user: false, message: "Sorry, I couldn't understand that." },
      ]);
    }

    setUserInput(""); // Clear input field after sending the message
  };

  // Toggle chat window visibility
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Monthly Budget Planning
          </h1>

          {/* Income Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">
              Income
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-100 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  Salary
                </h3>
                <p className="text-gray-700">Your monthly salary income.</p>
                <p className="text-2xl font-bold text-green-600 mt-4">
                  ₹{formatNumberWithCommas(salary)}
                </p>
              </div>
            </div>
          </div>

          {/* Expenses Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">
              Expenses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {expensesList.map((expense) => (
                <div
                  key={expense._id}
                  className="bg-red-100 p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-semibold text-red-600 mb-2">
                    {expense.category}
                  </h3>
                  <p className="text-2xl font-bold text-red-600 mt-4">
                    ₹{formatNumberWithCommas(expense.amount)}
                  </p>
                  <p className="text-gray-700">
                    Date: {formatDate(expense.date)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">
              Savings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {savings.map((saving) => (
                <div
                  key={saving._id}
                  className="bg-blue-100 p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    {saving.goal}
                  </h3>
                  <p className="text-gray-700">Amount: ₹{formatNumberWithCommas(saving.amount)}</p>
                  <p className="text-gray-700">
                    Date: {formatDate(saving.date)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Summary */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">
              Budget Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  Total Income
                </h3>
                <p className="text-4xl font-bold text-blue-600">₹{formatNumberWithCommas(salary)}</p>
              </div>
              <div className="bg-yellow-100 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-yellow-600 mb-2">
                  Total Expenses
                </h3>
                <p className="text-4xl font-bold text-yellow-600">
                  ₹{formatNumberWithCommas(totalExpenses)}
                </p>
              </div>
              <div className="bg-green-100 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  Remaining Balance
                </h3>
                <p className="text-4xl font-bold text-green-600">
                  ₹{formatNumberWithCommas(salary - totalExpenses)}
                </p>
              </div>
            </div>
          </div>

          {/* Add Savings Button */}
          <div className="mb-12 text-center">
            <button
              onClick={toggleModal}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Savings
            </button>
          </div>

          {/* Budget Tips */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">
              Budgeting Tips
            </h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Track all your expenses monthly.</li>
              <li>
                Plan for your savings first, before spending on non-essential
                items.
              </li>
              <li>Keep an emergency fund for unexpected expenses.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Chatbot Floating Button */}
      <div
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer"
      >
        Chat with us
      </div>

      {/* Chatbot Modal */}
      {chatOpen && (
        <div className="fixed bottom-16 right-6 bg-white shadow-lg rounded-lg w-80 p-4">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Chatbot</h3>
            <div className="flex justify-end">
              <button
                onClick={toggleChat}
                className="text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="overflow-y-auto max-h-60 mb-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.user ? "bg-blue-100" : "bg-gray-200"
                }`}
              >
                <p className="text-gray-800">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex items-center">
            <input
              type="text"
              value={userInput}
              onChange={handleUserInputChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-600 text-white p-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Modal for Adding Savings */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-6">Add Savings</h2>
            <form onSubmit={handleSavingsSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Goal</label>
                <input
                  type="text"
                  value={formatNumberWithCommas(newSaving.goal)}
                  onChange={(e) => {
                    const rawValue = removeCommas(e.target.value);
                    if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
                      setNewSaving({ ...newSaving, goal: rawValue });
                    }
                  }}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Amount</label>
                <input
                  type="text"
                  value={formatNumberWithCommas(newSaving.amount)}
                  onChange={(e) => {
                    const rawValue = removeCommas(e.target.value);
                    if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
                      setNewSaving({ ...newSaving, amount: rawValue });
                    }
                  }}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700">Date</label>
                <input
                  type="date"
                  value={newSaving.date}
                  onChange={(e) =>
                    setNewSaving({ ...newSaving, date: e.target.value })
                  }
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="ml-4 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BudgetPlanning;
