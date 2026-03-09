import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Header from "../components/Header";
import API_CONFIG from "../config/api";
import { formatNumberWithCommas, formatNumberToWords } from "../utils/formatNumber";
import {
  FaChartLine,
  FaInfoCircle,
  FaDollarSign,
  FaBalanceScale,
  FaCashRegister,
  FaClipboardList,
  FaBullseye,
  FaArrowUp,
  FaArrowDown,
  FaStar,
  FaSearch,
  FaExclamationTriangle,
  FaRedoAlt,
} from "react-icons/fa";

const StockInfo = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockOptions, setStockOptions] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [stocksLoading, setStocksLoading] = useState(true);
  const [stocksError, setStocksError] = useState(null);
  const [stockInfoError, setStockInfoError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [favorites, setFavorites] = useState([]);

  const handleStockSelect = async (selectedOption) => {
    setSelectedStock(selectedOption);
    setStockInfo(null);
    setStockInfoError(null);

    // Retry logic with exponential backoff
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(`${API_CONFIG.ML_API_URL}/get_stock_info`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stock: selectedOption.value,
            stock_exchange: "NSE",
          }),
          signal: AbortSignal.timeout(60000)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setStockInfo(data);
        setStockInfoError(null);
        return;
      } catch (error) {
        console.error(`Error fetching stock info (attempt ${attempt}):`, error);
        if (attempt < 3) {
          await new Promise(r => setTimeout(r, attempt * 2000));
        } else {
          setStockInfoError(
            error.name === 'TimeoutError' || error.message?.includes('timeout')
              ? 'The ML service is taking too long to respond. It may be starting up — please try again in 30 seconds.'
              : 'Failed to load stock information. Please try again.'
          );
        }
      }
    }
  };

  const getAllStocks = async () => {
    setStocksLoading(true);
    setStocksError(null);

    // Retry with exponential backoff (ML API may be waking up)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Fetching stocks (attempt ${attempt})...`);
        const response = await fetch(`${API_CONFIG.ML_API_URL}/get_stocks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
          signal: AbortSignal.timeout(60000)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data && data.stocks && Array.isArray(data.stocks)) {
          const formattedStocks = data.stocks.map((stock) => ({
            value: stock,
            label: stock,
          }));
          setStockOptions(formattedStocks);
          setStocksError(null);
          setStocksLoading(false);
          return;
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error(`Error fetching stocks (attempt ${attempt}):`, error.message);
        if (attempt < 3) {
          // Wait before retrying (2s, 4s)
          await new Promise(r => setTimeout(r, attempt * 2000));
        }
      }
    }

    // All retries failed
    setStockOptions([]);
    setStocksError(
      'Unable to connect to the stock data service. The service may be starting up (this can take up to 60 seconds on the first visit).'
    );
    setStocksLoading(false);
  };

  const toggleFavorite = (stockName) => {
    setFavorites((prev) =>
      prev.includes(stockName)
        ? prev.filter((s) => s !== stockName)
        : [...prev, stockName]
    );
  };

  useEffect(() => {
    getAllStocks();
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: FaChartLine },
    { id: "market", label: "Market Data", icon: FaInfoCircle },
    { id: "financials", label: "Financials", icon: FaCashRegister },
    { id: "valuation", label: "Valuation", icon: FaBalanceScale },
    { id: "dividends", label: "Dividends", icon: FaDollarSign },
    { id: "analyst", label: "Analyst", icon: FaBullseye },
  ];

  const renderOverview = () => {
    if (!stockInfo) return null;

    const basicInfo = stockInfo["Basic Information"] || {};
    const marketData = stockInfo["Market Data"] || {};

    return (
      <div className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData["currentPrice"] && (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-sm opacity-90 mb-2">Current Price</div>
              <div className="text-3xl font-bold mb-1">₹{formatNumberWithCommas(parseFloat(marketData["currentPrice"]).toFixed(2))}</div>
              <div className="text-sm opacity-75">{basicInfo["symbol"] || ""}</div>
            </div>
          )}
          {marketData["fiftyTwoWeekHigh"] && (
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-sm opacity-90 mb-2">52 Week High</div>
              <div className="text-3xl font-bold mb-1">₹{formatNumberWithCommas(parseFloat(marketData["fiftyTwoWeekHigh"]).toFixed(2))}</div>
              <div className="text-sm opacity-75">All Time High</div>
            </div>
          )}
          {marketData["fiftyTwoWeekLow"] && (
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-sm opacity-90 mb-2">52 Week Low</div>
              <div className="text-3xl font-bold mb-1">₹{formatNumberWithCommas(parseFloat(marketData["fiftyTwoWeekLow"]).toFixed(2))}</div>
              <div className="text-sm opacity-75">All Time Low</div>
            </div>
          )}
          {marketData["fiftyDayAverage"] && (
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-sm opacity-90 mb-2">50-Day Average</div>
              <div className="text-3xl font-bold mb-1">₹{formatNumberWithCommas(parseFloat(marketData["fiftyDayAverage"]).toFixed(2))}</div>
              <div className="text-sm opacity-75">Moving Average</div>
            </div>
          )}
        </div>

        {/* Basic Information Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaInfoCircle className="text-blue-500" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(basicInfo).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <span className="text-sm font-medium text-gray-600">{key}</span>
                <span className="text-base font-bold text-gray-800">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMarketData = () => {
    if (!stockInfo || !stockInfo["Market Data"]) return null;

    const marketData = stockInfo["Market Data"];

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaChartLine className="text-green-500" />
          Market Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(marketData).map(([key, value]) => {
            const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
            const isPrice = key.toLowerCase().includes('price') || key.toLowerCase().includes('open') ||
              key.toLowerCase().includes('close') || key.toLowerCase().includes('high') ||
              key.toLowerCase().includes('low') || key.toLowerCase().includes('average');

            return (
              <div key={key} className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <div className="text-sm font-medium text-gray-600 mb-2">{key}</div>
                <div className="text-2xl font-bold text-gray-800">
                  {isPrice ? `₹${formatNumberWithCommas(numValue.toFixed(2))}` : formatNumberWithCommas(numValue)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFinancials = () => {
    if (!stockInfo) return null;

    const financials = stockInfo["Financial Performance"] || {};
    const volume = stockInfo["Volume and Shares"] || {};

    return (
      <div className="space-y-6">
        {/* Financial Performance */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaCashRegister className="text-teal-500" />
            Financial Performance
          </h3>
          <div className="space-y-4">
            {Object.entries(financials).map(([key, value]) => {
              const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
              // Use words format for very large numbers (>= 100000)
              const displayValue = numValue >= 100000
                ? formatNumberToWords(numValue)
                : `₹${formatNumberWithCommas(numValue.toFixed(2))}`;
              return (
                <div key={key} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 px-4 rounded-lg transition-colors">
                  <span className="text-base font-medium text-gray-700">{key}</span>
                  <span className="text-xl font-bold text-gray-800">{displayValue}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Volume and Shares */}
        {Object.keys(volume).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaClipboardList className="text-yellow-500" />
              Volume and Shares
            </h3>
            <div className="space-y-4">
              {Object.entries(volume).map(([key, value]) => {
                const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
                return (
                  <div key={key} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 px-4 rounded-lg transition-colors">
                    <span className="text-base font-medium text-gray-700">{key}</span>
                    <span className="text-xl font-bold text-gray-800">{formatNumberWithCommas(numValue)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderValuation = () => {
    if (!stockInfo || !stockInfo["Valuation and Ratios"]) return null;

    const valuation = stockInfo["Valuation and Ratios"];

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaBalanceScale className="text-red-500" />
          Valuation and Ratios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(valuation).map(([key, value]) => {
            const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
            let displayValue = "";
            if (key === "marketCap" || key === "enterpriseValue") {
              displayValue = `${formatNumberWithCommas((numValue / 10000000).toFixed(2))} crores`;
            } else {
              displayValue = formatNumberWithCommas(numValue.toFixed(2));
            }
            return (
              <div key={key} className="bg-gradient-to-br from-red-50 to-white p-5 rounded-xl border border-red-200 hover:border-red-300 hover:shadow-md transition-all">
                <div className="text-sm font-medium text-gray-600 mb-2">{key}</div>
                <div className="text-2xl font-bold text-gray-800">{displayValue}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDividends = () => {
    if (!stockInfo || !stockInfo["Dividends and Yield"]) return null;

    const dividends = stockInfo["Dividends and Yield"];

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaDollarSign className="text-purple-500" />
          Dividends and Yield
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(dividends).map(([key, value]) => {
            const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
            return (
              <div key={key} className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all">
                <div className="text-sm font-medium text-gray-600 mb-2">{key}</div>
                <div className="text-2xl font-bold text-purple-700">
                  {typeof value === 'number' ? `₹${formatNumberWithCommas(numValue.toFixed(2))}` : value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAnalyst = () => {
    if (!stockInfo || !stockInfo["Analyst Targets"]) return null;

    const targets = stockInfo["Analyst Targets"];

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaBullseye className="text-indigo-500" />
          Analyst Targets
        </h3>
        <div className="space-y-4">
          {Object.entries(targets).map(([key, value]) => {
            const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
            return (
              <div key={key} className="flex justify-between items-center py-4 bg-gradient-to-r from-indigo-50 to-white px-6 rounded-xl border border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <span className="text-base font-semibold text-gray-700">{key}</span>
                <span className="text-2xl font-bold text-indigo-700">₹{formatNumberWithCommas(numValue.toFixed(2))}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "market":
        return renderMarketData();
      case "financials":
        return renderFinancials();
      case "valuation":
        return renderValuation();
      case "dividends":
        return renderDividends();
      case "analyst":
        return renderAnalyst();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Stock
                </label>
                <Select
                  options={stockOptions}
                  onChange={handleStockSelect}
                  value={selectedStock}
                  isSearchable
                  isLoading={stocksLoading}
                  placeholder={stocksLoading ? "Loading stocks..." : "Type to search stocks..."}
                  noOptionsMessage={() => stocksLoading ? "Loading..." : "No stocks found"}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: '12px',
                      border: state.isFocused ? '2px solid #6366f1' : '2px solid #e5e7eb',
                      padding: '4px',
                      boxShadow: state.isFocused ? '0 0 0 3px rgba(99, 102, 241, 0.1)' : 'none',
                      '&:hover': {
                        border: '2px solid #6366f1',
                      },
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#6366f1' : state.isFocused ? '#eef2ff' : 'white',
                      color: state.isSelected ? 'white' : '#374151',
                      '&:active': {
                        backgroundColor: '#6366f1',
                      },
                    }),
                  }}
                />
              </div>
              {selectedStock && (
                <button
                  onClick={() => toggleFavorite(selectedStock.value)}
                  className={`p-4 rounded-xl transition-all transform hover:scale-110 ${favorites.includes(selectedStock.value)
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-lg'
                    : 'bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-500'
                    }`}
                >
                  <FaStar className="text-2xl" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        {selectedStock && stockInfo && (
          <div className="mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <Icon />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content */}
        {stockInfo && (
          <div className="animate-fade-in-up">
            {renderTabContent()}
          </div>
        )}

        {/* Stock Info Error State */}
        {stockInfoError && selectedStock && (
          <div className="bg-white rounded-2xl shadow-lg text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <FaExclamationTriangle className="text-4xl text-red-500" />
            </div>
            <p className="text-lg text-gray-800 font-semibold mb-2">Could not load stock info</p>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">{stockInfoError}</p>
            <button
              onClick={() => handleStockSelect(selectedStock)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-semibold"
            >
              <FaRedoAlt /> Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {!stockInfo && !stockInfoError && selectedStock && (
          <div className="bg-white rounded-2xl shadow-lg text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mb-6"></div>
            <p className="text-lg text-gray-600 font-medium">Loading stock information...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest data</p>
            <p className="text-xs text-gray-400 mt-4">If this is your first visit, the service may take up to 60 seconds to start</p>
          </div>
        )}

        {/* Stocks List Error State */}
        {stocksError && !selectedStock && (
          <div className="bg-white rounded-2xl shadow-lg text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
              <FaExclamationTriangle className="text-4xl text-yellow-500" />
            </div>
            <p className="text-lg text-gray-800 font-semibold mb-2">Service Unavailable</p>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">{stocksError}</p>
            <button
              onClick={() => getAllStocks()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-semibold"
            >
              <FaRedoAlt /> Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!selectedStock && !stocksError && (
          <div className="bg-white rounded-2xl shadow-lg text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl mb-6">
              <FaChartLine className="text-5xl text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Stock Selected</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Search and select a stock above to view comprehensive information, market data, and analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockInfo;
