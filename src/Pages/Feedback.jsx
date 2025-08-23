// pages/Feedback.jsx
import { useState } from "react";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
        <MessageSquare className="w-7 h-7" /> Citizen Feedback
      </h1>

      {/* Feedback Form */}
      {!submitted ? (
        <motion.form
          onSubmit={handleSubmit}
          className="rounded-2xl shadow-md p-6 space-y-6 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Category */}
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="space-y-2"
          >
            <label className="block text-sm font-medium">Select Category</label>
            <motion.select
              whileFocus={{ scale: 1.01 }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 transition"
              required
            >
              <option value="">-- Choose --</option>
              <option value="elections">Elections & Governance</option>
              <option value="schemes">Government Schemes</option>
              <option value="transport">Traffic & Vehicle Info</option>
              <option value="others">Others</option>
            </motion.select>
          </motion.div>

          {/* Emoji Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Rate Your Experience</label>
            <div className="flex gap-4 mt-1 justify-between">
              {emojis.map((emoji, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => setRating(index + 1)}
                  whileTap={{ scale: 0.8, rotate: -10 }}
                  animate={
                    rating === index + 1
                      ? { scale: [1, 1.3, 1], rotate: [0, 10, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.4 }}
                  className={`w-14 h-14 rounded-full border flex items-center justify-center text-2xl transition-all shadow-md ${
                    rating === index + 1
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="space-y-2"
          >
            <label className="block text-sm font-medium">Your Feedback</label>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 transition"
              rows="4"
              placeholder="Write your feedback here..."
              required
            />
          </motion.div>

          {/* Progress + Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-xl shadow-md bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Feedback
              </>
            )}
          </motion.button>
        </motion.form>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 rounded-2xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/40 text-center space-y-3 transition-colors"
        >
          <p className="text-2xl animate-bounce">🎉</p>
          <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">Thank you!</p>
          <p>Your feedback has been submitted successfully.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setSubmitted(false)}
            className="mt-2 px-5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Submit Another
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default Feedback;