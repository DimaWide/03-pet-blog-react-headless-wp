// src/components/Footer.js

import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'; 

const Footer = () => {
    return (
        <footer className="cmp-6-footer bg-gray-900 text-white py-8">
            <div className="wcl-container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Copyright text */}
                    <p className="text-sm mb-4 md:mb-0">© 2024 Your blog. All rights reserved.</p>

                    {/* Social media icons section */}
                    <div className="flex space-x-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-300">
                            <FaFacebookF /> 
                        </a>

                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-300">
                            <FaTwitter /> 
                        </a>

                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-300">
                            <FaInstagram /> 
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
