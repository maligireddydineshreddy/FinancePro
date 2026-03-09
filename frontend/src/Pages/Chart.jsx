import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from "chart.js";
import { Bar, Pie, Line, Radar } from "react-chartjs-2";
import Header from "../components/Header";
import axios from "axios";
import API_CONFIG from "../config/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const expenseCategories = [
    "Rent",
    "Groceries",
    "Water Bill",
    "Electricity Bill",
    "Subscriptions",
    "Others",
  ];

  const [selectedMonths, setSelectedMonths] = useState(1);
  const [userData, setUserData] = useState(null);
  const [expensesData, setExpensesData] = useState({
    rent: 0,
    groceries: 0,
    utilities: 0,
    electricity: 0,
    subscriptions: 0,
    others: 0,
  });
  const [isDataAvailable, setIsDataAvailable] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const getUser = async () => {
    try {
      const { data } = await axios.get(
        `${API_CONFIG.BACKEND_URL}/users/user/${userId}`
      );
      setUserData(data.user);
      processExpensesData(data.user.expenses);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsDataAvailable(false);
    }
  };

  // Process the expenses data from the user response
  const processExpensesData = (expenses) => {
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      console.warn("No valid expenses data found.");
      setIsDataAvailable(false); // If no data is found, set flag to false
      return;
    }

    const expensesByCategory = {
      rent: 0,
      groceries: 0,
      utilities: 0,
      electricity: 0,
      subscriptions: 0,
      others: 0,
    };

    // Filter expenses by the selected month(s)
    const monthFilter = getMonthName();
    
    // Get expenses for the selected time range (up to selectedMonths months back)
    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setMonth(cutoffDate.getMonth() - selectedMonths);
    
    const filteredExpenses = expenses.filter((expense) => {
      if (!expense.date) return false;
      
      // Try to parse the date - handle different formats
      let expenseDate;
      if (typeof expense.date === 'string') {
        // Handle ISO date strings or YYYY-MM-DD format
        expenseDate = new Date(expense.date);
        // If date is invalid, try matching the month/year pattern
        if (isNaN(expenseDate.getTime())) {
          // Check if date string includes the month filter
          return expense.date.includes(monthFilter);
        }
      } else {
        expenseDate = new Date(expense.date);
      }
      
      // Check if date is within the selected range
      return expenseDate >= cutoffDate && expenseDate <= now;
    });

    if (filteredExpenses.length === 0) {
      setIsDataAvailable(false); // If no data for the selected month, set flag to false
      return;
    }

    filteredExpenses.forEach((expense) => {
      const amount = parseFloat(expense.amount); // Convert amount to number
      switch (expense.category) {
        case "Rent":
          expensesByCategory.rent += amount;
          break;
        case "Groceries":
          expensesByCategory.groceries += amount;
          break;
        case "Water Bill":
          expensesByCategory.utilities += amount;
          break;
        case "Electricity Bill":
          expensesByCategory.electricity += amount;
          break;
        case "Subscriptions":
          expensesByCategory.subscriptions += amount;
          break;
        default:
          expensesByCategory.others += amount;
          break;
      }
    });

    setExpensesData(expensesByCategory);
    setIsDataAvailable(true); // Set flag to true if data is processed
  };

  const getMonthName = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    
    switch (selectedMonths) {
      case 1:
        // Current month
        return `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
      case 2:
        // 2 months ago
        const month2 = currentMonth - 1 || 12;
        const year2 = currentMonth - 1 ? currentYear : currentYear - 1;
        return `${year2}-${String(month2).padStart(2, '0')}`;
      case 3:
        // 3 months ago
        const month3 = currentMonth - 2 <= 0 ? currentMonth + 10 : currentMonth - 2;
        const year3 = currentMonth - 2 <= 0 ? currentYear - 1 : currentYear;
        return `${year3}-${String(month3).padStart(2, '0')}`;
      case 6:
        // 6 months ago
        const month6 = currentMonth - 5 <= 0 ? currentMonth + 7 : currentMonth - 5;
        const year6 = currentMonth - 5 <= 0 ? currentYear - 1 : currentYear;
        return `${year6}-${String(month6).padStart(2, '0')}`;
      default:
        return `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    }
  };

  useEffect(() => {
    getUser();
  }, [selectedMonths]);

  // Modern color palette for charts
  const chartColors = [
    "#6366F1", // Indigo - Rent
    "#10B981", // Emerald - Groceries
    "#3B82F6", // Blue - Water Bill
    "#EF4444", // Red - Electricity Bill
    "#F59E0B", // Amber - Subscriptions
    "#8B5CF6", // Purple - Others
  ];

  const pieChartData = {
    labels: expenseCategories,
    datasets: [
      {
        label: "Expenses by Category",
        data: [
          expensesData.rent,
          expensesData.groceries,
          expensesData.utilities,
          expensesData.electricity,
          expensesData.subscriptions,
          expensesData.others,
        ],
        backgroundColor: chartColors,
        borderColor: chartColors.map(color => color + 'DD'),
        borderWidth: 2,
        hoverOffset: 8,
        hoverBorderWidth: 3,
      },
    ],
  };

  const barChartData = {
    labels: expenseCategories,
    datasets: [
      {
        label: "Expenses",
        data: [
          expensesData.rent,
          expensesData.groceries,
          expensesData.utilities,
          expensesData.electricity,
          expensesData.subscriptions,
          expensesData.others,
        ],
        backgroundColor: chartColors,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Calculate weekly totals for line chart
  const calculateWeeklyData = () => {
    if (!userData || !userData.expenses || userData.expenses.length === 0) {
      return [0, 0, 0, 0];
    }
    
    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setMonth(cutoffDate.getMonth() - selectedMonths);
    
    const filteredExpenses = userData.expenses.filter((expense) => {
      if (!expense.date) return false;
      const expenseDate = new Date(expense.date);
      return expenseDate >= cutoffDate && expenseDate <= now;
    });
    
    // Group expenses by week
    const weeklyTotals = [0, 0, 0, 0];
    filteredExpenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      const daysAgo = Math.floor((now - expenseDate) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.min(Math.floor(daysAgo / 7), 3);
      weeklyTotals[weekIndex] += parseFloat(expense.amount) || 0;
    });
    
    return weeklyTotals;
  };

  const lineChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weekly Expense Trend",
        data: calculateWeeklyData(),
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "#6366F1",
        borderWidth: 3,
        pointBackgroundColor: "#6366F1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
      },
    ],
  };

  const radarChartData = {
    labels: expenseCategories,
    datasets: [
      {
        label: "Expense Categories Radar",
        data: [
          expensesData.rent,
          expensesData.groceries,
          expensesData.utilities,
          expensesData.electricity,
          expensesData.subscriptions,
          expensesData.others,
        ],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "#6366F1",
        borderWidth: 3,
        pointBackgroundColor: "#6366F1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <>
      <Header />
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen py-12">
        <div className="container mx-auto px-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
            Your <span className="text-gradient">Expense Analytics</span>
          </h2>
          <p className="text-center text-gray-600 mb-10">Visualize your spending patterns</p>

          <div className="container mx-auto px-4 mb-8 max-w-2xl animate-fade-in-up">
            <label
              htmlFor="timeRange"
              className="block text-lg font-semibold text-gray-700 mb-3"
            >
              Select Time Range:
            </label>
            <select
              id="timeRange"
              value={selectedMonths}
              onChange={(e) => setSelectedMonths(Number(e.target.value))}
              className="input-modern w-full md:w-auto"
            >
              <option value={1}>Past 1 Month</option>
              <option value={2}>Past 2 Months</option>
              <option value={3}>Past 3 Months</option>
              <option value={6}>Past 6 Months</option>
            </select>
          </div>

          <div className="container mx-auto px-4">
            {isDataAvailable ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: "Expense Distribution by Category", chart: <Pie data={pieChartData} width={400} height={400} />, delay: 0 },
                  { title: "Expenses Bar Chart", chart: <Bar data={barChartData} width={400} height={400} />, delay: 100 },
                  { title: "Monthly Expense Trend", chart: <Line data={lineChartData} width={400} height={400} />, delay: 200 },
                  { title: "Expense Categories Radar Chart", chart: <Radar data={radarChartData} width={400} height={400} />, delay: 300 },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="card-modern card-hover animate-fade-in-up"
                    style={{ animationDelay: `${item.delay}ms` }}
                  >
                    <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
                      {item.title}
                    </h3>
                    <div className="mx-auto w-full max-w-[400px] h-[400px] flex items-center justify-center">
                      {item.chart}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-modern text-center py-16 animate-fade-in-up">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-xl text-gray-600 mb-2">
                  No data available
                </p>
                <p className="text-gray-500">
                  Data not available for the selected time range.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chart;
