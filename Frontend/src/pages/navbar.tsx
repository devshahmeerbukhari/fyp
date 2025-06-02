import { useState, useEffect } from "react";
import { UserDropdown } from "../components/UserDropdown/UserDropdown";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { X, Menu, User, Home, MapPin, Video, Calendar, PhoneCall, LogOut } from "lucide-react";

interface MenuItem {
  menue: string;
  path: string;
  icon: React.ReactNode;
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, loading, logout } = useAuth();

  // Add scroll event listener to detect when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navigationMenuItems = [
    { menue: "Home", path: "/", icon: <Home size={18} /> },
    { menue: "Destinations", path: "/destinations", icon: <MapPin size={18} /> },
    { menue: "Virtual Tours", path: "/virtual-tours", icon: <Video size={18} /> },
    { menue: "Bookings", path: "/bookings", icon: <Calendar size={18} /> },
    { menue: "Emergency Help", path: "/emergency", icon: <PhoneCall size={18} /> },
  ];

  const handleSignInClick = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = (menuItem: MenuItem) => {
    setIsMenuOpen(false); // Close the menu after selection
    navigate(menuItem.path);
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Height placeholder for fixed header to prevent content jump */}
      <div className={isScrolled ? "h-14 sm:h-16 md:h-[4.5rem]" : "h-0"}></div>
      
      {/* Header component - either fixed or relative */}
      <header className={`
        flex justify-between items-center px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-3 lg:px-8 bg-white/95 backdrop-blur-sm shadow-sm w-full max-w-screen z-50
        ${isScrolled ? 'fixed top-0 left-0 right-0 animate-slideDown' : 'relative'}
      `}>
        {/* App-style location pin logo - Responsive sizing */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md bg-green-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5 text-white">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div className="flex items-center">
            <span className="text-xs sm:text-sm md:text-lg font-medium">
              <span className="text-gray-800">Pakistani</span> 
              <span className="text-green-600 ml-1">Panorama</span>
            </span>
          </div>
        </Link>

        {/* Desktop Links - hidden on mobile and tablet, visible on desktop */}
        <nav className="hidden lg:flex flex-1 items-center justify-center h-full">
          <ul className="flex space-x-1 xl:space-x-2 text-gray-600 mx-auto">
            {navigationMenuItems.map((menuItem, index) => {
              const isActive = location.pathname === menuItem.path;
              return (
                <li key={index}>
                  <Link
                    to={menuItem.path}
                    className={`flex items-center px-2 xl:px-3 py-2 rounded-md transition-all duration-300 ${
                      isActive 
                        ? 'bg-green-50 text-green-600 font-medium' 
                        : 'hover:bg-gray-50 hover:text-green-600'
                    }`}
                  >
                    <span className="mr-1.5">{menuItem.icon}</span>
                    <span className="text-sm">{menuItem.menue}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Tablet Navigation - only visible on medium screens */}
        <nav className="hidden md:flex lg:hidden flex-1 items-center justify-center h-full">
          <ul className="flex space-x-1 mx-auto">
            {navigationMenuItems.map((menuItem, index) => {
              const isActive = location.pathname === menuItem.path;
              return (
                <li key={index}>
                  <Link
                    to={menuItem.path}
                    className={`flex items-center justify-center p-2 rounded-md transition-all duration-300 ${
                      isActive 
                        ? 'bg-green-50 text-green-600' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                    }`}
                    aria-label={menuItem.menue}
                    title={menuItem.menue}
                  >
                    <span>{menuItem.icon}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center space-x-2">
          {/* Sign In Button/User Dropdown - Hidden on extra small screens, visible on larger screens */}
          {!loading && (
            <div className="hidden sm:block">
              {isAuthenticated && user ? (
                <UserDropdown user={{ id: user._id, name: user.userName }} />
              ) : (
                <button
                  className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-green-600 text-white text-xs sm:text-sm rounded-full hover:bg-green-500 transition-all duration-300 shadow-sm hover:shadow flex items-center gap-1.5 sm:gap-2 font-medium"
                  onClick={handleSignInClick}
                >
                  <User size={14} className="hidden sm:inline" />
                  <span>Sign in</span>
                </button>
              )}
            </div>
          )}

          {/* Mobile Menu Button - Visible on mobile and tablet, hidden on desktop */}
          <button
            className="flex lg:hidden items-center justify-center p-1.5 sm:p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" /> : <Menu size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Dismissible by clicking outside */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Links - Slide down animation */}
      <div
        className={`lg:hidden fixed top-14 sm:top-16 md:top-[4.5rem] left-0 w-full h-auto max-h-[85vh] overflow-y-auto z-40 transform transition-all duration-300 ${
          isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white border-t border-gray-100 shadow-lg flex flex-col">
          {/* User info section on mobile when logged in */}
          {!loading && isAuthenticated && user && (
            <div className="flex items-center space-x-3 p-4 border-b border-gray-200 bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-medium shadow-sm">
                {user.userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-800">{user.userName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <ul className="py-2">
            {navigationMenuItems.map((menuItem, index) => {
              const isActive = location.pathname === menuItem.path;
              return (
                <li
                  key={index}
                  className={`cursor-pointer transition-all duration-300 ${
                    isActive ? "bg-green-50 text-green-600 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handleMenuItemClick(menuItem)}
                >
                  <span className="flex items-center py-3 px-4 w-full">
                    <span className="mr-3">{menuItem.icon}</span>
                    {menuItem.menue}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Show Sign In button on mobile if not showing in header */}
          <div className="border-t border-gray-200 py-3 px-4">
            {!loading && (
              <>
                {isAuthenticated && user ? (
                  <div className="flex flex-col space-y-2">
                    <button 
                      className="w-full py-2 px-4 text-gray-700 rounded-lg border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 transition duration-300"
                      onClick={() => {
                        navigate('/profile');
                        setIsMenuOpen(false);
                      }}
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </button>
                    <button 
                      className="w-full py-2 px-4 text-white bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center gap-2 transition duration-300"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                      <span>Sign out</span>
                    </button>
                  </div>
                ) : (
                  <div className="sm:hidden">
                    <button
                      className="w-full py-2.5 px-4 bg-green-600 text-white rounded-full hover:bg-green-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow font-medium"
                      onClick={handleSignInClick}
                    >
                      <User size={18} />
                      <span>Sign in</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;