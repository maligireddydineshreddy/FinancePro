import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane, FaComments, FaExclamationTriangle } from "react-icons/fa";

const ChatBot = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      user: false,
      message: "Hello! I'm FinancePro Assistant. I provide general financial guidance and information. For personalized advice, please consult a certified financial advisor. How can I help you today?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Improved AI response generator with better accuracy
  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    
    // Check for greetings first
    if (/^(hello|hi|hey|good morning|good afternoon|good evening|greetings)/i.test(message)) {
      return "Hello! I'm here to help with general financial information. I can assist with budgeting tips, basic investment concepts, savings strategies, and general financial planning. What would you like to know?";
    }

    // Check for help/questions about capabilities
    if (message.includes("help") || message.includes("what can you") || message.includes("what do you do")) {
      return "I can provide general information about:\n\n• Budgeting and expense management\n• Basic investment concepts\n• Savings strategies\n• Debt management basics\n• Financial planning fundamentals\n• Using FinancePro features\n\nNote: I provide general guidance only. For personalized advice, consult a certified financial advisor.";
    }

    // Budgeting and expenses
    if (message.match(/budget|expense|spending|monthly income|manage money/i)) {
      return "**Budgeting Basics:**\n\n1. **50/30/20 Rule**: Allocate 50% to needs, 30% to wants, 20% to savings\n2. **Track Everything**: Use our Balance page to record all expenses\n3. **Set Goals**: Use Budget Planner to set realistic savings targets\n4. **Review Monthly**: Regularly review and adjust your budget\n\n💡 Tip: Start by tracking expenses for one month to understand your spending patterns.\n\n⚠️ Disclaimer: This is general advice. Your situation may vary.";
    }

    // Savings
    if (message.match(/save|savings|emergency fund|save money/i)) {
      return "**Effective Saving Strategies:**\n\n1. **Emergency Fund First**: Build 3-6 months of expenses in a liquid account\n2. **Automate Savings**: Set up automatic transfers (pay yourself first)\n3. **Start Small**: Even ₹1,000-5,000/month makes a difference\n4. **High-Interest Account**: Keep emergency funds in liquid mutual funds or high-yield savings\n5. **Separate Accounts**: Use different accounts for different goals\n\n📊 Use our Budget Planner to set and track savings goals.\n\n⚠️ Disclaimer: Savings rates and returns vary. Research current rates.";
    }

    // Investment - be careful here, provide general info only
    if (message.match(/invest|investment|mutual fund|sip|equity|portfolio/i)) {
      return "**Basic Investment Concepts:**\n\n1. **Diversification**: Don't put all money in one asset class\n2. **Time Horizon**: Match investments to goals (long-term = equity, short-term = debt)\n3. **SIP Benefits**: Systematic Investment Plans reduce timing risk\n4. **Risk vs Return**: Higher returns usually mean higher risk\n5. **Research First**: Understand what you're investing in\n\n📈 Use our Stock Information and Prediction tools for stock analysis.\n\n⚠️ Important: Investments are subject to market risks. Past performance doesn't guarantee future results. Consult a SEBI-registered advisor before investing.";
    }

    // Stock queries - direct them to tools, don't give advice
    if (message.match(/stock|share|should i buy|should i sell|nifty|sensex|price prediction/i)) {
      return "For stock analysis, I recommend using FinancePro's built-in tools:\n\n📊 **Stock Information**: Get detailed company data, financials, and market metrics\n🔮 **Stock Prediction**: View AI-powered price forecasts with sentiment analysis\n\n⚠️ Important: Stock predictions are for informational purposes only and are not buy/sell recommendations. Always:\n• Do your own research\n• Understand the risks\n• Consult a registered financial advisor\n• Never invest based solely on predictions\n\nStock markets are volatile - only invest what you can afford to lose.";
    }

    // Debt management
    if (message.match(/debt|loan|credit card|emi|pay off|repay/i)) {
      return "**Debt Management Strategies:**\n\n1. **Prioritize High-Interest Debt**: Pay off credit cards and high-interest loans first\n2. **Snowball Method**: Pay smallest debts first for motivation\n3. **Avalanche Method**: Pay highest interest rate debts first (saves more money)\n4. **Make Extra Payments**: Pay more than minimum when possible\n5. **Avoid New Debt**: Stop accumulating while paying off existing debt\n\n📋 Use our Bills page to track and manage your payments.\n\n⚠️ Note: For serious debt issues, consider consulting a credit counselor.";
    }

    // Tax planning
    if (message.match(/tax|income tax|deduction|80c|itr|tax saving/i)) {
      return "**Tax Planning Basics (India):**\n\n1. **Section 80C**: Invest in ELSS, PPF, NSC, tax-saving FDs (₹1.5L limit)\n2. **Health Insurance**: Section 80D benefits\n3. **Home Loan**: Section 24 and 80C benefits\n4. **EPF Contributions**: Tax-free up to limit\n5. **File On Time**: Avoid penalties by filing ITR before July 31\n\n📊 Use our Investment Calculator to see tax-saving impact.\n\n⚠️ Important: Tax laws change. Consult a Chartered Accountant for personalized tax advice.";
    }

    // Financial planning
    if (message.match(/financial plan|retirement|future|goal|planning/i)) {
      return "**Financial Planning Fundamentals:**\n\n1. **Set Clear Goals**: Define short-term (1-3 yrs), medium-term (3-7 yrs), and long-term (7+ yrs) goals\n2. **Emergency Fund**: Build 3-6 months expenses first\n3. **Insurance**: Get term life and health insurance\n4. **Start Early**: Compound interest works best over long periods\n5. **Review Regularly**: Adjust plans as life circumstances change\n\n💼 Use our Investment Calculator to plan for future goals.\n\n⚠️ For comprehensive planning, consult a Certified Financial Planner (CFP).";
    }

    // Risk
    if (message.match(/risk|safe|secure|volatile|volatility/i)) {
      return "**Understanding Investment Risk:**\n\n• **Low Risk**: Bank FDs, Government bonds (lower returns, capital protected)\n• **Medium Risk**: Balanced mutual funds, corporate bonds\n• **High Risk**: Equity stocks, aggressive mutual funds (higher potential returns, capital at risk)\n\nKey Points:\n• Higher returns usually mean higher risk\n• Diversification reduces risk\n• Time horizon matters - long-term reduces equity risk\n• Never invest emergency funds in risky assets\n\n📈 Check risk assessments in our Stock Prediction tool.\n\n⚠️ All investments carry risk. Only invest after understanding your risk tolerance.";
    }

    // Questions about FinancePro features
    if (message.match(/how to use|feature|tool|financepro|this app|what is/i)) {
      return "FinancePro offers several features:\n\n💰 **Balance**: Track income and expenses\n📊 **Charts**: Visualize spending patterns\n📋 **Bills**: Manage bill payments\n💼 **Budget Planner**: Create and track budgets\n🧮 **Investment Calculator**: Plan future investments\n📰 **News**: Latest financial news\n📈 **Stock Info**: Detailed stock analysis\n🔮 **Stock Prediction**: AI-powered price forecasts\n\n💡 Tip: Start with Balance to track expenses, then use Budget Planner to create a plan!";
    }

    // Questions about calculations or numbers
    if (message.match(/calculate|how much|what amount|percentage|rate of return/i)) {
      return "For calculations, use FinancePro's built-in tools:\n\n🧮 **Investment Calculator**: Calculate future value, SIP returns, compound interest\n📊 **Stock Prediction**: See predicted returns and price changes\n\nThese tools handle complex calculations accurately. Would you like to know how to use any specific calculator?";
    }

    // Questions about the AI itself
    if (message.match(/are you ai|who are you|what are you|chatbot|bot/i)) {
      return "I'm FinancePro Assistant, a financial guidance chatbot. I provide general financial information and tips based on common financial principles.\n\n⚠️ Important: I provide general guidance only. I'm not a replacement for:\n• Certified Financial Advisors\n• Tax Consultants\n• Legal Advisors\n• Registered Investment Advisors\n\nFor personalized advice, always consult qualified professionals.";
    }

    // Default response - be helpful
    if (message.length < 3) {
      return "Could you please rephrase your question? I can help with budgeting, investments, savings, debt management, tax planning, and using FinancePro features.";
    }

    // Generic financial advice for unrecognized queries
    return "I understand you're asking about finance. Here's how I can help:\n\n**I can provide general information about:**\n• Budgeting and expense tracking\n• Basic investment concepts\n• Savings strategies\n• Debt management\n• Financial planning basics\n• Using FinancePro features\n\n**Please note:**\n⚠️ I provide general guidance only\n⚠️ Not personalized financial advice\n⚠️ Always consult certified professionals for important decisions\n\nCould you try rephrasing your question? For example:\n• 'How do I create a budget?'\n• 'What is SIP?'\n• 'How to save money?'\n• 'How to use the Investment Calculator?'";
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || loading) return;

    const userMessage = userInput.trim();
    setMessages((prev) => [...prev, { user: true, message: userMessage }]);
    setUserInput("");
    setLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setMessages((prev) => [...prev, { user: false, message: aiResponse }]);
      setLoading(false);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2 ${
          chatOpen ? "hidden" : ""
        }`}
        aria-label="Open Chat"
      >
        <FaComments className="text-xl" />
        <span className="hidden sm:inline font-semibold">Chat with AI</span>
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 animate-fade-in-up">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaRobot className="text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-lg">FinancePro Assistant</h3>
                <p className="text-xs opacity-90">General Financial Guidance</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              aria-label="Close Chat"
            >
              <FaTimes />
            </button>
          </div>

          {/* Disclaimer Banner */}
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-start gap-2">
            <FaExclamationTriangle className="text-yellow-600 text-sm mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-800">
              <strong>Disclaimer:</strong> General guidance only. Not personalized financial advice. Consult professionals for important decisions.
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.user ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    msg.user
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "bg-white text-gray-800 shadow-md border border-gray-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-md border border-gray-200 rounded-2xl p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about finance..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !userInput.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                aria-label="Send Message"
              >
                <FaPaperPlane />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              General guidance • Not financial advice
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
