import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './components/AdminDashboard';
import Error404 from './components/Error404';
import Footer from "./components/Footer";
import ScrollToTop from './components/ScrollToTop';

// Newly added pages
import About from "./Pages/About";
import Privacy from "./Pages/Privacy";
import Terms from "./Pages/Terms";
import Contact from "./Pages/Contact";
import ReportIssue from "./Pages/ReportIssue"
import ServerError from "./components/ServerError";
import DownloadAndroid from './Pages/DownloadAndroid';
import DownloadIOS from './Pages/DownloadIOS';

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/report-issue" element={<ReportIssue />} />        
        <Route path="*" element={<Error404 />} />
        <Route path="/download-android" element={<DownloadAndroid />} />
        <Route path="/download-ios" element={<DownloadIOS />} />
        <Route path="/500" element={<ServerError />} />

        {/* Protected routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/home" 
          element={
            <PrivateRoute allowedRoles={['user', 'admin']}>
              <Home />
            </PrivateRoute>
          } 
        />
      </Routes>
      {/* Optional: <Footer /> if you want it globally visible */}
    </>
  );
};

export default App;
