// pages/Feedback.jsx
import { useState } from "react";
import { Send, MessageSquare, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Feedback = () => {
  const [formData, setFormData] = useState({
    category: "",
    rating: 0,
    feedback: "",
    name: "",
    email: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  // Different emojis for rating
  const emojis = ["😡", "😞", "😐", "🙂", "🤩"];

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.category.trim()) {
      newErrors.category = "Please select a category";
    }

    if (formData.rating === 0) {
      newErrors.rating = "Please rate your experience";
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = "Please provide your feedback";
    } else if (formData.feedback.trim().length < 10) {
      newErrors.feedback = "Feedback must be at least 10 characters long";
    } else if (formData.feedback.trim().length > 500) {
      newErrors.feedback = "Feedback must be less than 500 characters";
    }

    // Optional fields with validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({
        category: "",
        rating: 0,
        feedback: "",
        name: "",
        email: "",
        phone: ""
      });
      setErrors({});
      setTouched({});
    }, 1200);
  };

  const isFieldValid = (field) => {
    return touched[field] && !errors[field] && formData[field];
  };

  const isFieldInvalid = (field) => {
    return touched[field] && errors[field];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
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
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Personal Information (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium">
                  Full Name
                  <span className="text-slate-400 ml-1">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 transition ${
                      isFieldValid('name') ? 'border-green-500' : ''
                    } ${isFieldInvalid('name') ? 'border-red-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {isFieldValid('name') && (
                    <CheckCircle className="absolute right-3 top-2.5 w-5 h-5 text-green-500" />
                  )}
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                whileFocus={{ scale: 1.02 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium">
                  Email Address
                  <span className="text-slate-400 ml-1">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 transition ${
                      isFieldValid('email') ? 'border-green-500' : ''
                    } ${isFieldInvalid('email') ? 'border-red-500' : ''}`}
                    placeholder="Enter your email address"
                  />
                  {isFieldValid('email') && (
                    <CheckCircle className="absolute right-3 top-2.5 w-5 h-5 text-green-500" />
                  )}
                  {isFieldInvalid('email') && (
                    <AlertCircle className="absolute right-3 top-2.5 w-5 h-5 text-red-500" />
                  )}
                </div>
                {isFieldInvalid('email') && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Phone */}
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium">
                Phone Number
                <span className="text-slate-400 ml-1">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 transition ${
                    isFieldValid('phone') ? 'border-green-500' : ''
                  } ${isFieldInvalid('phone') ? 'border-red-500' : ''}`}
                  placeholder="Enter your phone number"
                />
                {isFieldValid('phone') && (
                  <CheckCircle className="absolute right-3 top-2.5 w-5 h-5 text-green-500" />
                )}
                {isFieldInvalid('phone') && (
                  <AlertCircle className="absolute right-3 top-2.5 w-5 h-5 text-red-500" />
                )}
              </div>
              {isFieldInvalid('phone') && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </motion.div>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* Feedback Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Feedback Details</h3>
            
            {/* Category */}
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium">
                Select Category
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <motion.select
                  whileFocus={{ scale: 1.01 }}
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  onBlur={() => handleBlur('category')}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 transition ${
                    isFieldValid('category') ? 'border-green-500' : ''
                  } ${isFieldInvalid('category') ? 'border-red-500' : ''}`}
                >
                  <option value="">-- Choose Category --</option>
                  <option value="elections">Elections & Governance</option>
                  <option value="schemes">Government Schemes</option>
                  <option value="transport">Traffic & Vehicle Info</option>
                  <option value="infrastructure">Infrastructure & Development</option>
                  <option value="healthcare">Healthcare Services</option>
                  <option value="education">Education</option>
                  <option value="environment">Environment & Sanitation</option>
                  <option value="safety">Public Safety</option>
                  <option value="others">Others</option>
                </motion.select>
                {isFieldValid('category') && (
                  <CheckCircle className="absolute right-3 top-2.5 w-5 h-5 text-green-500" />
                )}
                {isFieldInvalid('category') && (
                  <AlertCircle className="absolute right-3 top-2.5 w-5 h-5 text-red-500" />
                )}
              </div>
              {isFieldInvalid('category') && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </p>
              )}
            </motion.div>

            {/* Emoji Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Rate Your Experience
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex gap-4 mt-1 justify-between">
                {emojis.map((emoji, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => handleInputChange('rating', index + 1)}
                    whileTap={{ scale: 0.8, rotate: -10 }}
                    animate={
                      formData.rating === index + 1
                        ? { scale: [1, 1.3, 1], rotate: [0, 10, 0] }
                        : { scale: 1, rotate: 0 }
                    }
                    transition={{ duration: 0.4 }}
                    className={`w-14 h-14 rounded-full border flex items-center justify-center text-2xl transition-all shadow-md ${
                      formData.rating === index + 1
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    } ${isFieldInvalid('rating') ? 'border-red-500' : ''}`}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
              {isFieldInvalid('rating') && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.rating}
                </p>
              )}
            </div>

            {/* Feedback */}
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium">
                Your Feedback
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  value={formData.feedback}
                  onChange={(e) => handleInputChange('feedback', e.target.value)}
                  onBlur={() => handleBlur('feedback')}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 transition ${
                    isFieldValid('feedback') ? 'border-green-500' : ''
                  } ${isFieldInvalid('feedback') ? 'border-red-500' : ''}`}
                  rows="4"
                  placeholder="Please share your detailed feedback, suggestions, or concerns..."
                  maxLength={500}
                />
                {isFieldValid('feedback') && (
                  <CheckCircle className="absolute right-3 top-2.5 w-5 h-5 text-green-500" />
                )}
                {isFieldInvalid('feedback') && (
                  <AlertCircle className="absolute right-3 top-2.5 w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="flex justify-between items-center">
                {isFieldInvalid('feedback') && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.feedback}
                  </p>
                )}
                <p className="text-sm text-slate-500 ml-auto">
                  {formData.feedback.length}/500 characters
                </p>
              </div>
            </motion.div>
          </div>

          {/* Progress + Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-xl shadow-md bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
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
          <p>Your feedback has been submitted successfully. We appreciate your input and will use it to improve our services.</p>
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