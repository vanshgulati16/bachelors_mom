'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X, ChevronDown, ChevronUp } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';

const cuisines = ['Indian', 'Thai', 'Chinese', 'Continental', 'Korean', 'Japanese', 'Mexican', 'Mediterranean', 'Vietnamese', 'Italian'];
const mealTimes = ['Breakfast', 'Lunch', 'Dinner'];
const dietaryRestrictions = ['Non-Vegetarian', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb', 'Halal', 'Kosher'];
const basicSpices = ['Salt', 'Pepper', 'Cumin', 'Coriander', 'Turmeric', 'Red Chili Powder', 'Garam Masala', 'Ginger-Garlic Paste'];

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
  const [inventoryIngredients, setInventoryIngredients] = useState([]);
  const [inventorySpices, setInventorySpices] = useState([]);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [inventoryType, setInventoryType] = useState('');
  const [selectedInventoryItems, setSelectedInventoryItems] = useState([]);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const router = useRouter();
  const [numberOfPeople, setNumberOfPeople] = useState(); // New state variable for number of people

  const {data: session} = useSession() 

  // useEffect(() => {
  //   fetchInventory();
  // }, []);
  useEffect(() => {
    const loadData = async () => {
      await fetchInventory();
      setIsLoading(false);
    };

    if (session) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [session]);


  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/groceries');
      const data = await response.json();
      setInventoryIngredients(data.filter(item => item.category === 'ingredient').map(item => item.name));
      setInventorySpices(data.filter(item => item.category === 'spice').map(item => item.name));
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const openInventoryDialog = (type) => {
    setInventoryType(type);
    setSelectedInventoryItems([]);
    setIsInventoryDialogOpen(true);
  };

  const handleUseFromInventory = () => {
    if (inventoryType === 'ingredients') {
      setGlossaryBought(selectedInventoryItems);
    } else if (inventoryType === 'spices') {
      setSpicesAvailable(selectedInventoryItems);
    }
    setIsInventoryDialogOpen(false);
  };

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
    setIsInputOpen(false); // Close the dropdown
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
          profession,
          numberOfPeople // Include number of people in the request
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


  return (
    <>
    {session ? (
      <div className="flex flex-col md:flex-row h-screen dark:bg-gray-800 relative">
        {/* Left side - Output */}
        <div className="w-full md:w-3/5 h-full p-6 bg-gray-100 dark:bg-gray-700 overflow-auto pb-24 pt-10 md:pb-6">
          <div className='flex flex-row justify-between mb-4'>
            <h2 className="text-2xl font-bold dark:text-white">Your Meal Plan</h2>
            <ReviewButton/>
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Spinner/>
              <Loadingtext/>
            </div>
          ) : error ? (
            <div className="text-red-500 dark:text-red-400">
              <p>{error}</p>
              <p className="mt-2">Please try again or contact support if the issue persists.</p>
            </div>
          ) : mealPlan.length > 0 ? (
            <>
              <WeeklyPlannerList mealPlan={mealPlan} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Drop your ingredients on the right, and we'll cook up some epic recipes here. It's gonna be fire! 👨‍🍳✨
              </p>
            </div>
          )}
        </div> 

        {/* Right side - Input (dropdown on mobile, always visible on desktop) */}
        <div className="w-full md:w-2/5 bg-white dark:bg-gray-800 overflow-auto md:relative">
          {/* Mobile dropdown toggle */}
          <div className="md:hidden fixed bottom-4 left-4 right-4 bg-blue-600 rounded-lg shadow-lg">
            <Button
              onClick={() => setIsInputOpen(!isInputOpen)}
              className="w-full py-3 flex justify-between items-center text-white rounded-lg transition-colors duration-200"
            >
              <span>Meal Plan Settings</span>
              {isInputOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </Button>
          </div>

          {/* Input content */}
          <div className={`p-6 ${isInputOpen ? 'block' : 'hidden'} md:block fixed md:static bottom-20 left-4 right-4 bg-white dark:bg-gray-800 max-h-[75vh] md:max-h-full overflow-auto rounded-lg shadow-lg`}>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Meal Plan Settings</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="glossary" className="dark:text-white">Groceries Bought</Label>
                <Textarea
                  id="glossary"
                  placeholder="Enter Groceries (e.g., tomato, onion, paneer)"
                  value={glossaryBought}
                  onChange={(e) => setGlossaryBought(e.target.value)}
                  className="dark:bg-gray-800 dark:text-white mb-2"
                />
                <Button onClick={() => openInventoryDialog('ingredients')} variant="outline" size="sm">
                Use from Inventory
              </Button>
              </div>

              <div>
                <Label className="dark:text-white">Spices</Label>
                <MultiSelect
                  options={basicSpices}
                  selectedOptions={spicesAvailable}
                  onChange={setSpicesAvailable}
                  placeholder="Choose spices"
                  className="mb-2"
                />
                <div className='mt-2'>
                <Button onClick={() => openInventoryDialog('spices')} variant="outline" size="sm">
                  Use from Inventory
                </Button>
                </div>
              </div>

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
                <Label htmlFor="numberOfPeople" className="dark:text-white">Serving Sizes</Label>
                <Input
                  id="numberOfPeople"
                  type="number"
                  placeholder="Enter the number of people"
                  min="1"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
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

        <Dialog open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select {inventoryType} from Inventory</DialogTitle>
            </DialogHeader>
            {isLoading ? <Spinner/> : (
            <MultiSelect
              options={inventoryType === 'ingredients' ? inventoryIngredients : inventorySpices}
              selectedOptions={selectedInventoryItems}
              onChange={setSelectedInventoryItems}
              placeholder={`Choose ${inventoryType}`}
            />
            )}
            <DialogFooter>
              <Button onClick={handleUseFromInventory}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    ) : (
      <NotLoggedInComponent/>
    )}
    </>
  );
}