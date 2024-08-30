'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useTheme } from "next-themes";
import RecipeList from './RecipeList';
import MultiSelect from '@/components/MultiSelect';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_API_KEY');

const basicSpices = ['Salt', 'Pepper', 'Cumin', 'Coriander', 'Turmeric', 'Red Chili Powder', 'Garam Masala'];
const cuisines  = ['Indian', 'Thai', 'Chinese', 'Continental', 'Korean', 'Japanese'];
const typeOfMeal  = ['Snacks', 'Meal', 'Munchies', 'Sweet Dish', 'Salads'];


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
    try {
      const prompt = `I have ${ingredients}, ${selectedSpices.join(', ')}, ${additionalSpices}. Suggest 3 dishes I can make at home quickly (within ${cookingTime}) with their recipes and sources. The cuisines is ${selectedCuisines} and the type of meal is ${selectedTypeOfMeal}, for this meal of the day ${selectedMealTime}.For each dish, provide:
      1. Dish name
      2. Brief description
      3. Ingredients list
      4. Step-by-step recipe
      5. Estimated cooking time
      6. Source or origin of the recipe with link
      7. Whether the dish is Veg or Non Veg

      Format the response in following structure:
      [
        {
          "name": "Dish Name",
          "description": "Brief description",
          "ingredients": ["ingredient1", "ingredient2", ...],
          "recipe": ["step1", "step2", ...],
          "cookingTime": "Estimated time",
          "source": "Recipe source or origin",
          "cuisines": ["cuisine1", "cuisine2", ...],
          "type": "Veg" or "Non-Veg"
        },
        ...
      ]`;

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let generatedRecipes = [];
      try {
        generatedRecipes = JSON.parse(response.text());
      } catch (error) {
        console.error('Error parsing JSON:', error);
        generatedRecipes = [{ name: 'Error', description: 'Failed to parse recipe data. Please try again.' }];
      }

      // sending the recipe name to the ai to generate image 
      const recipesWithImages = await Promise.all(generatedRecipes.map(async (recipe) => {
        const imageUrl = await generateImage(recipe);
        return { ...recipe, image: imageUrl };
      }));

      setRecipes(recipesWithImages);
      // console.log(recipes)
      // setRecipes(generatedRecipes)
      
    } catch (error) {
      console.error('Error generating recipes:', error);
      setRecipes([{ name: 'Error', description: 'Sorry, there was an error generating the recipes. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen dark:bg-gray-800">
      {/* Left side - Output */}
      <div className="w-full md:w-3/5 p-6 bg-gray-100 dark:bg-gray-700 overflow-auto">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Generated Recipes</h2>
        {isLoading ? (
          <p className="dark:text-white">Generating recipes...</p>
        ) : (
          <RecipeList recipes={recipes} />
        )}
      </div>

      {/* Right side - Input */}
      <div className="w-full md:w-2/5 p-6 bg-white dark:bg-gray-800 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold dark:text-white">Recipe Options</h2>
          <Button onClick={toggleTheme} variant="outline" size="icon">
            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
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
          {/* Meal timing */}
          {/* <div>
            <Label className="dark:text-white">Meal Time</Label>
            <div className="flex space-x-2">
              {['Breakfast', 'Lunch', 'Dinner'].map((mealTime) => (
                <Button
                  key={mealTime}
                  variant={selectedMealTime === mealTime ? 'default' : 'outline'}
                  onClick={() => setSelectedMealTime(mealTime)}
                  className="dark:bg-gray-700 dark:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  {mealTime}
                </Button>
              ))}
            </div>
          </div> */}
          {/* additional spices */}
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
            // disabled={isLoading}
            disabled={isLoading || generatingImage}
          >
            {isLoading ? 'Generating...' : 'Generate Recipes'}
          </Button>
        </div>
      </div>
    </div>
  );
}