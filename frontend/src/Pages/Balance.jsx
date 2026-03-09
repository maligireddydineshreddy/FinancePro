import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { FaMoneyBillWave, FaPlus } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import API_CONFIG from "../config/api";
import { formatNumberWithCommas, removeCommas } from "../utils/formatNumber";

const Balance = () => {
  const [salary, setSalary] = useState(null);
  const [expensesList, setExpensesList] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [expense, setExpense] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [expenseCategory, setExpenseCategory] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const getUser = async () => {
    try {
      const { data } = await axios.get(
        `${API_CONFIG.BACKEND_URL}/users/user/${userId}`
      );
      setSalary(data?.user?.income);
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

  useEffect(() => {
    getUser();
  }, []);

  const handleAddExpense = async () => {
    const cleanAmount = removeCommas(expense);
    if (totalExpenses + Number(cleanAmount) > salary) {
      toast.error("Expense amount exceeds your monthly salary!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_CONFIG.BACKEND_URL}/expenses/add-expense`,
        {
          userId,
          date: selectedDate,
          amount: cleanAmount,
          category: expenseCategory,
        }
      );

      if (response.status === 201) {
        toast.success("Expense added successfully.");
        setModalOpen(false);
        setExpense("");
        getUser();
      } else {
        toast.error("Failed to add expense.");
      }
    } catch (error) {
      toast.error("Error adding expense. Please try again.");
    }
  };

  const handleDel = async (expenseId) => {
    try {
      await axios.post(`${API_CONFIG.BACKEND_URL}/expenses/remove-expense`, {
        userId: userId,
        expenseId: expenseId,
      });
      toast.success("Expense Deleted Succesfully!!");
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const remainingBalance = salary - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
        {/* Financial Overview */}
        <div className="card-modern animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 flex items-center">
            <FaMoneyBillWave className="mr-3 text-indigo-600" />
            Manage Your <span className="text-gradient ml-2">Finances</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <FinancialCard 
              title="Salary" 
              value={salary} 
              color="blue" 
              icon="💼"
              delay={0}
            />
            <FinancialCard 
              title="Expenses" 
              value={totalExpenses} 
              color="red" 
              icon="💸"
              delay={100}
            />
            <FinancialCard
              title="Remaining Balance"
              value={remainingBalance}
              color={remainingBalance >= 0 ? "green" : "red"}
              icon={remainingBalance >= 0 ? "💰" : "⚠️"}
              delay={200}
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary inline-flex items-center"
          >
            <FaPlus className="mr-2" /> Add Expense
          </button>
        </div>

        {/* Expense List */}
        <ExpenseList expensesList={expensesList} handleDel={handleDel} />

        {/* Modal */}
        {isModalOpen && (
          <ExpenseModal
            expense={expense}
            setExpense={setExpense}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            expenseCategory={expenseCategory}
            setExpenseCategory={setExpenseCategory}
            handleAddExpense={handleAddExpense}
            setModalOpen={setModalOpen}
          />
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

const FinancialCard = ({ title, value, color, icon, delay = 0 }) => {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500 border-blue-200 text-blue-700",
    red: "from-red-500 to-rose-500 border-red-200 text-red-700",
    green: "from-emerald-500 to-teal-500 border-emerald-200 text-emerald-700",
  };

  const gradient = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`card-modern card-hover bg-gradient-to-br ${gradient} text-white border-2 animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-3 opacity-90">{title}</h3>
      <p className="text-3xl md:text-4xl font-bold">
        ₹{formatNumberWithCommas(value || 0)}
      </p>
    </div>
  );
};

const ExpenseList = ({ expensesList, handleDel }) => (
  <div className="card-modern animate-fade-in-up animation-delay-300">
    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <span className="text-gradient">Your Expenses</span>
      <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
        {expensesList.length} {expensesList.length === 1 ? 'item' : 'items'}
      </span>
    </h3>
    {expensesList.length === 0 ? (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-gray-500 text-lg">No expenses added yet.</p>
        <p className="text-gray-400 text-sm mt-2">Start tracking your expenses to see them here.</p>
      </div>
    ) : (
      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
        {expensesList.map((expense, index) => (
          <div
            key={expense._id || index}
            className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:shadow-lg hover:border-red-300 transition-all duration-300 group animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {expense.category?.charAt(0) || 'E'}
              </div>
              <div>
                <span className="text-gray-800 font-semibold text-lg block">{expense.category}</span>
                <span className="text-gray-500 text-sm">{expense.date}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-red-600 font-bold text-xl">
                ₹{formatNumberWithCommas(expense.amount)}
              </span>
              <button
                onClick={() => handleDel(expense._id)}
                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all duration-200 group-hover:scale-110"
              >
                <MdDelete size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ExpenseModal = ({
  selectedDate,
  setSelectedDate,
  expense,
  setExpense,
  expenseCategory,
  setExpenseCategory,
  handleAddExpense,
  setModalOpen,
}) => (
  <div 
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
    onClick={() => setModalOpen(false)}
  >
    <div 
      className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 w-full max-w-md animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaPlus className="mr-2 text-indigo-600" />
          Add Expense
        </h3>
        <button
          onClick={() => setModalOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
        >
          ×
        </button>
      </div>

      {/* Calendar input for selecting date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input-modern w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Amount
        </label>
        <input
          type="text"
          value={formatNumberWithCommas(expense)}
          onChange={(e) => {
            const rawValue = removeCommas(e.target.value);
            if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
              setExpense(rawValue);
            }
          }}
          placeholder="Enter Amount"
          className="input-modern w-full"
        />
      </div>

      {/* Dropdown for Expense Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category
        </label>
        <select
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
          className="input-modern w-full"
        >
          <option value="">Select Expense Category</option>
          <option value="Rent">Rent</option>
          <option value="Groceries">Groceries</option>
          <option value="Water Bill">Water Bill</option>
          <option value="Electricity Bill">Electricity Bill</option>
          <option value="Subscriptions">Subscriptions</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          onClick={() => setModalOpen(false)}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleAddExpense}
          className="btn-primary px-6 py-3"
        >
          Add Expense
        </button>
      </div>
    </div>
  </div>
);

export default Balance;
