'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus, User } from "lucide-react";
import { motion } from "framer-motion";
import RecipeModal from '@/components/RecipeModal';

export default function Profile() {
  const [user, setUser] = useState({
    name: 'John Doe',
    avatar: null,
  });
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    // Fetch user data and saved recipes
    // This is where you'd typically make an API call
    // For now, we'll use mock data
    setUser({
      name: 'John Doe',
      avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${Math.random()}`,
    });
    setSavedRecipes([
      { id: 1, name: 'Pasta Carbonara', type: 'Non-Veg', cookingTime: '30 mins', description: 'Creamy pasta dish with eggs, cheese, and pancetta', image: '/api/placeholder/400/300' },
      { id: 2, name: 'Vegetable Stir Fry', type: 'Veg', cookingTime: '20 mins', description: 'Quick and healthy vegetable stir fry with soy sauce', image: '/api/placeholder/400/300' },
      { id: 3, name: 'Chicken Tikka Masala', type: 'Non-Veg', cookingTime: '45 mins', description: 'Flavorful Indian curry with tender chicken pieces', image: '/api/placeholder/400/300' },
    ]);
  }, []);

  const getTypeBadgeColor = (type) => {
    return type === 'Veg' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  };

  const handleRemove = (recipe, event) => {
    event.stopPropagation();
    setSavedRecipes((prev) => prev.filter(r => r.id !== recipe.id));
    // Here you would typically also update the database or local storage
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 p-6">
        <div className="flex items-center space-x-4">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={128}
              height={128}
              className="rounded-full"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User size={64} className="text-gray-400" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold dark:text-white">{user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">Food Enthusiast</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 dark:text-white">Saved Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedRecipes.map((recipe) => (
          <div 
            key={recipe.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => setSelectedRecipe(recipe)}
          >
            <div className="relative h-48">
              <Image 
                src={recipe.image}
                alt={recipe.name}
                layout="fill"
                objectFit="cover"
              />
              <motion.div 
                className="absolute top-2 right-2"
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => handleRemove(recipe, e)}
                  className="bg-white text-red-500 hover:text-red-600 dark:bg-gray-800 dark:text-red-400 dark:hover:text-red-500"
                >
                  <BookmarkPlus className="h-4 w-4" />
                  <span className="sr-only">Remove recipe</span>
                </Button>
              </motion.div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2 dark:text-white">{recipe.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{recipe.description}</p>
              <div className="flex justify-between items-center">
                <Badge className={`${getTypeBadgeColor(recipe.type)} text-white`}>
                  {recipe.type}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">{recipe.cookingTime}</span>
              </div>
              <Button 
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRecipe(recipe);
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}