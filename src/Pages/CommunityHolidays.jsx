// pages/Holidays.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Calendar, AlertCircle, Globe } from "lucide-react";

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [country, setCountry] = useState("IN");

  const apiKey = process.env.REACT_APP_CALENDARIFIC_KEY;
  const year = new Date().getFullYear();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!apiKey) {
      setError("⚠️ API key missing. Please set REACT_APP_CALENDARIFIC_KEY in your .env file.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    axios
      .get("https://calendarific.com/api/v2/holidays", {
        params: {
          api_key: apiKey,
          country,
          year,
        },
      })
      .then((res) => {
        const data = res.data?.response?.holidays || [];
        setHolidays(data);
      })
      .catch((err) => {
        console.error("Error fetching holidays:", err);
        setError("❌ Failed to fetch holidays. Please check your API key or internet connection.");
      })
      .finally(() => setLoading(false));
  }, [apiKey, year, country]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="text-indigo-600" /> Holidays ({year})
        </h1>

        {/* Country Selector */}
        <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 shadow-sm">
          <Globe className="text-indigo-500" />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-transparent outline-none text-slate-700 font-medium"
          >
            <option value="IN">🇮🇳 India</option>
            <option value="US">🇺🇸 USA</option>
            <option value="GB">🇬🇧 UK</option>
            <option value="CA">🇨🇦 Canada</option>
            <option value="AU">🇦🇺 Australia</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-slate-600">
          <Loader2 className="animate-spin" /> Fetching holidays...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl border bg-red-50 text-red-700 flex items-center gap-2">
          <AlertCircle /> {error}
        </div>
      )}

      {/* Holidays List */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {holidays.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 text-lg">No holidays found for {year} in this country.</p>
            </div>
          ) : (
            holidays.map((h, idx) => {
              const isToday = h.date.iso === today;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-5 shadow-md transition transform hover:scale-105 bg-gradient-to-br from-indigo-50 to-white ${
                    isToday ? "ring-2 ring-indigo-500" : ""
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-lg text-slate-800">{h.name}</p>
                    {isToday && (
                      <span className="px-2 py-1 text-xs rounded-lg bg-indigo-600 text-white font-medium">
                        Today 🎉
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{h.date.iso}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                    {h.description || "No description available"}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
