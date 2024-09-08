'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Input } from './ui/input';
import MultiSelect from './MultiSelect';
import { toast } from "@/components/hooks/use-toast";
import WeeklyPlannerList from './WeeklyPlannerList';
import { Spinner } from './Spinner';
import Loadingtext from './LoadingText';
import { useSession } from 'next-auth/react';
import NotLoggedInComponent from './NotLoggedIn';
import ReviewButton from './ReviewButton';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_API_KEY');

const cuisines = ['Indian', 'Thai', 'Chinese', 'Continental', 'Korean', 'Japanese', 'Mexican', 'Mediterranean', 'Vietnamese'];
const mealTimes = ['Breakfast', 'Lunch', 'Dinner'];
const dietaryRestrictions = ['Non-Vegetarian', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb', 'Halal', 'Kosher'];

export default function WeeklyPlanner() {
  const [glossaryBought, setGlossaryBought] = useState('');
  const [profession, setProfession] = useState('');
  const [spicesAvailable, setSpicesAvailable] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [planDuration, setPlanDuration] = useState('week');
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedMealTimes, setSelectedMealTimes] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {data: session} = useSession() 

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
        Profession: ${profession}

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
                "time": "time to make the dish"
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

  // const parseMealPlanResponse = (responseText) => {
  //   const meals = [];
  //   const lines = responseText.split('\n').filter(line => line.trim() !== '');
    
  //   let currentMeal = null;
  //   let description = [];
  
  //   for (const line of lines) {
  //     const trimmedLine = line.trim();
      
  //     // Check for meal time headers
  //     if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
  //       if (currentMeal) {
  //         currentMeal.description = description.join(' ').trim();
  //         meals.push(currentMeal);
  //         description = [];
  //       }
  //       const mealTime = trimmedLine.replace(/\*\*/g, '').trim();
  //       currentMeal = { mealTime, dish: '', description: '', mainIngredients: [] };
  //     } 
  //     // Check for dish names (usually prefixed with a dash or bullet point)
  //     else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
  //       if (currentMeal) {
  //         currentMeal.dish = trimmedLine.substring(1).trim();
  //         // Extract main ingredients from the dish name
  //         currentMeal.mainIngredients = currentMeal.dish
  //           .split(' ')
  //           .filter(word => word.length > 3 && !['with', 'and', 'the', 'for'].includes(word.toLowerCase()));
  //       }
  //     } 
  //     // Anything else is considered part of the description
  //     else {
  //       description.push(trimmedLine);
  //     }
  //   }
  
  //   // Add the last meal if it exists
  //   if (currentMeal) {
  //     currentMeal.description = description.join(' ').trim();
  //     meals.push(currentMeal);
  //   }
  
  //   // Ensure all meals have all required properties
  //   return meals.map(meal => ({
  //     mealTime: meal.mealTime || 'Unspecified',
  //     dish: meal.dish || 'Not specified',
  //     description: meal.description || 'No description provided',
  //     mainIngredients: meal.mainIngredients.length ? meal.mainIngredients : ['Not specified']
  //   }));
  // };
  
  // // Example usage in the handleChangeMeals function
  // const handleChangeMeals = async (dayNumber, selectedMeals) => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const dateRange = formatDateRange();
  //     const prompt = `Update the meal plan for Day ${dayNumber} (${dateRange}) with the following changes:
  //       ${selectedMeals.map(meal => `${meal.mealTime}: ${meal.dish}`).join('\n')}
  
  //       Provide the updated meals for this day only, maintaining the same format as before.`;
  
  //     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  //     const result = await model.generateContent(prompt);
  //     let responseText = await result.response.text();
  //     console.log("update meal:", responseText)
  //     const updatedMeals = parseMealPlanResponse(responseText);
  
  //     if (!updatedMeals || updatedMeals.length === 0) {
  //       throw new Error('The generated meal plan is not in the expected format.');
  //     }
  
  //     setMealPlan(prevPlan => prevPlan.map(day => 
  //       day.day === dayNumber ? { ...day, meals: updatedMeals } : day
  //     ));
  
  //     toast({
  //       title: "Meal Plan Updated",
  //       description: `Successfully updated meals for Day ${dayNumber}.`,
  //     });
  
  //     return updatedMeals;
  //   } catch (error) {
  //     console.error('Error updating meal plan:', error);
  //     setError(error.message || 'An error occurred while updating the meal plan. Please try again.');
  //     toast({
  //       title: "Error",
  //       description: error.message || 'Failed to update meal plan. Please try again.',
  //       variant: "destructive",
  //     });
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };



  return (
    <>
    {session ? (
      <div className="flex flex-col lg:flex-row h-screen bg-gray-100 dark:bg-gray-800">
        {/* Left side - Output */}
        <div className="w-full lg:w-1/2 p-6 overflow-auto">
          <div className='flex flex-row justify-between mb-4'>
            <h2 className="text-2xl font-bold dark:text-white">Your Meal Plan</h2>
            <ReviewButton/>
          </div>
          {/* <p className='text-red-500'>Modify meal display to be fixed</p> */}
        {/* Left side - Output */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              {/* <p className="text-lg dark:text-white">Generating your meal plan...</p> */}
              <Spinner/>
              <Loadingtext/>
            </div>
          ) : error ? (
            <div className="text-red-500 dark:text-red-400">
              <p>{error}</p>
              <p className="mt-2">Please try again or contact support if the issue persists.</p>
            </div>
          ) : mealPlan.length > 0 ? (
            <WeeklyPlannerList mealPlan={mealPlan} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Drop your ingredients on the right, and we'll cook up some epic recipes here. It's gonna be fire! 👨‍🍳✨
              </p>
            </div>
          )}

        </div> 

        {/* Right side - Input */}
        <div className="w-full lg:w-1/2 p-6 bg-white dark:bg-gray-900 overflow-auto">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Meal Plan Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="glossary" className="dark:text-white">Groceries Bought</Label>
              <Textarea
                id="glossary"
                placeholder="Enter Groceries (e.g., tomato, onion, paneer)"
                value={glossaryBought}
                onChange={(e) => setGlossaryBought(e.target.value)}
                className="dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="spices" className="dark:text-white">Spices Available</Label>
              <Textarea
                id="spices"
                placeholder="Enter Spices (e.g., salt, pepper, red chilli powder)"
                value={spicesAvailable}
                onChange={(e) => setSpicesAvailable(e.target.value)}
                className="dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="profession" className="dark:text-white">Your Profession</Label>
              <Input
                id="profession"
                placeholder="Enter your profession"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
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
    ) : (
      <NotLoggedInComponent/>
    )}
    </>
  );
}