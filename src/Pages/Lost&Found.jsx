import { useState } from "react";
import {
  Search,
  Plus,
  MapPin,
  Calendar,
  User,
  Tag,
  Phone,
  Mail,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Add new item
  const handleSubmit = (e) => {
    e.preventDefault();
    setItems([
      ...items,
      { ...formData, id: Date.now(), type: formData.type },
    ]);
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

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lost & Found</h1>
        <button
          onClick={() => setShowForm(true)}
          className="mt-3 sm:mt-0 flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Item
        </button>
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "lost", "found"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg shadow ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No items found. Add one to get started!
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg border"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 mb-3">{item.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" /> {item.location}
                </p>
                <p className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" /> {item.date}
                </p>
                <p className="flex items-center">
                  <User className="w-4 h-4 mr-2" /> {item.contactName}
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" /> {item.contactPhone}
                </p>
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" /> {item.contactEmail}
                </p>
              </div>
              <span
                className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full ${
                  item.type === "lost"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {item.type.toUpperCase()}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-4">Add Item</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value="lost"
                      checked={formData.type === "lost"}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                    />
                    Lost
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value="found"
                      checked={formData.type === "found"}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                    />
                    Found
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Item Name"
                  className="w-full p-2 border rounded-lg"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Description"
                  className="w-full p-2 border rounded-lg"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full p-2 border rounded-lg"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Contact Name"
                  className="w-full p-2 border rounded-lg"
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                  required
                />
                <input
                  type="tel"
                  placeholder="Contact Phone"
                  className="w-full p-2 border rounded-lg"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Contact Email"
                  className="w-full p-2 border rounded-lg"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Submit
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
