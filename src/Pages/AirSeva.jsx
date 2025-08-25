import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Mail, Phone, Globe, Clock, Search, Plane } from "lucide-react";

const AirSevaPage = () => {
  const [airData, setAirData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    async function fetchStops() {
      try {
        const res = await fetch("/gtfs/93710e81-db2b-4f95-9223-89156dfd8bc9.csv");
        const text = await res.text();
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setAirData(result.data);
            setFilteredData(result.data);
          },
        });
      } catch (error) {
        console.error("Error loading stops:", error);
      }
    }
    fetchStops();
  }, []);

  useEffect(() => {
    const filtered = airData.filter(item =>
      item.titleEnglish?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.titleHindi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoryenglish?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoryHindi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descriptionEnglish?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descriptionHindi?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, airData]);

  const ContactItem = ({ icon: Icon, href, children, type = "link" }) => (
    <div className="flex items-center gap-3 group/contact">
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover/contact:bg-green-100 transition-all duration-200">
        <Icon className="w-4 h-4 text-gray-600 group-hover/contact:text-green-600" />
      </div>
      <a
        href={href}
        {...(type === "external" && { target: "_blank", rel: "noopener noreferrer" })}
        className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200 flex-1 truncate"
      >
        {children}
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AirSeva Directory
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your comprehensive guide to aviation services and resources
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services, categories, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white"
              />
            </div>
            
            {/* Results Counter */}
            <div className="text-center mt-4">
              <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200">
                {filteredData.length} service{filteredData.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 max-w-md mx-auto border border-gray-200">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No services found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms or clear the search to view all services.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
              >
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                      {item.categoryenglish}
                    </span>
                  </div>
                  
                  {/* Title Section */}
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors duration-200">
                      {item.titleEnglish}
                    </h2>
                    {item.titleHindi && (
                      <h3 className="text-lg text-gray-600 font-medium">
                        {item.titleHindi}
                      </h3>
                    )}
                  </div>

                  {/* Description Section */}
                  <div className="mb-6 space-y-2">
                    {item.descriptionEnglish && (
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                        {item.descriptionEnglish}
                      </p>
                    )}
                    {item.descriptionHindi && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {item.descriptionHindi}
                      </p>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 mb-4">
                    {item.email && (
                      <ContactItem 
                        icon={Mail} 
                        href={`mailto:${item.email}`}
                      >
                        {item.email}
                      </ContactItem>
                    )}
                    
                    {item.phone && (
                      <ContactItem 
                        icon={Phone} 
                        href={`tel:${item.phone}`}
                      >
                        {item.phone}
                      </ContactItem>
                    )}
                    
                    {item.website && (
                      <ContactItem 
                        icon={Globe} 
                        href={item.website}
                        type="external"
                      >
                        Visit Website
                      </ContactItem>
                    )}
                  </div>

                  {/* Last Updated */}
                  {item.last_updated && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Last updated: {item.last_updated}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AirSevaPage;