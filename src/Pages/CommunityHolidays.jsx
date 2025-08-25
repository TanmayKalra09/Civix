import { useEffect, useState } from "react";
import { Loader2, Calendar, AlertCircle, Globe, Sparkles, MapPin } from "lucide-react";

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [country, setCountry] = useState("IN");

  const year = new Date().getFullYear();
  const today = new Date().toISOString().split("T")[0];

  const countries = [
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "US", name: "USA", flag: "🇺🇸" },
    { code: "GB", name: "UK", flag: "🇬🇧" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "AU", name: "Australia", flag: "🇦🇺" }
  ];

  useEffect(() => {
    // Simulate API call since we can't use environment variables
    setLoading(true);
    setError("");

    // Mock data for demonstration
    const mockHolidays = [
      {
        name: "New Year's Day",
        date: { iso: "2025-01-01" },
        description: "The first day of the Gregorian calendar year"
      },
      {
        name: "Republic Day",
        date: { iso: "2025-01-26" },
        description: "National holiday commemorating the adoption of the Constitution of India"
      },
      {
        name: "Independence Day",
        date: { iso: "2025-08-15" },
        description: "National holiday commemorating India's independence from British rule"
      },
      {
        name: "Gandhi Jayanti",
        date: { iso: "2025-10-02" },
        description: "Birthday of Mahatma Gandhi, celebrated as International Day of Non-Violence"
      },
      {
        name: "Diwali",
        date: { iso: "2025-10-20" },
        description: "Festival of lights celebrated by Hindus, Jains, and Sikhs"
      },
      {
        name: "Christmas Day",
        date: { iso: "2025-12-25" },
        description: "Christian holiday celebrating the birth of Jesus Christ"
      }
    ];

    setTimeout(() => {
      setHolidays(mockHolidays);
      setLoading(false);
    }, 1000);
  }, [country]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMonthFromDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const getDayFromDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-emerald-50/40 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-3xl shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                Holidays {year}
              </h1>
              <p className="text-gray-600 mt-1">Discover celebrations around the world</p>
            </div>
          </div>

          {/* Country Selector */}
          <div className="relative group">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border-2 border-green-200/50 rounded-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-300">
              <Globe className="w-5 h-5 text-green-600" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="bg-transparent outline-none text-gray-700 font-semibold cursor-pointer"
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <MapPin className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-green-500" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-green-200 rounded-full animate-pulse"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Discovering holidays...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-6 rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Holidays Grid */}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {holidays.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">No holidays found for {year}</p>
                <p className="text-gray-400 text-sm mt-1">Try selecting a different country</p>
              </div>
            ) : (
              holidays.map((holiday, idx) => {
                const isToday = holiday.date.iso === today;
                const isPast = new Date(holiday.date.iso) < new Date(today);
                
                return (
                  <div
                    key={idx}
                    className={`group relative overflow-hidden rounded-3xl border-2 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gradient-to-br backdrop-blur-sm ${
                      isToday 
                        ? "from-green-100 to-emerald-100 border-green-400 shadow-green-200" 
                        : isPast
                        ? "from-gray-50 to-gray-100 border-gray-200"
                        : "from-white to-green-50/30 border-green-200/50 hover:border-green-300"
                    }`}
                  >
                    {/* Date Badge */}
                    <div className={`absolute top-4 right-4 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-bold shadow-lg ${
                      isToday ? "bg-gradient-to-br from-green-500 to-green-600" : "bg-gradient-to-br from-emerald-400 to-green-500"
                    }`}>
                      <span className="text-xs">{getMonthFromDate(holiday.date.iso)}</span>
                      <span className="text-lg">{getDayFromDate(holiday.date.iso)}</span>
                    </div>

                    {/* Today Badge */}
                    {isToday && (
                      <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        Today!
                      </div>
                    )}

                    {/* Holiday Info */}
                    <div className="space-y-3 mt-4">
                      <h3 className={`text-xl font-bold leading-tight ${
                        isPast ? "text-gray-600" : "text-gray-800"
                      }`}>
                        {holiday.name}
                      </h3>
                      
                      <p className={`text-sm font-medium ${
                        isPast ? "text-gray-500" : "text-green-700"
                      }`}>
                        {formatDate(holiday.date.iso)}
                      </p>
                      
                      {holiday.description && (
                        <p className={`text-sm leading-relaxed ${
                          isPast ? "text-gray-500" : "text-gray-600"
                        }`}>
                          {holiday.description}
                        </p>
                      )}
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}