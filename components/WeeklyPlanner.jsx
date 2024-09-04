'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import MultiSelect from './MultiSelect';
import { toast } from "@/components/hooks/use-toast";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_API_KEY');

const cuisines = ['Indian', 'Thai', 'Chinese', 'Continental', 'Korean', 'Japanese', 'Mexican', 'Mediterranean', 'Vietnamese'];
const mealTimes = ['Breakfast', 'Lunch', 'Dinner'];
const dietaryRestrictions = ['Non-Vegetarian', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb', 'Halal', 'Kosher'];

export default function WeeklyPlanner() {
  const [glossaryBought, setGlossaryBought] = useState('');
  const [spicesAvailable, setSpicesAvailable] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [planDuration, setPlanDuration] = useState('week');
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedMealTimes, setSelectedMealTimes] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setPlanDuration('week');
  };

  const handleMonthSelect = (date) => {
    setSelectedDate(date);
    setPlanDuration('month');
  };

  const clearDateSelection = () => {
    setSelectedDate(null);
    setPlanDuration('');
  };

  const formatDateRange = () => {
    if (!selectedDate) return '';
    if (planDuration === 'week') {
      const start = startOfWeek(selectedDate);
      const end = endOfWeek(selectedDate);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } else if (planDuration === 'month') {
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);
      return `${format(start, 'MMMM yyyy')}`;
    }
    return '';
  };

  const generateMealPlan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dateRange = formatDateRange();
      const prompt = `Generate a ${planDuration === 'week' ? '7-day' : '30-day'} meal plan for ${dateRange} based on the following:
        Groceries: ${glossaryBought}
        Spices available: ${spicesAvailable}
        Dietary restrictions: ${selectedDietaryRestrictions.join(', ')}
        Cuisines: ${selectedCuisines.join(', ')}
        Meal times: ${selectedMealTimes.join(', ')}

        For each day, provide meals for the selected meal times. Include a brief description and main ingredients for each meal.
        Format the response as a JSON array of objects, where each object represents a day:
        [
          {
            "day": 1,
            "date": "YYYY-MM-DD",
            "meals": [
              {
                "mealTime": "Breakfast",
                "dish": "Dish name",
                "description": "Brief description",
                "mainIngredients": ["ingredient1", "ingredient2"]
              }
            ]
          }
        ]
        `;

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      let responseText = await result.response.text();
    //   const response = await result.response;
    //   const responseText = response.text();
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '');
      console.log('API Response:', responseText);
      
      let generatedMealPlan;
      try {
        // Attempt to parse the JSON response
        generatedMealPlan = JSON.parse(responseText);
        console.log(generatedMealPlan)
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        console.error('Raw response:', responseText);
        throw new Error(`Failed to parse the generated meal plan. Error: ${parseError.message}`);
      }

      if (!Array.isArray(generatedMealPlan) || generatedMealPlan.length === 0) {
        console.error('Invalid meal plan structure:', generatedMealPlan);
        throw new Error('The generated meal plan is not in the expected format. Please try again.');
      }

      setMealPlan(generatedMealPlan);
      toast({
        title: "Meal Plan Generated",
        description: "Your meal plan has been successfully created!",
      });
    } catch (error) {
      console.error('Error generating meal plan:', error);
      setError(error.message || 'An error occurred while generating the meal plan. Please try again.');
      toast({
        title: "Error",
        description: error.message || 'Failed to generate meal plan. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      {/* Left side - Output */}
      <div className="w-3/5 p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Your Meal Plan</h2>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg dark:text-white">Generating your meal plan...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 dark:text-red-400">
            <p>{error}</p>
            <p className="mt-2">Please try again or contact support if the issue persists.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {mealPlan.map((day) => (
              <Card key={day.day} className="dark:bg-gray-700">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">
                    Day {day.day} - {format(new Date(day.date), 'MMMM d, yyyy')}
                  </h3>
                  {day.meals.map((meal, index) => (
                    <div key={index} className="mb-2">
                      <h4 className="font-medium dark:text-white">{meal.mealTime}: {meal.dish}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{meal.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Main ingredients: {meal.mainIngredients.join(', ')}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Right side - Input */}
      <div className="w-2/5 p-6 bg-white dark:bg-gray-900 overflow-auto">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Meal Plan Settings</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="glossary" className="dark:text-white">Groceries Bought</Label>
            <Textarea
              id="glossary"
              placeholder="Enter groceries you've bought"
              value={glossaryBought}
              onChange={(e) => setGlossaryBought(e.target.value)}
              className="dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label htmlFor="spices" className="dark:text-white">Spices Available</Label>
            <Textarea
              id="spices"
              placeholder="Enter available spices"
              value={spicesAvailable}
              onChange={(e) => setSpicesAvailable(e.target.value)}
              className="dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label className="dark:text-white">Plan Duration</Label>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-[280px] justify-start text-left font-normal ${
                      !selectedDate && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? formatDateRange() : <span>Select week/month</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    onMonthSelect={handleMonthSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {selectedDate && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearDateSelection}
                  aria-label="Clear date selection"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label className="dark:text-white">Dietary Restrictions</Label>
            <MultiSelect
              options={dietaryRestrictions}
              selectedOptions={selectedDietaryRestrictions}
              onChange={setSelectedDietaryRestrictions}
              placeholder="Choose dietary restrictions"
            />
          </div>

          <div>
            <Label className="dark:text-white">Cuisines</Label>
            <MultiSelect
              options={cuisines}
              selectedOptions={selectedCuisines}
              onChange={setSelectedCuisines}
              placeholder="Choose cuisines"
            />
          </div>

          <div>
            <Label className="dark:text-white">Meal Times</Label>
            <MultiSelect
              options={mealTimes}
              selectedOptions={selectedMealTimes}
              onChange={setSelectedMealTimes}
              placeholder="Choose meal times"
            />
          </div>

          <Button 
            className="w-full dark:bg-blue-600 dark:hover:bg-blue-700" 
            onClick={generateMealPlan} 
            disabled={isLoading || !selectedDate}
          >
            {isLoading ? 'Generating Plan...' : 'Generate Meal Plan'}
          </Button>
        </div>
      </div>
    </div>
  );
}