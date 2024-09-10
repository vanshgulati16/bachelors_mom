'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format, differenceInDays, startOfMonth, endOfMonth, addDays } from 'date-fns';
import { Input } from './ui/input';
import MultiSelect from './MultiSelect';
import { toast } from "@/components/hooks/use-toast";
import WeeklyPlannerList from './WeeklyPlannerList';
import { Spinner } from './Spinner';
import Loadingtext from './LoadingText';
import { useSession } from 'next-auth/react';
import NotLoggedInComponent from './NotLoggedIn';
import ReviewButton from './ReviewButton';

const cuisines = ['Indian', 'Thai', 'Chinese', 'Continental', 'Korean', 'Japanese', 'Mexican', 'Mediterranean', 'Vietnamese'];
const mealTimes = ['Breakfast', 'Lunch', 'Dinner'];
const dietaryRestrictions = ['Non-Vegetarian', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb', 'Halal', 'Kosher'];
const basicSpices = ['Salt', 'Pepper', 'Cumin', 'Coriander', 'Turmeric', 'Red Chili Powder', 'Garam Masala'];

export default function WeeklyPlanner() {
  const [glossaryBought, setGlossaryBought] = useState('');
  const [profession, setProfession] = useState('');
  const [spicesAvailable, setSpicesAvailable] = useState('');
  const [additionalSpices, setAdditionalSpices] = useState('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const [planDuration, setPlanDuration] = useState('week');
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedMealTimes, setSelectedMealTimes] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {data: session} = useSession() 

  const handleDateRangeSelect = (range) => {
    if (range?.from) {
      const maxEndDate = addDays(range.from, 6); // 7 days including the start date
      const newTo = range.to && range.to > maxEndDate ? maxEndDate : range.to;
      
      setDateRange({ from: range.from, to: newTo });
      
      if (newTo) {
        const diffInDays = differenceInDays(newTo, range.from) + 1;
        setPlanDuration(diffInDays <= 7 ? 'week' : 'week'); // Always set to 'week' as it's max 7 days
      } else {
        setPlanDuration('');
      }
    } else {
      setDateRange({ from: null, to: null });
      setPlanDuration('');
    }
  };

  const clearDateSelection = () => {
    setDateRange({ from: null, to: null });
    setPlanDuration('');
  };

  const formatDateRange = () => {
    if (!dateRange.from) return '';
    if (!dateRange.to) return format(dateRange.from, 'MMM d, yyyy');
    return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
  };

  const generateMealPlan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const formattedDateRange = formatDateRange();
      const response = await fetch('/api/getWeeklyRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRange: formattedDateRange,
          planDuration,
          glossaryBought,
          spicesAvailable,
          additionalSpices,
          selectedDietaryRestrictions,
          selectedCuisines,
          selectedMealTimes,
          profession
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate meal plan');
      }
  
      const data = await response.json();
      setMealPlan(data.mealPlan);
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
              <Label className="dark:text-white">Spices</Label>
              <MultiSelect
                options={basicSpices}
                selectedOptions={spicesAvailable}
                onChange={setSpicesAvailable}
                placeholder="Choose spices"
              />
            </div>

            {/* <div>
              <Label htmlFor="spices" className="dark:text-white">Spices Available</Label>
              <Textarea
                id="spices"
                placeholder="Enter Spices (e.g., salt, pepper, red chilli powder)"
                value={spicesAvailable}
                onChange={(e) => setSpicesAvailable(e.target.value)}
                className="dark:bg-gray-800 dark:text-white"
              />
            </div> */}

            <div>
              <Label htmlFor="additionalSpices" className="dark:text-white">Additional Spices (Optional)</Label>
              <Textarea
                id="additionalSpices"
                placeholder="Enter additional spices (e.g., chicken masala, oregano, 5 season spices)"
                value={additionalSpices}
                onChange={(e) => setAdditionalSpices(e.target.value)}
                className="dark:bg-gray-700 dark:text-white"
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
                        !dateRange.from && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? formatDateRange() : <span>Select up to 7 days</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={handleDateRangeSelect}
                      month={currentMonth}
                      fromDate={monthStart}
                      toDate={monthEnd}
                      initialFocus
                      disabled={(date) => 
                        (dateRange.from && date > addDays(dateRange.from, 6)) ||
                        date < monthStart ||
                        date > monthEnd
                      }
                    />
                  </PopoverContent>
                </Popover>
                {dateRange.from && (
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
              disabled={isLoading || !dateRange.from || !dateRange.to}
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