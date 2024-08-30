'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RecipeModal from './RecipeModal';

export default function RecipeList({ recipes }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const getTypeBadgeColor = (type) => {
    return type === 'Veg' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {recipes.map((recipe, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="relative h-48">
            <Image 
              src={recipe.image} 
              alt={recipe.name}
              layout="fill"
              objectFit="cover"
            />
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
            <Button 
              className="w-full mt-4"
              onClick={() => setSelectedRecipe(recipe)}
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