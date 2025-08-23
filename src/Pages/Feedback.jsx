// pages/Feedback.jsx
import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";

export default function Feedback() {
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 👉 Here you can send data to backend / API
    console.log({
      category,
      rating,
      feedback,
    });

    setSubmitted(true);
    setCategory("");
    setRating(0);
    setFeedback("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2 text-indigo-600">
        <MessageSquare className="w-7 h-7" /> Citizen Feedback
      </h1>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-6 space-y-5 border"
        >
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Select Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Choose --</option>
              <option value="elections">Elections & Governance</option>
              <option value="schemes">Government Schemes</option>
              <option value="transport">Traffic & Vehicle Info</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Rate Your Experience
            </label>
            <div className="flex gap-2 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center text-lg font-bold transition ${
                    rating >= star
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-slate-600"
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Your Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
              placeholder="Write your feedback here..."
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-2 px-4 rounded-xl shadow hover:bg-indigo-700 transition"
          >
            <Send className="w-4 h-4" /> Submit Feedback
          </button>
        </form>
      ) : (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl border">
          ✅ Thank you! Your feedback has been submitted.
        </div>
      )}
    </div>
  );
}
