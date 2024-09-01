'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus } from "lucide-react";
import { motion } from "framer-motion";
import RecipeModal from './RecipeModal';

export default function RecipeList({ recipes }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const getTypeBadgeColor = (type) => {
    return type === 'Veg' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  };

  const handleSave = (recipe, event) => {
    event.stopPropagation();
    setSavedRecipes((prev) => [...prev, recipe]);
    // Here you would typically also save this to a database or local storage
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {recipes.map((recipe, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer"  onClick={() => setSelectedRecipe(recipe)}>
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
                onClick={(e) => handleSave(recipe, e)}
                className="bg-white text-blue-500 hover:text-blue-600 dark:bg-gray-800 dark:text-blue-400 dark:hover:text-blue-500"
              >
                <BookmarkPlus className="h-4 w-4" />
                <span className="sr-only">Save recipe</span>
              </Button>
            </motion.div>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2 dark:text-white">{recipe.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{recipe.description}</p>
            <div className="flex justify-between items-center">
              {/* <Badge variant={recipe.type === 'Veg' ? 'success' : 'destructive'} className="dark:bg-opacity-80">
                {recipe.type}
              </Badge> */}
              <Badge className={`${getTypeBadgeColor(recipe.type)} text-white`}>
                {recipe.type}
              </Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">{recipe.cookingTime}</span>
            </div>
            {/* <Button 
              className="w-full mt-4"
              onClick={() => setSelectedRecipe(recipe)}
            >
              View Details
            </Button> */}
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
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}