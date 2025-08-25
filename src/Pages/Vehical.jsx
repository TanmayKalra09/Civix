import React from 'react';

const CarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LeafIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export default function GovtLinksSection() {
  const sections = [
    {
      title: "Vehicle RC / Registration",
      description: "Check vehicle registration details on Vahan Parivahan.",
      url: "https://vahan.parivahan.gov.in/vahanservice/vahan/rc/",
      icon: CarIcon,
      cta: "Check RC",
      gradient: "from-blue-50 to-indigo-50"
    },
    {
      title: "Challan / Traffic Fines",
      description: "View and pay your challans online securely.",
      url: "https://parivahan.gov.in/rcdlstatus/",
      icon: AlertIcon,
      cta: "Pay Challan",
      gradient: "from-red-50 to-rose-50"
    },
    {
      title: "Insurance Verification",
      description: "Verify vehicle insurance instantly via the Info Portal.",
      url: "https://vahan.parivahan.gov.in/vahanservice/vahan/insurance/",
      icon: ShieldIcon,
      cta: "Verify Insurance",
      gradient: "from-purple-50 to-pink-50"
    },
    {
      title: "PUC / Pollution Certificate",
      description: "Check or renew your vehicle’s PUC online.",
      url: "https://parivahan.gov.in/puc/",
      icon: LeafIcon,
      cta: "Get PUC",
      gradient: "from-green-50 to-lime-50"
    }
  ];

  return (
    <div className="space-y-6 mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Government Services</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-500 mx-auto rounded-full"></div>
        <p className="text-gray-600 mt-4 text-lg">Quick access to essential vehicle and transport services</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <div 
              key={index} 
              className="group relative overflow-hidden ml-10 mr-10 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white rounded-3xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-60`}></div>
              
              <div className="relative z-10 p-6 pb-2">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-3 bg-white rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-700 transition-colors duration-300">
                      {section.title}
                    </h3>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 px-6 pb-6 pt-0">
                <p className="text-gray-700 mb-4 font-medium text-sm">
                  {section.description}
                </p>
                
                <a
                  href={section.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={section.cta}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group/link"
                >
                  <span>{section.cta}</span>
                  <ExternalLinkIcon className="group-hover/link:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
              
              <div className="absolute top-4 right-4 w-20 h-20 bg-emerald-100 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-green-100 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-700"></div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center mt-12">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    </div>
  );
}