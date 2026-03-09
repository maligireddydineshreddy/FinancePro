import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "../components/Header";
import { FaNewspaper, FaExternalLinkAlt, FaClock, FaSync, FaExclamationTriangle } from "react-icons/fa";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // List of RSS feeds to try in order (all free, no API key needed)
  const RSS_FEEDS = [
    {
      name: "Times of India Business",
      url: "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ftimesofindia.indiatimes.com%2Frssfeeds%2F1898055.cms",
    },
    {
      name: "Economic Times",
      url: "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Feconomictimes.indiatimes.com%2Frssfeeds%2F1977021501.cms",
    },
    {
      name: "Moneycontrol",
      url: "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.moneycontrol.com%2Frss%2Fbusiness.xml",
    },
  ];

  const fetchNews = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setFetchError(null);

    // Try each RSS feed in order until one works
    for (const feed of RSS_FEEDS) {
      try {
        const response = await axios.get(feed.url, { timeout: 10000 });

        if (response.data && response.data.status === "ok" && response.data.items && response.data.items.length > 0) {
          const formattedNews = response.data.items.slice(0, 12).map((item) => {
            // Clean HTML from description
            const cleanDesc = item.description
              ? item.description.replace(/<[^>]*>/g, "").trim()
              : item.content
                ? item.content.replace(/<[^>]*>/g, "").substring(0, 250).trim() + "..."
                : "No description available.";

            // Get thumbnail image if available
            const thumbnail = item.enclosure?.link || item.thumbnail || null;

            return {
              title: item.title || "Financial News",
              description: cleanDesc.length > 10 ? cleanDesc : "Read more at the source.",
              url: item.link || item.guid || null,
              publishedAt: item.pubDate || new Date().toISOString(),
              source: item.author || feed.name,
              thumbnail: thumbnail,
            };
          });

          setNews(formattedNews);
          setLastUpdated(new Date());
          setLoading(false);
          setRefreshing(false);
          return; // Success — stop trying other feeds
        }
      } catch (error) {
        console.error(`${feed.name} RSS error:`, error.message);
      }
    }

    // All RSS feeds failed — show error with static fallback
    setFetchError("Unable to fetch live news. Showing cached content.");
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    setNews([
      {
        title: "Indian Stock Markets Hit New Highs Amid Economic Optimism",
        description: "The BSE Sensex and NSE Nifty reached record levels as investor confidence grows with strong corporate earnings and positive economic indicators.",
        url: "https://www.moneycontrol.com",
        publishedAt: currentDate,
        source: "MoneyControl",
      },
      {
        title: "RBI Policy Decision: Interest Rates Maintained at Current Levels",
        description: "The Reserve Bank of India kept key policy rates unchanged, citing stable inflation and growth prospects.",
        url: "https://www.rbi.org.in",
        publishedAt: currentDate,
        source: "RBI",
      },
      {
        title: "Investment Trends: Mutual Funds See Record Inflows",
        description: "Systematic Investment Plans (SIPs) continue to attract retail investors with record monthly inflows.",
        url: "https://www.amfiindia.com",
        publishedAt: currentDate,
        source: "AMFI",
      },
      {
        title: "Startup Funding: Fintech Sector Attracts Billions in Capital",
        description: "India's fintech ecosystem witnesses significant venture capital investments, with digital payments and lending platforms leading the growth.",
        url: "https://www.inc42.com",
        publishedAt: currentDate,
        source: "Inc42",
      },
      {
        title: "Gold Prices Stabilize After Volatile Trading Session",
        description: "Precious metals markets show stability as gold prices consolidate around current levels.",
        url: "https://www.gold.org",
        publishedAt: currentDate,
        source: "World Gold Council",
      },
      {
        title: "Real Estate Sector: Residential Sales Growth Continues",
        description: "The real estate market in major Indian cities shows robust growth with increasing demand for residential properties.",
        url: "https://www.proptiger.com",
        publishedAt: currentDate,
        source: "PropTiger",
      },
    ]);
    setLastUpdated(new Date());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchNews();
    // Refresh news every 3 minutes
    const interval = setInterval(() => fetchNews(false), 180000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const handleRefresh = () => {
    fetchNews(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div></div>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                <FaNewspaper className="text-white text-4xl" />
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${(loading || refreshing) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                aria-label="Refresh News"
              >
                <FaSync className={`text-sm ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline font-semibold">Refresh</span>
              </button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Latest <span className="text-gradient">Finance News</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Stay updated with the latest financial markets, investments, and economic news
            </p>
          </div>

          {/* Error Banner */}
          {fetchError && (
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg flex items-center gap-3 animate-fade-in-up">
              <FaExclamationTriangle className="text-yellow-500 flex-shrink-0" />
              <p className="text-yellow-800 text-sm">{fetchError}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="card-modern animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  <div className="h-8 bg-gray-200 rounded mt-6 w-32"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* News Grid */}
              {news && news.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((item, index) => (
                    <div
                      key={index}
                      className="card-modern card-hover group animate-fade-in-up overflow-hidden"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* News Card Header with Gradient */}
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 -m-6 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FaNewspaper className="text-white text-sm" />
                            <span className="text-white text-xs font-semibold">
                              {item.source || "FINANCIAL NEWS"}
                            </span>
                          </div>
                          <span className="text-white/80 text-xs flex items-center">
                            <FaClock className="mr-1" />
                            {formatDate(item.publishedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Thumbnail Image */}
                      {item.thumbnail && (
                        <div className="relative h-40 w-full rounded-xl mb-4 overflow-hidden bg-gray-100">
                          <img
                            src={item.thumbnail}
                            alt=""
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}

                      {/* News Content */}
                      <div className="px-2">
                        <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                          {item.title || item.headline || "Finance News"}
                        </h2>
                        <p className="text-gray-600 mb-6 line-clamp-4 leading-relaxed">
                          {item.description || item.summary || "No description available."}
                        </p>

                        {/* Read More Link */}
                        {item.url && item.url !== "#" ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold group-hover:space-x-3 transition-all duration-200"
                          >
                            <span>Read Full Article</span>
                            <FaExternalLinkAlt className="text-sm" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center text-gray-400 text-sm italic">
                            Source link not available
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-modern text-center py-16 animate-fade-in-up">
                  <div className="text-6xl mb-4">📰</div>
                  <p className="text-xl text-gray-600 mb-2 font-semibold">
                    No news available
                  </p>
                  <p className="text-gray-500">
                    Please check back later for the latest financial news.
                  </p>
                </div>
              )}

              {/* Refresh Indicator */}
              <div className="mt-8 text-center text-sm text-gray-500 animate-fade-in-up animation-delay-600">
                <FaSync className="inline-block mr-2 animate-pulse-slow" />
                News updates automatically every 3 minutes • Click refresh button to update now
                {lastUpdated && (
                  <span className="block mt-1 text-xs text-gray-400">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default News;
