import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  List, 
  User, 
  Headphones, 
  BarChart3, 
  BookOpen 
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-black">
    
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 dark:from-green-400 dark:to-emerald-400">
            Welcome, Citizen 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Your digital gateway to civic engagement and community services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <DashboardCard
            title="File a Complaint"
            description="Submit a new issue with full details."
            onClick={() => navigate("/report-issue")}
            icon={FileText}
            gradient="from-green-500 to-green-600"
            shadowColor="shadow-green-500/20"
          />
          <DashboardCard
            title="My Complaints"
            description="Track all complaints you've raised."
            onClick={() => navigate("/complaints")}
            icon={List}
            gradient="from-emerald-500 to-emerald-600"
            shadowColor="shadow-emerald-500/20"
          />
          <DashboardCard
            title="Profile"
            description="View or edit your profile details."
            onClick={() => navigate("/profile")}
            icon={User}
            gradient="from-teal-500 to-teal-600"
            shadowColor="shadow-teal-500/20"
          />
          <DashboardCard
            title="Support"
            description="Need help? Contact our support."
            onClick={() => navigate("/contact")}
            icon={Headphones}
            gradient="from-green-600 to-emerald-700"
            shadowColor="shadow-green-600/20"
          />
          <DashboardCard
            title="Community Voting"
            description="Interact with the community."
            onClick={() => navigate("/community-voting")}
            icon={BarChart3}
            gradient="from-emerald-600 to-teal-700"
            shadowColor="shadow-emerald-600/20"
          />
          <DashboardCard
            title="Resources"
            description="Read FAQs, citizen rights, and more."
            onClick={() => navigate("/resources")}
            icon={BookOpen}
            gradient="from-teal-600 to-green-700"
            shadowColor="shadow-teal-600/20"
          />
        </div>
      </main>
    </div>
  );
};

const DashboardCard = ({ title, description, onClick, icon: Icon, gradient, shadowColor }) => {
  return (
    <div
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
      className={`group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-gray-700 shadow-lg ${shadowColor} hover:shadow-2xl hover:shadow-green-500/30 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:scale-105 overflow-hidden`}
    >
    
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
      
 
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500" />
      

      <div className="relative z-10">
       
        <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        
  
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">
          {title}
        </h3>
        
  
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
          {description}
        </p>
        
      </div>
      

      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl`} />
      

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
    </div>
  );
};

export default UserDashboard;