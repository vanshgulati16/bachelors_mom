'use client'
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Mix and Matching...",
  "Stirring up ideas...",
  "Simmering flavors...",
  "Whisking creativity...",
  "Spicing things up...",
  "Blending ingredients...",
  "Cooking up suggestions...",
  "Tasting possibilities...",
];

const Loadingtext = () => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMessageIndex((prevIndex) => 
          (prevIndex + 1) % loadingMessages.length
        );
        setIsVisible(true);
      }, 500); // Half of the interval for smooth transition
    }, 2000); // Changed to 2000ms (2 seconds) for a slower cycle

    return () => clearInterval(interval);
  }, []);

  return (
    <p 
      className={`
        dark:text-white mt-4 
        transition-opacity duration-500 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {loadingMessages[currentMessageIndex]}
    </p>
  );
};

export default Loadingtext;