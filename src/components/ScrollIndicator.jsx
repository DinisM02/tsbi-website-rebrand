import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const ScrollIndicator = () => {
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show scroll up button when user has scrolled down
      setShowScrollUp(scrollTop > 300);
      
      // Hide scroll down button when near bottom of page
      setShowScrollDown(scrollTop + windowHeight < documentHeight - 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Scroll Up Button */}
      {showScrollUp && (
        <div className="fixed bottom-20 right-6 z-40">
          <button
            onClick={scrollToTop}
            className="bg-primary hover:bg-primary/90 text-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scroll Down Button */}
      {showScrollDown && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={scrollToBottom}
            className="bg-primary hover:bg-primary/90 text-white rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 animate-bounce"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default ScrollIndicator;

