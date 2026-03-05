import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="px-6 py-12 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/assets/Remifi logo.svg" alt="Payecho Logo" className="w-8 h-8" />
            <h3 className="text-2xl font-bold text-primary">Payecho</h3>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-primary mb-4">Quick Link</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-secondary hover:text-accent-green transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-secondary hover:text-accent-green transition-colors duration-200">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-secondary hover:text-accent-green transition-colors duration-200">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="text-secondary hover:text-accent-green transition-colors duration-200">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-secondary hover:text-accent-green transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-primary mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/resources/whitepaper"
                    className="text-secondary hover:text-accent-green transition-colors duration-200"
                  >
                    Download Whitepaper
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/smart-token"
                    className="text-secondary hover:text-accent-green transition-colors duration-200"
                  >
                    Smart Token
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/explorer"
                    className="text-secondary hover:text-accent-green transition-colors duration-200"
                  >
                    Blockchain Explorer
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/crypto-api"
                    className="text-secondary hover:text-accent-green transition-colors duration-200"
                  >
                    Crypto API
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/interest"
                    className="text-secondary hover:text-accent-green transition-colors duration-200"
                  >
                    Interest
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Systems & Social */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-primary mb-4">We accept following payment systems</h4>
              <div className="flex items-center space-x-4">
                {/* Payment system icons - placeholders */}
                <div className="w-12 h-8 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">VISA</span>
                </div>
                <div className="w-12 h-8 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">MC</span>
                </div>
                <div className="w-12 h-8 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">₿</span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-secondary mb-4">©2025 Payecho. All rights reserved</p>
              <div className="flex items-center space-x-4">
                {/* Social media icons - placeholders */}
                <a href="#" className="w-8 h-8 bg-tertiary rounded-full flex items-center justify-center hover:bg-accent-green transition-colors duration-200">
                  <span className="text-xs text-primary">f</span>
                </a>
                <a href="#" className="w-8 h-8 bg-tertiary rounded-full flex items-center justify-center hover:bg-accent-green transition-colors duration-200">
                  <span className="text-xs text-primary">i</span>
                </a>
                <a href="#" className="w-8 h-8 bg-tertiary rounded-full flex items-center justify-center hover:bg-accent-green transition-colors duration-200">
                  <span className="text-xs text-primary">y</span>
                </a>
                <a href="#" className="w-8 h-8 bg-tertiary rounded-full flex items-center justify-center hover:bg-accent-green transition-colors duration-200">
                  <span className="text-xs text-primary">t</span>
                </a>
                <a href="#" className="w-8 h-8 bg-tertiary rounded-full flex items-center justify-center hover:bg-accent-green transition-colors duration-200">
                  <span className="text-xs text-primary">in</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
