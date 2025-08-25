import { useState, useEffect, useCallback } from "react";
import { 
  Github, 
  Info, 
  ShieldCheck, 
  ScrollText, 
  Star, 
  UsersIcon, 
  ArrowUpRight,
  MapPin,
  Heart,
  Sparkles,
  Zap,
  Mail,
  Phone,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import logoF from "../assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [selectedRating, setSelectedRating] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Performance optimization: Memoize social links
  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/HarshS16/Civix",
      icon: Github,
      description: "View source code",
    },
  ];

  const footerLinks = [
    {
      title: "Civix",
      icon: Sparkles,
      links: [
        { name: "About", href: "/about", icon: Info, description: "Learn about our mission" },
        { name: "Features", href: "/#features", icon: Star, description: "Explore platform features" },
        { name: "Feedback", href: "/feedback", icon: MessageSquare, description: "Share your feedback" },
      ],
    },
    {
      title: "Legal",
      icon: ShieldCheck,
      links: [
        { name: "Privacy", href: "/privacy", icon: ShieldCheck, description: "Privacy policy" },
        { name: "Terms", href: "/terms", icon: ScrollText, description: "Terms of service" },
        { name: "Contributors", href: "/contributors", icon: UsersIcon, description: "Meet our team" },
      ],
    },
  ];

  const emojis = [
    { emoji: "😡", label: "Very Dissatisfied", color: "hover:bg-red-100 dark:hover:bg-red-900/20" },
    { emoji: "😕", label: "Dissatisfied", color: "hover:bg-orange-100 dark:hover:bg-orange-900/20" },
    { emoji: "😐", label: "Neutral", color: "hover:bg-yellow-100 dark:hover:bg-yellow-900/20" },
    { emoji: "🙂", label: "Satisfied", color: "hover:bg-green-100 dark:hover:bg-green-900/20" },
    { emoji: "😍", label: "Very Satisfied", color: "hover:bg-purple-100 dark:hover:bg-purple-900/20" },
  ];

  // Performance optimization: Debounced feedback submission
  const handleSubmitFeedback = useCallback(() => {
    if (!selectedRating && !feedbackText.trim()) return;
    
    setMessage("Thanks for your feedback! 💚");
    setFeedbackText("");
    setSelectedRating(null);

    setTimeout(() => setMessage(""), 3000);
  }, [selectedRating, feedbackText]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footer = document.querySelector('#footer');
    if (footer) {
      observer.observe(footer);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer 
      id="footer"
      className={`relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Optimized Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900/95">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.04),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.04),transparent_50%)]"></div>
      </div>

      {/* Minimal Floating Elements for Performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 left-8 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-8 right-8 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-30"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main Content - Optimized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Section - More Compact */}
          <div className="md:col-span-2 lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <img src={logoF} alt="Civix Logo" className="w-12 h-auto transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-15 blur-sm transition-opacity duration-300"></div>
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CIVIX
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Civic Engagement Platform</p>
                </div>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Empowering citizens through technology. Stay informed, make better decisions, and engage with civic life.
              </p>
            </div>

            {/* Social Links - Compact */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                Connect
              </h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-10 h-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-lg flex items-center justify-center text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 hover:border-emerald-300/50 dark:hover:border-emerald-500/50"
                    title={social.description}
                  >
                    <social.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Info - Compact */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 text-sm">
                <Mail className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span>support@civix.com</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 text-sm">
                <Phone className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 text-sm">
                <MapPin className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span>Bangalore, India</span>
              </div>
            </div>
          </div>

          {/* Links Sections - Optimized */}
          {footerLinks.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <section.icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {section.title}
                </h3>
              </div>
              
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="group flex items-center space-x-2 text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-all duration-300 hover:translate-x-1 py-1 px-2 rounded-md hover:bg-white/50 dark:hover:bg-slate-800/50 text-sm"
                      title={link.description}
                    >
                      <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-md flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 transition-colors duration-300">
                        <link.icon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Optimized Feedback Section */}
        <div className="text-center py-8 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="max-w-xl mx-auto space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                How was your experience?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Your feedback helps us improve
              </p>
            </div>

            <div className="space-y-4">
              {/* Compact Emoji Rating */}
              <div className="flex flex-wrap justify-center items-center gap-2">
                {emojis.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedRating(index)}
                    className={`group relative p-3 rounded-xl transition-all duration-300 ${
                      selectedRating === index 
                        ? 'scale-110 bg-white dark:bg-slate-800 shadow-lg shadow-emerald-500/20 border-2 border-emerald-500' 
                        : 'hover:scale-105 hover:bg-white/50 dark:hover:bg-slate-800/50'
                    } ${item.color}`}
                    title={item.label}
                  >
                    <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                      {item.emoji}
                    </span>
                    {selectedRating === index && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Zap className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Compact Feedback Input */}
              {selectedRating !== null && (
                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                  <input
                    type="text"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us more..."
                    className="flex-1 max-w-xs px-3 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-300 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitFeedback()}
                  />
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={!feedbackText.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:from-slate-300 disabled:to-slate-400 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none text-sm"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Footer Bottom */}
        <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-slate-500 dark:text-slate-400 text-xs">
              © {currentYear} Civix. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs">
              <span>Built with</span>
              <Heart className="w-3 h-3 text-red-500 animate-pulse" />
              <span>by</span>
              <a
                href="https://github.com/HarshS16/Civix"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold transition-all duration-300 hover:scale-105"
              >
                <span>Harsh S.</span>
                <ArrowUpRight className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0.5 -translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Toast Message */}
      {message && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-lg shadow-xl shadow-emerald-500/25 animate-fadeIn z-50">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3 h-3" />
            <span className="font-medium text-sm">{message}</span>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
