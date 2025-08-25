import React, { useState } from 'react';
import { User, Mail, MessageCircle, CheckCircle, Send, Sparkles, Clock, AlertCircle } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const getFieldValidation = (field, value) => {
    switch (field) {
      case 'email':
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address.";
        return null;
      case 'name':
        if (!value.trim()) return "Name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters long.";
        return null;
      case 'message':
        if (!value.trim()) return "Message is required.";
        if (value.trim().length < 10) return "Message must be at least 10 characters long.";
        return null;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    ['name', 'email', 'message'].forEach(field => {
      const error = getFieldValidation(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      // Simulate API call - replace with actual EmailJS call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      alert("An error occurred while sending your message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = getFieldValidation(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    setFocusedField(null);
  };

  const isFilled = (value) => value.trim() !== '';

  const renderFormField = (name, type = 'text', icon, placeholder, isTextArea = false) => {
    const IconComponent = icon;
    return (
      <div key={name} className="group">
        <div className="relative">
          <div className={`absolute left-4 ${isTextArea ? 'top-4' : 'top-1/2 -translate-y-1/2'} z-10`}>
            <IconComponent className={`w-5 h-5 transition-all duration-300 ${
              focusedField === name || isFilled(formData[name]) 
                ? 'text-green-600 scale-110' 
                : 'text-gray-400'
            }`} />
          </div>
          {isTextArea ? (
            <textarea
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onFocus={() => setFocusedField(name)}
              onBlur={handleBlur}
              rows={4}
              className={`peer w-full pl-12 pr-12 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-xl text-gray-900 placeholder-transparent focus:outline-none transition-all duration-300 text-base shadow-sm hover:shadow-md focus:shadow-lg resize-none ${
                errors[name]
                  ? 'border-red-400 focus:border-red-500 bg-red-50/50'
                  : focusedField === name
                  ? 'border-green-500 bg-white shadow-green-100'
                  : 'border-gray-200 hover:border-green-300'
              }`}
              placeholder={placeholder}
            />
          ) : (
            <input
              type={type}
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              onFocus={() => setFocusedField(name)}
              onBlur={handleBlur}
              className={`peer w-full pl-12 pr-12 py-4 bg-white/70 backdrop-blur-sm border-2 rounded-xl text-gray-900 placeholder-transparent focus:outline-none transition-all duration-300 text-base shadow-sm hover:shadow-md focus:shadow-lg ${
                errors[name]
                  ? 'border-red-400 focus:border-red-500 bg-red-50/50'
                  : focusedField === name
                  ? 'border-green-500 bg-white shadow-green-100'
                  : 'border-gray-200 hover:border-green-300'
              }`}
              placeholder={placeholder}
            />
          )}
          <label
            htmlFor={name}
            className={`absolute left-12 px-2 bg-white rounded transition-all duration-300 pointer-events-none font-medium ${
              focusedField === name || isFilled(formData[name]) ? '-top-2 text-xs' : 'top-4 text-base'
            } ${
              errors[name]
                ? 'text-red-500'
                : focusedField === name || isFilled(formData[name])
                ? 'text-green-600'
                : 'text-gray-500'
            } peer-focus:-top-2 peer-focus:text-xs ${
              errors[name] ? 'peer-focus:text-red-500' : 'peer-focus:text-green-600'
            }`}
          >
            {placeholder}
          </label>
          <div className={`absolute right-4 ${isTextArea ? 'top-4' : 'top-1/2 -translate-y-1/2'}`}>
            {errors[name] ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : isFilled(formData[name]) && getFieldValidation(name, formData[name]) === null ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : null}
          </div>
        </div>
        {errors[name] && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderFormField('name', 'text', User, 'Your Name')}
      {renderFormField('email', 'email', Mail, 'Your Email')}
      {renderFormField('message', 'text', MessageCircle, 'Your Message', true)}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || submitted}
        className="group relative w-full overflow-hidden bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100"
      >
        <div className="flex items-center justify-center gap-3 relative z-10">
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending...</span>
            </>
          ) : submitted ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Message Sent!</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              <span>Send Message</span>
            </>
          )}
        </div>
        {!isLoading && !submitted && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
        )}
      </button>

      {submitted && (
        <div className="flex items-center justify-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl animate-pulse">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <span className="text-green-700 font-medium">Thank you! We'll get back to you soon.</span>
        </div>
      )}
    </div>
  );
};

function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-green-100/30 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-3 leading-tight">
                Contact Us
              </h1>
              
              <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4"></div>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Have questions or need help? We'd love to hear from you. 
                Fill out the form and we'll respond quickly.
              </p>
            </div>

            <div className="space-y-4">
              <div className="group p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                    <a href="mailto:support@civix.com" className="text-green-600 hover:text-green-700 transition-colors font-medium">
                      support@civix.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="group p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                    <p className="text-gray-600 font-medium">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200/50">
              <h3 className="text-base font-semibold text-green-800 mb-2">Why Contact Us?</h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Technical support and assistance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Feature requests and feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>General inquiries and questions</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-6">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600">We'll respond as quickly as possible</p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;