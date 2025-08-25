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
      description: "Vahan Parivahan",
      url: "https://vahan.parivahan.gov.in/vahanservice/vahan/rc/",
      icon: CarIcon,
      color: "emerald"
    },
    {
      title: "Challan / Traffic Fines",
      description: "Ministry of Road Transport & Highways",
      url: "https://parivahan.gov.in/rcdlstatus/",
      icon: AlertIcon,
      color: "green"
    },
    {
      title: "Insurance Verification",
      description: "Insurance Info Portal",
      url: "https://vahan.parivahan.gov.in/vahanservice/vahan/insurance/",
      icon: ShieldIcon,
      color: "teal"
    },
    {
      title: "PUC / Pollution Certificate",
      description: "CPCB / State PUC Portal",
      url: "https://parivahan.gov.in/puc/",
      icon: LeafIcon,
      color: "lime"
    }
  ];

  const getColorClasses = (color) => ({
    iconBg: {
      emerald: "bg-emerald-100 text-emerald-600",
      green: "bg-green-100 text-green-600",
      teal: "bg-teal-100 text-teal-600",
      lime: "bg-lime-100 text-lime-600"
    }[color],
    button: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Government Services
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Quick access to essential vehicle and transport services
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          const colors = getColorClasses(section.color);
          
          return (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl ${colors.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors duration-300">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* Button */}
              <a
                href={section.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-3 ${colors.button} text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md group/link w-full justify-center`}
              >
                <span>Visit Official Portal</span>
                <ExternalLinkIcon className="group-hover/link:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          );
        })}
      </div>

      {/* Footer Indicators */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          {[0, 0.5, 1].map((delay, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}