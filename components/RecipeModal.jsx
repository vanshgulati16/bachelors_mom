'use client'
import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RecipeModal({ recipe, onClose }) {
  if (!recipe) return null;

  // console.log("Recipe in modal:", recipe);

  const getTypeBadgeColor = (type) => {
    return type === 'Veg' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  };

  // Handle both 'procedure' and 'recipe' keys for instructions
  const instructions = recipe.procedure || recipe.recipe || [];

  return (
    <Dialog open={!!recipe} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{recipe.name || 'Untitled Recipe'}</DialogTitle>
          <DialogDescription>{recipe.description || 'No description available.'}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            <div className="relative h-96">
              {recipe.image ? (
                <Image 
                  src={recipe.image} 
                  alt={recipe.name || 'Recipe image'}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md">
                  <span className="text-gray-500 dark:text-gray-400">No image available</span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
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
                <span className="text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  {recipe.cookingTime || 'Time not specified'}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <div>
                  <h4 className="font-bold dark:text-white mb-2">Ingredients:</h4>
                  <ul className="list-disc list-inside dark:text-gray-300">
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {instructions.length > 0 && (
                <div>
                  <h4 className="font-bold dark:text-white mb-2">Instructions:</h4>
                  <ol className="list-decimal list-inside dark:text-gray-300">
                    {instructions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* {recipe.source && (
              <p className="dark:text-gray-300"><strong>Source:</strong> {recipe.source}</p>
            )} */}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}