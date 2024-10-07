import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import WeeklyPlannerModal from './WeeklyPlannerModal';

function MealCard({ meal, onViewRecipe }) {
  return (
    <Card className="mb-2 last:mb-0">
      <CardContent className="p-4">
        <div className='flex flex-row justify-between items-center'>
          <div>
            <h4 className="font-medium dark:text-white">{meal.mealTime}: {meal.dish}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{meal.time}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Serves: {meal.servings}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewRecipe(meal.dish, meal.servings)}
          >
            View Recipe
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{meal.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {meal.mainIngredients.map((ingredient, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {ingredient}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DayCard({ day }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [recipeToView, setRecipeToView] = useState(null);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleViewRecipe = (dish, servings) => {
    setRecipeToView({ dish, servings});
  };

  const handleCloseModal = () => {
    setRecipeToView(null);
  };

  return (
    <Card className="mb-4 overflow-hidden cursor-pointer" onClick={handleToggleExpand}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold dark:text-white">
            Day {day.day} - {format(new Date(day.date), 'EEEE, MMMM d, yyyy')}
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            // onClick={handleToggleExpand}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mt-4 space-y-2">
                {day.meals.map((meal, index) => (
                  <MealCard 
                    key={`${meal.mealTime}-${index}`}
                    meal={meal} 
                    onViewRecipe={handleViewRecipe}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      {recipeToView && (
        <WeeklyPlannerModal 
          key={`${recipeToView.dish}-${recipeToView.servings}`}
          dish={recipeToView.dish}
          servings={recipeToView.servings}
          onClose={handleCloseModal} 
        />
      )}
    </Card>
  );
}

export default function WeeklyPlannerList({ mealPlan }) {
  return (
    <div className="space-y-4 p-6">
      {mealPlan.map((day) => (
        <DayCard key={day.day} day={day} />
      ))}
    </div>
  );
}

