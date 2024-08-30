import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const MultiSelect = ({ options, selectedOptions, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (option) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    onChange(updatedOptions);
  };

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="flex items-center justify-between w-full p-2 border rounded-md cursor-pointer bg-white dark:bg-gray-700 dark:border-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option, index) => (
              <span key={index} className="px-2 py-1 text-sm bg-purple-200 dark:bg-purple-700 rounded-full">
                {option}
              </span>
            ))
          ) : (
            <span className="text-gray-400 dark:text-gray-300">{placeholder}</span>
          )}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border rounded-md shadow-lg dark:border-gray-600">
          <div className="p-2">
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 pr-8 border rounded-md dark:bg-gray-600 dark:border-gray-500"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-2 top-2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${
                  selectedOptions.includes(option) ? 'bg-purple-100 dark:bg-purple-700' : ''
                }`}
                onClick={() => toggleOption(option)}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => {}}
                  className="mr-2"
                />
                <span>{option}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;