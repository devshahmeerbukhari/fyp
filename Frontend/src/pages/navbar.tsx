import { useState } from "react";
import {LoginAndRegister} from "../components/LoginAndRegister/LoginAndRegister";
import { UserDropdown } from "../components/UserDropdown/UserDropdown";
import { Link } from "react-router-dom";

interface MenuItem {
  menue: string;
  path: string;
}

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  const navigationMenuItems = [
    { menue: "Lahore", path: "" },
    { menue: "Hotels", path: "/components/hotels" },
    { menue: "Things to Do", path: "#" },
    { menue: "Restaurants", path: "#" },
    { menue: "Flights", path: "#" },
  ];

  const handleSignInClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleMenuItemClick = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsMenuOpen(false); // Close the menu after selection
  };

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const handleValueChange = (user: boolean, newModalState: boolean) => {
    setUserLoggedIn(user);
    setIsModalOpen(newModalState);
  };

  return (
    <>
      <header className="flex relative overflow-visible justify-between items-center p-4 bg-white shadow-md w-full max-w-screen">
        {/* Logo */}
        <div className="text-2xl font-bold text-green-600 truncate flex-shrink-0">
          Pakistani Panorama
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:hidden lg:flex flex-1 justify-center">
          <ul className="flex space-x-8 text-gray-600">
            {navigationMenuItems.map((menuItem, index) => (
              <li key={index}>
                <Link
                  to={menuItem.path}
                  className="hover:text-green-600 transition duration-300 cursor-pointer"
                >
                  {menuItem.menue}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign In Button */}
        {userLoggedIn ? (
          <UserDropdown user={{id: "123", name: "User"}} />
        ) : (
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg lg:block hidden hover:bg-green-700 transition duration-300 flex-shrink-0"
            onClick={handleSignInClick}
          >
            Sign in
          </button>
        )}

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden block text-xl transition-transform duration-300 transform hover:scale-110"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </header>

      {/* Mobile Links */}
      <div
        className={`lg:hidden transform transition-transform duration-500 ${
          isMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
        } origin-top`}
      >
        <div className="bg-slate-200 flex flex-col items-center">
          <ul className="flex flex-col items-center space-y-4 pb-4 pt-2 w-full text-center">
            {navigationMenuItems.map((menuItem, index) => (
              <li
                key={index}
                className={`cursor-pointer py-2 px-4 rounded-md transition-all duration-300 transform hover:text-green-600 hover:scale-105 ${
                  selectedMenuItem?.menue === menuItem.menue ? "text-green-600 font-bold" : ""
                }`}
                onClick={() => handleMenuItemClick(menuItem)}
              >
                {menuItem.menue}
              </li>
            ))}
          </ul>

          {/* Sign In Button for Mobile */}
          {userLoggedIn ? (
            <UserDropdown user={{id: "123", name: "User"}} />
          ) : (
            <button
              className="px-4 py-2 mb-5 bg-green-600 text-white rounded-lg w-3/4 hover:bg-green-700 transition duration-300"
              onClick={() => {
                setIsMenuOpen(false);
                setIsModalOpen(true);
              }}
            >
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Modal for Login/Register Page */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-500">
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg transform transition-transform duration-500 scale-100">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-700 hover:text-black text-xl transition-transform duration-300 transform hover:scale-125"
            >
              &times;
            </button>
            <LoginAndRegister onValueChange={handleValueChange} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
