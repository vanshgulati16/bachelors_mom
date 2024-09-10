"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus, User } from "lucide-react";
import { motion } from "framer-motion";
import RecipeModal from "@/components/RecipeModal";
import { useSession } from "next-auth/react";
import NotLoggedInComponent from "@/components/NotLoggedIn";
import {Spinner} from "@/components/Spinner";

export default function ProfilePage() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchSavedRecipes();
    }
  }, [session]);

  // useEffect(() => {
  //   console.log("Selected Recipe:", selectedRecipe);
  // }, [selectedRecipe]);

  const fetchSavedRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/fetchSavedRecipes?userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        setSavedRecipes(data);
      } else {
        throw new Error('Failed to fetch saved recipes');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeBadgeColor = (type) => {
    return type === "Veg"
      ? "bg-green-500 hover:bg-green-600"
      : "bg-red-500 hover:bg-red-600";
  };

  const handleRemove = async (recipe, event) => {
    event.stopPropagation();
    try {
      const response = await fetch(`/api/removeSaved?id=${recipe._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSavedRecipes((prev) => prev.filter((r) => r._id !== recipe._id));
      } else {
        throw new Error('Failed to remove recipe');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {session ? (
        <div className="container mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 p-6">
            <div className="flex items-center space-x-4">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name}
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
                <h1 className="text-2xl font-bold dark:text-white">
                  {session.user.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Food Enthusiast
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 dark:text-white">
            Saved Recipes
          </h2>
          
          {isLoading ? (
            <>
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
            </>
          ) : savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map((recipe) => (
                <div
                  key={recipe._id}
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
                    <h3 className="text-xl font-bold mb-2 dark:text-white">
                      {recipe.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                      {recipe.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className={`${getTypeBadgeColor(recipe.type)} text-white`}>
                        {recipe.type}
                      </Badge>
                      {recipe.cuisines && recipe.cuisines.map((cuisine, index) => (
                        <Badge key={index} variant="secondary">
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {recipe.cookingTime}
                    </span>
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
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No saved recipes yet.</p>
          )}
          
          {selectedRecipe && (
            <RecipeModal
              recipe={selectedRecipe}
              onClose={() => setSelectedRecipe(null)}
            />
          )}
        </div>
      ) : (
        <NotLoggedInComponent />
      )}
    </>
  );
}
