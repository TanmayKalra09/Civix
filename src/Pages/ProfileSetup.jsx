import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import useProfileStatus from '../hooks/useProfileStatus';
import csrfManager from '../utils/csrfManager';
import 'react-toastify/dist/ReactToastify.css';

const ProfileSetup = ({onComplete}) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { refetch } = useProfileStatus();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [profileSubmitted, setProfileSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || ''
      }));
    }
  }, [user]);

  // Prevent redirect back if profile was just submitted
  useEffect(() => {
    // Store a flag in sessionStorage when profile is submitted
    // This will prevent the Home component from redirecting back
    if (profileSubmitted) {
      sessionStorage.setItem('profileJustSubmitted', 'true');
      
      // Clear the flag after 5 seconds (after navigation completes)
      setTimeout(() => {
        sessionStorage.removeItem('profileJustSubmitted');
      }, 5000);
    }
  }, [profileSubmitted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.location.trim()) {
      toast.error('Please fill in all fields');
      return;
    }


    setIsLoading(true);

    try {
      let uploadedProfileUrl = null;

      // If user selected an image, upload it first
      if (profileImageFile) {
        try {
          const fd = new FormData();
          fd.append('image', profileImageFile);
          const uploadRes = await csrfManager.secureFetch(`http://localhost:5000/api/profile/${user.id}/profile-picture`, {
            method: 'POST',
            body: fd
          });
          
          if (!uploadRes.ok) {
            throw new Error('Failed to upload profile picture');
          }
          
          const uploadData = await uploadRes.json();
          uploadedProfileUrl = uploadData.profilePictureUrl || null;
          console.log('Profile picture uploaded successfully:', uploadedProfileUrl);
        } catch (uploadError) {
          console.error('Profile picture upload failed:', uploadError);
          toast.warn('Profile picture upload failed, but profile will still be saved');
          // Continue without profile picture
        }
      }

      // Create or update the user profile in our database
      console.log('Saving profile data:', {
        clerkUserId: user.id,
        email: formData.email,
        name: formData.name,
        location: formData.location,
        profilePictureUrl: uploadedProfileUrl
      });
      
      localStorage.setItem("profileComplete", "true");
      console.log(localStorage.getItem("profileComplete"));
      onComplete();
      
      const profileResponse = await csrfManager.secureFetch('http://localhost:5000/api/profile/create-or-update', {
        method: 'POST',
        body: JSON.stringify({
          clerkUserId: user.id,
          email: formData.email,
          name: formData.name,
          location: formData.location,
          ...(uploadedProfileUrl ? { profilePictureUrl: uploadedProfileUrl } : {})
        })
      });

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('Profile save failed:', profileResponse.status, errorText);
        throw new Error(`Failed to save profile: ${profileResponse.status}`);
      }

      const profileData = await profileResponse.json();
      console.log('Profile saved successfully:', profileData);
      
      // Mark profile as submitted to prevent redirect loop
      setProfileSubmitted(true);
      
      // Force update the profile status to prevent redirect loop
      if (profileData.isProfileComplete) {
        toast.success('Profile setup completed successfully! Redirecting to home page...');
        
        // Update the profile status hook immediately
        refetch();
        // Use a more reliable redirect method
        setTimeout(() => {
          console.log('Redirecting to home page...');
          // Force a hard redirect to home page
          window.location.replace('/');
        }, 1500);
        
      } else {
        console.warn('Profile marked as incomplete, but redirecting anyway');
        toast.success('Profile saved! Redirecting to home page...');
        
        // Update the profile status hook immediately
        refetch();
        
        // Use a more reliable redirect method
        setTimeout(() => {
          console.log('Redirecting to home page (profile incomplete)...');
          // Force a hard redirect to home page
          window.location.replace('/');
        }, 1500);
      }
      
    } catch (error) {
      console.error('Profile setup error:', error);
      
      if (error.message.includes('Failed to save profile')) {
        toast.error('Failed to save profile. Please check your connection and try again.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setProfileImageFile(null);
      setProfileImagePreview('');
      return;
    }
    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGeolocating(true);
    toast.info('Detecting your location...');

    const options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0 // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log('Raw GPS coordinates detected:', { latitude, longitude });
          
          // Show coordinates in console for debugging
          const latDir = latitude >= 0 ? 'N' : 'S';
          const lonDir = longitude >= 0 ? 'E' : 'W';
          const latAbs = Math.abs(latitude);
          const lonAbs = Math.abs(longitude);
          console.log(`Formatted coordinates: ${latAbs.toFixed(6)}°${latDir}, ${lonAbs.toFixed(6)}°${lonDir}`);

          // Try multiple reverse geocoding services for better accuracy
          let location = '';
          let success = false;
          let serviceUsed = '';

          // Service 1: BigDataCloud with more precise parameters
          try {
            const response1 = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=free&localityLanguage=en&localityInfo=true`
            );
            
            if (response1.ok) {
              const data = await response1.json();
              console.log('BigDataCloud response:', data);
              
              if (data.city && data.countryName) {
                location = `${data.city}, ${data.countryName}`;
                success = true;
                serviceUsed = 'BigDataCloud';
              } else if (data.locality && data.countryName) {
                location = `${data.locality}, ${data.countryName}`;
                success = true;
                serviceUsed = 'BigDataCloud';
              } else if (data.countryName) {
                // If only country is available, try to get more specific info
                location = `${data.countryName}`;
                success = true;
                serviceUsed = 'BigDataCloud';
              }
            }
          } catch (error) {
            console.log('BigDataCloud failed:', error);
          }

          // Service 2: OpenStreetMap with better parameters
          if (!success) {
            try {
              const response2 = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12&accept-language=en&addressdetails=1`
              );
              
              if (response2.ok) {
                const data = await response2.json();
                console.log('OpenStreetMap response:', data);
                
                if (data.address) {
                  const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state;
                  const country = data.address.country;
                  if (city && country) {
                    location = `${city}, ${country}`;
                    success = true;
                    serviceUsed = 'OpenStreetMap';
                  } else if (country) {
                    location = country;
                    success = true;
                    serviceUsed = 'OpenStreetMap';
                  }
                }
              }
            } catch (error) {
              console.log('OpenStreetMap failed:', error);
            }
          }

          // Service 3: Try a different approach - use coordinates to get nearby cities
          if (!success) {
            try {
              // Use a service that can find nearby cities
              const response3 = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=free&localityInfo=true&radius=50000`
              );
              
              if (response3.ok) {
                const data = await response3.json();
                console.log('BigDataCloud with radius response:', data);
                
                if (data.city && data.countryName) {
                  location = `${data.city}, ${data.countryName}`;
                  success = true;
                  serviceUsed = 'BigDataCloud (radius)';
                }
              }
            } catch (error) {
              console.log('BigDataCloud radius search failed:', error);
            }
          }

          // If all services fail, use coordinates with better formatting
          if (!success) {
            // Try to get a more human-readable coordinate format
            location = `${latAbs.toFixed(6)}°${latDir}, ${lonAbs.toFixed(6)}°${lonDir}`;
            serviceUsed = 'Coordinates only';
          }

          setFormData(prev => ({ ...prev, location }));
          
          // Show detailed success message
          if (success) {
            toast.success(`Location detected via ${serviceUsed}: ${location}`);
            console.log(`Location successfully detected via ${serviceUsed}: ${location}`);
          } else {
            toast.info(`Using coordinates: ${location}`);
            console.log(`Using fallback coordinates: ${location}`);
          }

          // Additional debugging: Check if coordinates are reasonable for Bangalore
          // Bangalore is roughly around: 12.9716°N, 77.5946°E
          const bangaloreLat = 12.9716;
          const bangaloreLon = 77.5946;
          const distance = Math.sqrt(
            Math.pow(latitude - bangaloreLat, 2) + Math.pow(longitude - bangaloreLon, 2)
          );
          
          if (distance < 0.1) { // Within ~11km of Bangalore center
            console.log('✅ Coordinates are close to Bangalore center');
          } else if (distance < 0.5) { // Within ~55km of Bangalore center
            console.log('⚠️ Coordinates are within Bangalore metropolitan area');
          } else {
            console.log('❌ Coordinates seem far from Bangalore center');
            console.log(`Distance from Bangalore center: ${(distance * 111).toFixed(1)} km`);
          }

        } catch (error) {
          console.error('Reverse geocoding error:', error);
          // Ultimate fallback to coordinates
          const { latitude, longitude } = position.coords;
          const latDir = latitude >= 0 ? 'N' : 'S';
          const lonDir = longitude >= 0 ? 'E' : 'W';
          const latAbs = Math.abs(latitude);
          const lonAbs = Math.abs(longitude);
          
          const fallbackLocation = `${latAbs.toFixed(6)}°${latDir}, ${lonAbs.toFixed(6)}°${lonDir}`;
          setFormData(prev => ({ ...prev, location: fallbackLocation }));
          toast.info(`Using coordinates: ${fallbackLocation}`);
          console.log(`Fallback coordinates: ${fallbackLocation}`);
        } finally {
          setGeolocating(false);
        }
      },
      (error) => {
        setGeolocating(false);
        console.error('Geolocation error:', error);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied. Please enable location access in your browser settings and refresh the page.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable. Please check your internet connection and try again.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out. Please try again.');
            break;
          default:
            toast.error('Unable to detect location. Please enter your location manually.');
        }
      },
      options
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Please sign in to continue
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Complete Your Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            Help us personalize your Civix experience by providing a few details about yourself
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 dark:border-gray-700/60 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-base"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-base"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-base"
                  placeholder="Enter your city or location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={geolocating}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {geolocating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Detecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Use My Location
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Click "Use My Location" to automatically detect your current location, or enter it manually
              </p>
            </div>

            {/* Profile Picture Field */}
            <div className="space-y-2">
              <label htmlFor="profileImage" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Profile Picture <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <div className="space-y-3">
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/50 dark:file:text-emerald-300 dark:hover:file:bg-emerald-800/50 transition-all duration-200 cursor-pointer"
                  onChange={handleImageChange}
                />
                {profileImagePreview && (
                  <div className="flex items-center space-x-4">
                    <img 
                      src={profileImagePreview} 
                      alt="Profile preview" 
                      className="h-20 w-20 rounded-full object-cover border-4 border-emerald-200 dark:border-emerald-700 shadow-lg" 
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <p className="font-medium">Preview</p>
                      <p className="text-xs">Your profile picture will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting up your profile...
                  </div>
                ) : (
                  'Complete Profile Setup'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              By completing your profile, you agree to our{' '}
              <a href="/terms" className="text-emerald-600 dark:text-emerald-400 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-emerald-600 dark:text-emerald-400 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
