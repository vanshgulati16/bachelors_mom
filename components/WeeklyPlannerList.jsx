import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "@/components/hooks/use-toast";
import WeeklyPlannerModal from './WeeklyPlannerModal';

const MealCard = ({ meal, isModifying, onSelect, isSelected, onViewRecipe }) => (
  <Card className="mb-2 last:mb-0">
    <CardContent className="p-4">
      {isModifying ? (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`meal-${meal.mealTime}`}
            checked={isSelected}
            onCheckedChange={() => onSelect(meal)}
          />
          <label
            htmlFor={`meal-${meal.mealTime}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {meal.mealTime}: {meal.dish}
          </label>
        </div>
      ) : (
        <>
          <div className='flex flex-row justify-between items-center'>
            <div>
              <h4 className="font-medium dark:text-white">{meal.mealTime}: {meal.dish}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{meal.time}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Serves: {meal.servings}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => onViewRecipe(meal.dish)}>
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
        </>
      )}
    </CardContent>
  </Card>
);

const DayCard = ({ day, onChangeMeals }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // const [isModifying, setIsModifying] = useState(false);
  // const [selectedMeals, setSelectedMeals] = useState([]);
  const [localMeals, setLocalMeals] = useState(day.meals);
  const [recipeToView, setRecipeToView] = useState(null);

  // const handleModify = () => {
  //   setIsModifying(true);
  //   setIsExpanded(true);
  // };

  // const handleSelectMeal = (meal) => {
  //   setSelectedMeals(prev => 
  //     prev.includes(meal) ? prev.filter(m => m !== meal) : [...prev, meal]
  //   );
  // };

  // const handleChange = async () => {
  //   try {
  //     const updatedMeals = await onChangeMeals(day.day, selectedMeals);
  //     setLocalMeals(updatedMeals);
  //     toast({
  //       title: "Meals Updated",
  //       description: `Successfully updated meals for ${format(new Date(day.date), 'MMMM d, yyyy')}`,
  //     });
  //     setIsModifying(false);
  //     setSelectedMeals([]);
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to update meals. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleViewRecipe = (dish) => {
    setRecipeToView(dish);
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold dark:text-white">
            Day {day.day} - {format(new Date(day.date), 'EEEE, MMMM d, yyyy')}
          </h3>
          <div className="flex space-x-2">
            {/* {!isModifying && (
              <Button variant="outline" size="sm" onClick={handleModify}>
                Modify
              </Button>
            )}
            {isModifying && selectedMeals.length > 0 && (
              <Button variant="primary" size="sm" onClick={handleChange}>
                Change
              </Button>
            )} */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
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
                {localMeals.map((meal, index) => (
                  <MealCard 
                    key={`${meal.mealTime}-${index}`}
                    meal={meal} 
                    // isModifying={isModifying}
                    // onSelect={handleSelectMeal}
                    // isSelected={selectedMeals.includes(meal)}
                    onViewRecipe={handleViewRecipe}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <WeeklyPlannerModal 
        dish={recipeToView} 
        // servings={recipeToView.servings}
        onClose={() => setRecipeToView(null)} 
      />
    </Card>
  );
};

export default function WeeklyPlannerList({ mealPlan, onChangeMeals }) {
  return (
    <div className="space-y-4 p-6">
      {mealPlan.map((day) => (
        <DayCard key={day.day} day={day} onChangeMeals={onChangeMeals} />
      ))}
    </div>
  );
}