'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus } from "lucide-react";
import { motion } from "framer-motion";
import RecipeModal from './RecipeModal';
import { useSession } from "next-auth/react";
import { useToast } from "@/components/hooks/use-toast";

export default function RecipeList({ recipes }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const getTypeBadgeColor = (type) => {
    return type === 'Veg' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  };

  const handleSave = async (recipe, event) => {
    event.stopPropagation();
    if (!session) {
      toast({
        title: "Not logged in",
        description: "Please log in to save recipes",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/saveRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...recipe,
          cuisines: recipe.cuisines || [] // Ensure cuisines are included
        }),
      });

      if (response.ok) {
        toast({
          title: "Recipe saved",
          description: "The recipe has been saved to your profile",
        });
      } else {
        throw new Error('Failed to save recipe');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save the recipe",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {recipes.map((recipe, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer" onClick={() => setSelectedRecipe(recipe)}>
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
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className={`${getTypeBadgeColor(recipe.type)} text-white`}>
                {recipe.type}
              </Badge>
              <Badge variant="secondary">
                serving: {recipe.servings}
              </Badge>
              {recipe.cuisines && recipe.cuisines.map((cuisine, index) => (
                <Badge key={index} variant="secondary">
                  {cuisine}
                </Badge>
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{recipe.cookingTime}</span>
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