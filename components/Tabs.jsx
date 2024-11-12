'use client';
import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center space-x-2 mb-4">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === index
              ? 'bg-orange-300 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => onTabChange(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
