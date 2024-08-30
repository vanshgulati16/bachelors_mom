'use client'
import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RecipeModal({ recipe, onClose }) {
  if (!recipe) return null;

  const getTypeBadgeColor = (type) => {
    return type === 'Veg' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  };

  return (
    <Dialog open={!!recipe} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{recipe.name || 'Untitled Recipe'}</DialogTitle>
          <DialogDescription>{recipe.description || 'No description available.'}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="relative h-48 mb-4">
            {recipe.image ? (
              <Image 
                src={recipe.image} 
                alt={recipe.name || 'Recipe image'}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <span className="text-gray-500 dark:text-gray-400">No image available</span>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
               {/* <Badge variant={recipe.type === 'Veg' ? 'success' : 'destructive'} className="dark:bg-opacity-80">
                {recipe.type}
              </Badge> */}
              <Badge className={`${getTypeBadgeColor(recipe.type)} text-white`}>
                {recipe.type}
              </Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">{recipe.cookingTime || 'Time not specified'}</span>
            </div>
            {recipe.cuisines && recipe.cuisines.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipe.cuisines.map((cuisine, index) => (
                  <Badge key={index} className="dark:bg-blue-800 dark:text-blue-100">
                    {cuisine}
                  </Badge>
                ))}
              </div>
            )}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div>
                <h4 className="font-bold dark:text-white">Ingredients:</h4>
                <ul className="list-disc list-inside dark:text-gray-300">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}
            {recipe.recipe && recipe.recipe.length > 0 && (
              <div>
                <h4 className="font-bold dark:text-white">Instructions:</h4>
                <ol className="list-decimal list-inside dark:text-gray-300">
                  {recipe.recipe.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
            {recipe.source && (
              <p className="dark:text-gray-300"><strong>Source:</strong> {recipe.source}</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}