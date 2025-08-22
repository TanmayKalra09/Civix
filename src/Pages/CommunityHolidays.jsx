// pages/Holidays.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Calendar, AlertCircle } from "lucide-react";

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiKey = process.env.REACT_APP_CALENDARIFIC_KEY;
  const year = new Date().getFullYear();

  useEffect(() => {
    if (!apiKey) {
      setError("⚠️ API key missing. Please set REACT_APP_CALENDARIFIC_KEY in your .env file.");
      setLoading(false);
      return;
    }

    axios
      .get("https://calendarific.com/api/v2/holidays", {
        params: {
          api_key: apiKey,
          country: "IN", // you can make this dynamic
          year: year,
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
  }, [apiKey, year]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Calendar className="text-indigo-600" /> Holidays ({year})
      </h1>

      {loading && (
        <div className="flex items-center gap-2 text-slate-600">
          <Loader2 className="animate-spin" /> Fetching holidays...
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl border bg-red-50 text-red-700 flex items-center gap-2">
          <AlertCircle /> {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {holidays.length === 0 ? (
            <p className="text-slate-500">No holidays found for {year}.</p>
          ) : (
            holidays.map((h, idx) => (
              <div
                key={idx}
                className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                <p className="font-semibold text-slate-800">{h.name}</p>
                <p className="text-sm text-slate-600">{h.date.iso}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {h.description || "No description available"}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
