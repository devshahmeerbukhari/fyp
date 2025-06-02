import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 py-6">
      <div className="container mx-auto px-4">
        {/* Main footer content - responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6">
          {/* About - full width on mobile */}
          <div className="mb-4 sm:mb-0">
            <h4 className="text-base font-semibold mb-3 text-gray-800">About</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your ultimate travel companion for exploring Pakistan's hotels, attractions, and more.
            </p>
            <div className="mt-4 flex flex-col space-y-2">
              <a href="mailto:info@pakistanipanorama.com" className="flex items-center text-sm text-gray-600 hover:text-green-600 transition duration-300">
                <Mail size={16} className="mr-2" />
                <span>info@pakistanipanorama.com</span>
              </a>
              <a href="tel:+923001234567" className="flex items-center text-sm text-gray-600 hover:text-green-600 transition duration-300">
                <Phone size={16} className="mr-2" />
                <span>+92 300 1234567</span>
              </a>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                <span>Lahore, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-4 sm:mb-0">
            <h4 className="text-base font-semibold mb-3 text-gray-800">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-green-600 transition duration-300">Home</Link></li>
              <li><Link to="/components/hotels" className="text-gray-600 hover:text-green-600 transition duration-300">Hotels</Link></li>
              <li><Link to="/things-to-do" className="text-gray-600 hover:text-green-600 transition duration-300">Things to Do</Link></li>
              <li><Link to="/restaurants" className="text-gray-600 hover:text-green-600 transition duration-300">Restaurants</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="mb-4 sm:mb-0">
            <h4 className="text-base font-semibold mb-3 text-gray-800">Support</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/help" className="text-gray-600 hover:text-green-600 transition duration-300">Help Center</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-green-600 transition duration-300">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-green-600 transition duration-300">Contact Us</Link></li>
            </ul>
          </div>

          {/* Connect - centered on mobile */}
          <div>
            <h4 className="text-base font-semibold mb-3 text-gray-800">Connect</h4>
            <div className="flex space-x-4 sm:justify-start justify-start">
              <a href="#" className="text-gray-500 hover:text-green-600 transition duration-300">
                <span className="sr-only">Facebook</span>
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600 transition duration-300">
                <span className="sr-only">Instagram</span>
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600 transition duration-300">
                <span className="sr-only">Twitter</span>
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section - stacked on mobile, row on larger screens */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-gray-500 mb-2 sm:mb-0">&copy; {new Date().getFullYear()} Pakistani Panorama</p>
          
          {/* Links - horizontal on all screen sizes */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/privacy" className="text-gray-500 hover:text-green-600">Privacy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-green-600">Terms</Link>
            <a href="#" onClick={(e) => {e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'})}} 
               className="text-gray-500 hover:text-green-600 flex items-center">
              <span className="mr-1">Back to Top</span>
              <ArrowUp size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 