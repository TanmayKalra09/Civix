import { useState } from "react";
import { Search, Plus, MapPin, Calendar, User, Phone, Mail, X } from "lucide-react";

export default function LostAndFoundPage() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "lost",
    name: "",
    description: "",
    location: "",
    date: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.location || !formData.date || 
        !formData.contactName || !formData.contactPhone || !formData.contactEmail) {
      return;
    }
    setItems([...items, { ...formData, id: Date.now(), type: formData.type }]);
    setFormData({
      type: "lost",
      name: "",
      description: "",
      location: "",
      date: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
    });
    setShowForm(false);
  };

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-25 via-white to-green-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-green-950/10 relative p-6">
      {/* Background orbs */}
      <div className="absolute top-20 right-16 w-72 h-72 bg-green-200/10 dark:bg-green-400/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-64 h-64 bg-green-300/15 dark:bg-green-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-green-800 dark:from-white dark:via-green-300 dark:to-green-400 bg-clip-text text-transparent mb-2">
              Lost & Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Help reunite people with their belongings</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl shadow-lg shadow-green-600/25 hover:shadow-green-700/30 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            Add Item
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items by name or description..."
              className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-200/50 dark:border-green-700/50 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 dark:focus:border-green-500 transition-all duration-200 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: "all", label: "All Items", emoji: "📋" },
              { key: "lost", label: "Lost", emoji: "😔" },
              { key: "found", label: "Found", emoji: "🎉" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
                    : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-950/30 border border-green-200/50 dark:border-green-700/50"
                }`}
              >
                <span className="mr-2">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl border border-green-200/50 dark:border-green-700/50 p-16 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No items found</h3>
            <p className="text-gray-600 dark:text-gray-400">Be the first to add a lost or found item!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50 hover:border-green-300 dark:hover:border-green-600 hover:shadow-lg hover:shadow-green-100/20 dark:hover:shadow-green-900/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                    {item.name}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    item.type === "lost"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  }`}>
                    {item.type.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="truncate">{item.contactName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-mono">{item.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="truncate">{item.contactEmail}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md border border-green-200/50 dark:border-green-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Item</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  {[
                    { value: "lost", label: "😔 Lost", desc: "I lost something" },
                    { value: "found", label: "🎉 Found", desc: "I found something" }
                  ].map((option) => (
                    <label key={option.value} className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={option.value}
                        checked={formData.type === option.value}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`text-center p-3 rounded-lg border-2 transition-all ${
                        formData.type === option.value
                          ? "border-green-500 bg-green-100 dark:bg-green-900/50"
                          : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                      }`}>
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {[
                  { key: "name", type: "text", placeholder: "Item Name", required: true },
                  { key: "description", type: "textarea", placeholder: "Description", required: true },
                  { key: "location", type: "text", placeholder: "Location", required: true },
                  { key: "date", type: "date", placeholder: "", required: true },
                  { key: "contactName", type: "text", placeholder: "Contact Name", required: true },
                  { key: "contactPhone", type: "tel", placeholder: "Contact Phone", required: true },
                  { key: "contactEmail", type: "email", placeholder: "Contact Email", required: true }
                ].map((field) => (
                  <div key={field.key}>
                    {field.type === "textarea" ? (
                      <textarea
                        placeholder={field.placeholder}
                        className="w-full p-4 bg-white/80 dark:bg-gray-800/80 border border-green-200/50 dark:border-green-700/50 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-200 resize-none h-24"
                        value={formData[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        required={field.required}
                      />
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full p-4 bg-white/80 dark:bg-gray-800/80 border border-green-200/50 dark:border-green-700/50 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-400 transition-all duration-200"
                        value={formData[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg shadow-green-600/25 hover:shadow-green-700/30 transition-all duration-200 transform hover:scale-105"
                >
                  Submit Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}