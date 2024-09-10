'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Moon, Sun } from "lucide-react";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { useTheme } from "next-themes";
import RecipeList from './RecipeList';
import MultiSelect from '@/components/MultiSelect';
import dynamic from 'next/dynamic';
const LottieGenerateAnimation = dynamic(() => import('./LottieGenerateAnimation'), { ssr: false });
import LoadingText from './LoadingText';
import { useSession } from 'next-auth/react';
import NotLoggedInComponent from './NotLoggedIn';
import { Spinner } from './Spinner';
import ReviewButton from './ReviewButton';

// Initialize the Google Generative AI with your API key
// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_API_KEY');

const basicSpices = ['Salt', 'Pepper', 'Cumin', 'Coriander', 'Turmeric', 'Red Chili Powder', 'Garam Masala'];
const cuisines  = ['Indian', 'Thai', 'Chinese', 'Continental', 'Korean', 'Japanese', 'Mexican', 'Mediterranean', 'Vietnamese'];
const typeOfMeal  = ['Snacks', 'Meal', 'Munchies', 'Sweet Dish', 'Salads', 'Soup'];


export function RecipeGenerator() {
  const [ingredients, setIngredients] = useState('');
  const [additionalSpices, setAdditionalSpices] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpices, setSelectedSpices] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedTypeOfMeal, setSelectedTypeOfMeal] = useState([]);
  const [selectedMealTime, setSelectedMealTime] = useState([]);
  const [generatingImage, setGeneratingImage] = useState(false);
  const { theme, setTheme } = useTheme();

  const {data: session} = useSession()

  // Hitting the AI image generation api
  const generateImage = async (recipe) => {
    try {
      setGeneratingImage(true);
      const body = {
        topic: recipe.name,
        text: recipe.name,
        description: recipe.description,
      };
      const response = await fetch('/api/generateImageUsingAi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
      const data = await response.json();
      const newImageBase64String = `data:image/png;base64,${data.imageData}`;
      
      return newImageBase64String;
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
      return null;
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleGenerateRecipe = async () => {
    setIsLoading(true);
  // setError(null);
    try {
      const response = await fetch('/api/getRecipeMix&Match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          selectedSpices,
          additionalSpices,
          cookingTime,
          selectedCuisines,
          selectedTypeOfMeal,
          selectedMealTime
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch recipe: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
      }
      
      const data = await response.json();
      setRecipes(data);

      // If no image is available, generate one using AI
      // if (!data.image) {
      //   const generatedImage = await generateImage(data);
      //   if (generatedImage) {
      //     setRecipes((prevRecipe) => ({
      //       ...prevRecipe,
      //       image: generatedImage,
      //     }));
      //   }
      // }

    } catch (err) {
      // setError(`Failed to load recipe. Please try again. Error: ${err.message}`);
      console.error('Error fetching recipe:', err);
    } finally {
      setIsLoading(false);
    }
  };
  

  // const toggleTheme = () => {
  //   setTheme(theme === 'dark' ? 'light' : 'dark');
  // };

  return (
    <>
      {session ? (
        <div className="flex flex-col md:flex-row h-screen dark:bg-gray-800">
        {/* Left side - Output */}
        <div className="w-full md:w-3/5 p-6 bg-gray-100 dark:bg-gray-700 overflow-auto h-1/2 md:h-full">
        <div className='flex flex-row justify-between'>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Find your match</h2>
          <ReviewButton/>
        </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              {/* <LottieGenerateAnimation height={200} width={200} /> */}
              <Spinner/>
              <LoadingText />
            </div>
          ) : recipes.length > 0 ? (
            <RecipeList recipes={recipes} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Drop your ingredients on the right, and we'll cook up some epic recipes here. It's gonna be fire! 👨‍🍳✨
              </p>
            </div>
          )}
        </div>

        {/* Right side - Input */}
        <div className="w-full md:w-2/5 p-6 bg-white dark:bg-gray-800 overflow-auto h-1/2 md:h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-white">What you got?</h2>
            {/* <Button onClick={toggleTheme} variant="outline" size="icon">
              {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button> */}
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="ingredients" className="dark:text-white">Ingredients</Label>
              <Input
                id="ingredients"
                placeholder="Enter ingredients (e.g., tomato, onion, paneer)"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <Label className="dark:text-white">Spices</Label>
              <MultiSelect
                options={basicSpices}
                selectedOptions={selectedSpices}
                onChange={setSelectedSpices}
                placeholder="Choose spices"
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
              <Label className="dark:text-white">Type of Meal</Label>
              <MultiSelect
                options={typeOfMeal}
                selectedOptions={selectedTypeOfMeal}
                onChange={setSelectedTypeOfMeal}
                placeholder="Choose meal type"
              />
            </div>

            <div>
              <Label className="dark:text-white">Meal Time</Label>
              <MultiSelect
                options={['Breakfast', 'Lunch', 'Dinner']}
                selectedOptions={selectedMealTime}
                onChange={setSelectedMealTime}
                placeholder="Choose meal time"
              />
            </div>

            <div>
              <Label htmlFor="additionalSpices" className="dark:text-white">Additional Spices (Optional)</Label>
              <Input
                id="additionalSpices"
                placeholder="Enter additional spices"
                value={additionalSpices}
                onChange={(e) => setAdditionalSpices(e.target.value)}
                className="dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <Label className="dark:text-white">Cooking Time</Label>
              <div className="flex space-x-2">
                {['15-20 min', '25-35 min', '40-60 min'].map((time) => (
                  <Button
                    key={time}
                    variant={cookingTime === time ? 'default' : 'outline'}
                    onClick={() => setCookingTime(time)}
                    className="dark:bg-gray-700 dark:text-white dark:hover:bg-white dark:hover:text-black"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              className="w-full dark:bg-blue-600 dark:hover:bg-blue-700" 
              onClick={handleGenerateRecipe} 
              disabled={isLoading || generatingImage || !ingredients}
            >
              {isLoading ? 'Simmering flavors...' : 'Find Your Mix'}
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