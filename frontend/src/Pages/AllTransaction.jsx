import React, { useState, useEffect } from "react";
import Header from "../components/Header"; // Assuming you have a Header component
import axios from "axios";
import API_CONFIG from "../config/api";
import { formatNumberWithCommas } from "../utils/formatNumber";

const AllTransaction = () => {
  // State for transactions and selected month
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [income, setIncome] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user?._id;

  // Fetch data from API or your state
  useEffect(() => {
    // Replace this with your actual API request
    const fetchTransactions = async () => {
      const { data } = await axios.get(
        `${API_CONFIG.BACKEND_URL}/users/user/${userId}`
      );
      console.log(data);
      setTransactions(data.user.expenses); // Store all transactions
      setFilteredTransactions(data.user.expenses); // Initially show all transactions
      setIncome(data.user.income);
      setTotalExpenses(
        data?.user?.expenses.reduce(
          (acc, expense) => acc + Number(expense.amount),
          0
        )
      );
    };

    fetchTransactions();
  }, []);

  // Handle month selection
  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setSelectedMonth(selectedMonth);

    if (selectedMonth === "All") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter((transaction) => {
        const transactionMonth = new Date(transaction.date).getMonth() + 1; // Month is 0-indexed
        return transactionMonth === parseInt(selectedMonth);
      });
      setFilteredTransactions(filtered);
    }
  };

  // Convert date to "Day Month Year" format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Convert filtered transactions to CSV format
  const convertToCSV = () => {
    const header = ["Date", "Category", "Amount"];
    const rows = filteredTransactions.map((transaction) => [
      transaction.date,
      transaction.category,
      transaction.amount,
    ]);

    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");

    return csvContent;
  };

  const downloadCSV = () => {
    const csvContent = convertToCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions.csv";
    link.click();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <section className="container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-semibold text-gray-700 text-center mb-6">
            Your Transaction History
          </h2>

          {/* Dropdown to filter by month */}
          <div className="mb-6">
            <label
              htmlFor="month"
              className="text-lg font-semibold text-gray-700"
            >
              Filter by Month:
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="ml-2 p-2 border rounded-md"
            >
              <option value="All">All</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <div className="mt-6 text-center">
              <button
                onClick={downloadCSV}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Download CSV
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-indigo-600 text-white text-left">
                  <th className="py-3 px-4 uppercase font-semibold text-sm">
                    Date
                  </th>
                  <th className="py-3 px-4 uppercase font-semibold text-sm">
                    Category
                  </th>
                  <th className="py-3 px-4 uppercase font-semibold text-sm text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className={`text-gray-700 ${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-4">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="py-3 px-4">{transaction.category}</td>
                      <td
                        className={`py-3 px-4 text-right ${
                          transaction.amount < 0
                            ? "text-red-500"
                            : "text-red-500"
                        }`}
                      >
                        ₹{formatNumberWithCommas(Math.abs(transaction.amount))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-3 px-4 text-center text-gray-500"
                    >
                      No data available for this month.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="bg-gray-50 mt-10 p-6 rounded-lg shadow-md text-center">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              Summary
            </h4>
            <p className="text-lg text-gray-700">
              Total Income: <span className="font-bold">₹{formatNumberWithCommas(income)}</span>
            </p>
            <p className="text-lg text-gray-700">
              Total Expenses:{" "}
              <span className="font-bold">₹{formatNumberWithCommas(totalExpenses)}</span>
            </p>
            <p className="text-lg text-gray-700">
              Balance:{" "}
              <span className="font-bold">₹{formatNumberWithCommas(income - totalExpenses)}</span>
            </p>
          </div>

          {/* CSV Download Button */}
        </div>
      </section>
    </div>
  );
};

export default AllTransaction;
