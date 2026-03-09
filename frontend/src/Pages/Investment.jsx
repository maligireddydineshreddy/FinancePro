import React, { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import Header from "../components/Header";
import { formatNumberWithCommas, removeCommas } from "../utils/formatNumber";
import { FaRupeeSign, FaPercent, FaCalendarAlt, FaMoneyBillWave, FaChartLine, FaChartBar } from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Investment = () => {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [annualReturn, setAnnualReturn] = useState(""); // in %
  const [years, setYears] = useState("");
  const [annualContribution, setAnnualContribution] = useState("");

  const calculateGrowth = () => {
    const growthData = [];
    const cleanInitial = typeof initialInvestment === 'string' ? parseFloat(removeCommas(initialInvestment)) || 0 : initialInvestment;
    const cleanAnnualReturn = typeof annualReturn === 'string' ? parseFloat(removeCommas(annualReturn)) || 0 : annualReturn;
    const cleanAnnualContribution = typeof annualContribution === 'string' ? parseFloat(removeCommas(annualContribution)) || 0 : annualContribution;
    const cleanYears = typeof years === 'string' ? parseInt(removeCommas(years)) || 0 : years;
    
    let total = cleanInitial;

    for (let i = 1; i <= cleanYears; i++) {
      total += total * (cleanAnnualReturn / 100) + cleanAnnualContribution;
      growthData.push(total.toFixed(2)); // Push yearly total
    }

    return growthData;
  };

  const cleanYears = years ? parseInt(removeCommas(years)) || 0 : 0;
  const cleanInitial = initialInvestment ? parseFloat(removeCommas(initialInvestment)) || 0 : 0;
  const cleanAnnualContribution = annualContribution ? parseFloat(removeCommas(annualContribution)) || 0 : 0;
  
  const growthData = calculateGrowth();
  const finalValue = growthData.length > 0 ? parseFloat(growthData[growthData.length - 1]) : 0;
  const totalContributions = cleanInitial + (cleanAnnualContribution * cleanYears);
  const totalReturns = finalValue - totalContributions;

  // Modern color scheme for charts
  const lineData = {
    labels: Array.from({ length: cleanYears }, (_, i) => `Year ${i + 1}`),
    datasets: [
      {
        label: "Investment Growth",
        data: calculateGrowth(),
        borderColor: "#6366F1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#6366F1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: ["Initial Investment", "Contributions", "Returns"],
    datasets: [
      {
        data: [
          cleanInitial,
          cleanAnnualContribution * cleanYears,
          totalReturns > 0 ? totalReturns : 0,
        ],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",    // Indigo - Initial
          "rgba(59, 130, 246, 0.8)",    // Blue - Contributions
          "rgba(16, 185, 129, 0.8)",    // Emerald - Returns
        ],
        borderColor: [
          "#6366F1",
          "#3B82F6",
          "#10B981",
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          {/* Header Section */}
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
              <FaChartLine className="text-white text-4xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Investment <span className="text-gradient">Calculator</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Calculate your investment growth over time and visualize your portfolio breakdown
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Input Section */}
            <div className="card-modern mb-8 animate-fade-in-up animation-delay-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaMoneyBillWave className="mr-3 text-indigo-600" />
                Investment Parameters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    label: "Initial Investment",
                    value: initialInvestment,
                    setValue: setInitialInvestment,
                    icon: <FaRupeeSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />,
                    placeholder: "0",
                  },
                  {
                    label: "Annual Return Rate (%)",
                    value: annualReturn,
                    setValue: setAnnualReturn,
                    icon: <FaPercent className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />,
                    placeholder: "0",
                  },
                  {
                    label: "Investment Duration (Years)",
                    value: years,
                    setValue: setYears,
                    icon: <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />,
                    placeholder: "0",
                  },
                  {
                    label: "Annual Contribution",
                    value: annualContribution,
                    setValue: setAnnualContribution,
                    icon: <FaMoneyBillWave className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />,
                    placeholder: "0",
                  },
                ].map((input, index) => (
                  <div key={index} className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      {input.label}
                    </label>
                    <div className="relative">
                      {input.icon}
                      <input
                        type="text"
                        value={input.value ? formatNumberWithCommas(input.value) : ""}
                        onChange={(e) => {
                          const rawValue = removeCommas(e.target.value);
                          if (input.label.includes("Years")) {
                            if (rawValue === '' || /^\d*$/.test(rawValue)) {
                              input.setValue(rawValue);
                            }
                          } else {
                            if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
                              input.setValue(rawValue);
                            }
                          }
                        }}
                        placeholder={input.placeholder}
                        className={`input-modern w-full ${input.label.includes("Annual Return Rate") ? 'pr-12' : 'pl-12'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Summary Cards */}
            {cleanYears > 0 && cleanInitial > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up animation-delay-300">
                {[
                  {
                    title: "Final Value",
                    value: finalValue,
                    color: "from-emerald-500 to-teal-500",
                    icon: "💰",
                  },
                  {
                    title: "Total Invested",
                    value: totalContributions,
                    color: "from-blue-500 to-cyan-500",
                    icon: "💵",
                  },
                  {
                    title: "Total Returns",
                    value: totalReturns,
                    color: "from-purple-500 to-pink-500",
                    icon: "📈",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`card-modern card-hover bg-gradient-to-br ${stat.color} text-white border-0 animate-fade-in-up`}
                    style={{ animationDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <h3 className="text-lg font-semibold mb-2 opacity-90">{stat.title}</h3>
                    <p className="text-3xl md:text-4xl font-bold">
                      ₹{formatNumberWithCommas(stat.value.toFixed(2))}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Charts Section */}
            {cleanYears > 0 && cleanInitial > 0 && (
              <>
                <div className="card-modern mb-8 animate-fade-in-up animation-delay-400">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaChartLine className="mr-3 text-indigo-600" />
                    Investment Growth Over Time
                  </h2>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <Line data={lineData} options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                        },
                        tooltip: {
                          mode: 'index',
                          intersect: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '₹' + formatNumberWithCommas(value.toFixed(0));
                            },
                          },
                        },
                      },
                    }} />
                  </div>
                </div>

                <div className="card-modern animate-fade-in-up animation-delay-500">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaChartBar className="mr-3 text-indigo-600" />
                    Portfolio Breakdown
                  </h2>
                  <div className="flex justify-center">
                    <div className="w-full max-w-[500px] h-[400px]">
                      <Pie data={pieData} options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return label + ': ₹' + formatNumberWithCommas(value.toFixed(2));
                              },
                            },
                          },
                        },
                      }} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Empty State */}
            {(!cleanYears || !cleanInitial || cleanInitial === 0) && (
              <div className="card-modern text-center py-16 animate-fade-in-up animation-delay-300">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-xl text-gray-600 mb-2 font-semibold">
                  Enter Investment Details
                </p>
                <p className="text-gray-500">
                  Fill in the investment parameters above to see your growth projections
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Investment;
