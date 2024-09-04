'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="relative" ref={dropdownRef}>
      <div
        className="border p-2 rounded-md flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option, index) => (
              <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                {option}
              </span>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <div className="p-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <ul className="max-h-60 overflow-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => toggleOption(option)}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => {}}
                  className="mr-2"
                />
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const PartyPlanner = () => {
  const [partyDetails, setPartyDetails] = useState({
    name: '',
    date: new Date(),
    guestCount: 10,
    partyType: [],
    dietaryRestrictions: [],
    availableIngredients: []
  });

  const [suggestedMenu, setSuggestedMenu] = useState(null);

  const partyTypes = [
    "House Party",
    "Official Party",
    "Casual Get-together",
    "Snack Party",
    "Dinner Party",
    "Cocktail Party"
  ];

  const dietaryOptions = [
    "Non Vegetarian",
    "Vegetarian",
    "Vegan",
    "Gluten-free",
    "Dairy-free",
    "Nut-free",
    "Halal",
    "Kosher"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPartyDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setPartyDetails(prev => ({ ...prev, date }));
  };

  const handleGuestCountChange = (value) => {
    setPartyDetails(prev => ({ ...prev, guestCount: value }));
  };

  const handlePartyTypeChange = (selectedTypes) => {
    setPartyDetails(prev => ({ ...prev, partyType: selectedTypes }));
  };

  const handleDietaryChange = (selectedDiets) => {
    setPartyDetails(prev => ({ ...prev, dietaryRestrictions: selectedDiets }));
  };

  const handleIngredientAdd = (e) => {
    e.preventDefault();
    const ingredient = e.target.ingredient.value;
    if (ingredient) {
      setPartyDetails(prev => ({
        ...prev,
        availableIngredients: [...prev.availableIngredients, ingredient]
      }));
      e.target.ingredient.value = '';
    }
  };

  const handlePlanParty = () => {
    // This is where you'd typically make an API call to your backend
    // For now, we'll just set some dummy data
    setSuggestedMenu({
      appetizers: ["Bruschetta", "Spinach and Artichoke Dip"],
      mainCourses: ["Grilled Chicken Skewers", "Vegetable Lasagna"],
      sideDishes: ["Caesar Salad", "Roasted Vegetables"],
      desserts: ["Chocolate Mousse", "Fruit Tart"],
      drinks: ["Sparkling Water", "Sangria"]
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Party Planner</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
          <Card>
            <CardHeader>
              <CardTitle>Suggested Menu</CardTitle>
            </CardHeader>
            <CardContent>
              {suggestedMenu ? (
                <div className="space-y-4">
                  {Object.entries(suggestedMenu).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="font-semibold capitalize">{category}</h3>
                      <ul className="list-disc list-inside">
                        {items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Fill in the party details and click "Plan My Party" to get menu suggestions.</p>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Party Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Party Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={partyDetails.name}
                    onChange={handleInputChange}
                    placeholder="Enter party name"
                  />
                </div>

                <div>
                  <Label>Party Date</Label>
                  <div className='flex justify-center item-center w-full border rounded'>
                    <Calendar
                        mode="single"
                        selected={partyDetails.date}
                        onSelect={handleDateChange}
                        className="rounded-md border"
                    />
                  </div>
                </div>

                <div>
                  <Label>Number of Guests</Label>
                  <div className='mt-2 mb-2'>
                    <Slider
                        min={1}
                        max={100}
                        step={1}
                        value={[partyDetails.guestCount]}
                        onValueChange={([value]) => handleGuestCountChange(value)}
                    />
                  </div>
                  <span>{partyDetails.guestCount} guests</span>
                </div>

                <div>
                  <Label htmlFor="partyType">Party Type</Label>
                  <MultiSelect
                    options={partyTypes}
                    selectedOptions={partyDetails.partyType}
                    onChange={handlePartyTypeChange}
                    placeholder="Select party type(s)"
                  />
                </div>

                <div>
                  <Label>Dietary Restrictions</Label>
                  <MultiSelect
                    options={dietaryOptions}
                    selectedOptions={partyDetails.dietaryRestrictions}
                    onChange={handleDietaryChange}
                    placeholder="Select dietary restrictions"
                  />
                </div>

                <div>
                  <Label>Available Ingredients</Label>
                  <form onSubmit={handleIngredientAdd} className="flex space-x-2">
                    <Input
                      name="ingredient"
                      placeholder="Enter an ingredient"
                    />
                    <Button type="submit">Add</Button>
                  </form>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {partyDetails.availableIngredients.map((ingredient, index) => (
                      <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <Button onClick={handlePlanParty} className="w-full">
                  Plan My Party
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartyPlanner;