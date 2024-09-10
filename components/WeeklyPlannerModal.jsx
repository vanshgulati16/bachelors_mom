'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from './Spinner';

export default function WeeklyPlannerModal({ dish, onClose }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dish) {
      fetchRecipe(dish);
    }else{
        setRecipe(null);
    }
  }, [dish]);

const fetchRecipe = async (dishName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/getRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dish: dishName }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch recipe: ${response.status} ${response.statusText}. ${errorData.message || ''}`);
      }
      
      const data = await response.json();
      setRecipe(data);

      // If no image is available, generate one using AI
      // if (!data.image) {
      //   const generatedImage = await generateImage(data);
      //   if (generatedImage) {
      //     setRecipe((prevRecipe) => ({
      //       ...prevRecipe,
      //       image: generatedImage,
      //     }));
      //   }
      // }

    } catch (err) {
      setError(`Failed to load recipe. Please try again. Error: ${err.message}`);
      console.error('Error fetching recipe:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const getTypeBadgeColor = (type) => {
    return type === 'Veg' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
  };

  if (!dish) return null;

  return (
    <Dialog open={!!dish} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{dish}</DialogTitle>
          <DialogDescription>Recipe details</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          {loading && (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          )}
          {/* {error && (
            <div className="text-red-500 text-center">{error}</div>
          )} */}
          {recipe && (
            <div className="space-y-4">
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
              {recipe.instructions && recipe.instructions.length > 0 && (
                <div>
                  <h4 className="font-bold dark:text-white">Instructions:</h4>
                  <ol className="list-decimal list-inside dark:text-gray-300">
                    {recipe.instructions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
              {/* {recipe.source && (
                <p className="dark:text-gray-300"><strong>Source:</strong> {recipe.source}</p>
              )} */}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}