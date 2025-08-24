import { useState } from "react";
import { Send, MessageSquare, Loader2, Star, Sparkles } from "lucide-react";

const Feedback = () => {
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setCategory("");
      setRating(0);
      setFeedback("");
    }, 1200);
  };

  // Different emojis for rating
  const emojis = ["😡", "😞", "😐", "🙂", "🤩"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-green-950/50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/80 to-emerald-500 rounded-full blur-lg opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-full shadow-lg shadow-green-500/20">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-green-800 bg-clip-text text-transparent">
            Share Your Voice
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Your feedback shapes better governance. Help us serve you better.
          </p>
        </div>

        {/* Main Content */}
        {!submitted ? (
          <div className="relative">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-xl shadow-green-500/5 border border-green-100/50 dark:border-slate-700/50"></div>
            
            <div className="relative p-8 space-y-8">
              {/* Category Selection */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200">
                  What's this about?
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-2 border-green-200/50 dark:border-slate-600/50 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/10 transition-all duration-300 appearance-none cursor-pointer hover:bg-white/90 dark:hover:bg-slate-700/90"
                    required
                  >
                    <option value="">Select a category...</option>
                    <option value="elections">🗳️ Elections & Governance</option>
                    <option value="schemes">🎯 Government Schemes</option>
                    <option value="transport">🚗 Traffic & Vehicle Info</option>
                    <option value="others">💬 Others</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200">
                  How was your experience?
                </label>
                <div className="flex gap-3 justify-center p-6 bg-gradient-to-r from-green-50/30 to-emerald-50/40 dark:from-slate-800/30 dark:to-green-900/20 rounded-2xl border border-green-100/50 dark:border-slate-700/30">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setRating(index + 1)}
                      className={`group relative w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
                        rating === index + 1
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 border-green-300 shadow-lg shadow-green-400/20 scale-110 -translate-y-1"
                          : "bg-white/60 dark:bg-slate-700/60 border-green-100/50 dark:border-slate-600/50 hover:bg-white/80 dark:hover:bg-slate-700/80 hover:shadow-md"
                      }`}
                    >
                      <span className={`transition-all duration-300 ${rating === index + 1 ? 'animate-bounce' : ''}`}>
                        {emoji}
                      </span>
                      {rating === index + 1 && (
                        <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl opacity-20 blur-sm animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100/70 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-sm font-medium">
                      <Star className="w-4 h-4 fill-current" />
                      {rating} out of 5
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback Input */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Tell us more
                </label>
                <div className="relative">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-2 border-green-200/50 dark:border-slate-600/50 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/10 transition-all duration-300 resize-none hover:bg-white/90 dark:hover:bg-slate-700/90"
                    rows="5"
                    placeholder="Share your thoughts, suggestions, or concerns..."
                    required
                  />
                  <div className="absolute bottom-4 right-4 text-slate-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !category || !rating || !feedback}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-5 px-8 rounded-2xl shadow-xl shadow-green-500/20 hover:shadow-2xl hover:shadow-green-500/30 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center gap-3 text-lg">
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Submitting your feedback...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Success State */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 via-white to-emerald-50/40 dark:from-green-900/10 dark:via-slate-800/60 dark:to-emerald-900/10 backdrop-blur-xl rounded-3xl shadow-xl shadow-green-500/5 border border-green-200/30 dark:border-green-700/30"></div>
            
            <div className="relative p-8 text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative text-6xl animate-bounce">🎉</div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Thank You!
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Your voice has been heard loud and clear
                </p>
                <p className="text-slate-500 dark:text-slate-500 max-w-sm mx-auto">
                  We appreciate you taking the time to share your feedback. It helps us build better services for everyone.
                </p>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="group relative overflow-hidden bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-2 border-green-200/50 dark:border-green-700/40 hover:border-green-300 dark:hover:border-green-600 text-green-700 dark:text-green-300 font-semibold py-3 px-8 rounded-2xl shadow-lg shadow-green-500/5 hover:shadow-xl hover:shadow-green-500/10 transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-50/0 via-green-50/30 to-green-50/0 dark:from-green-900/0 dark:via-green-900/20 dark:to-green-900/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative">Share More Feedback</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;