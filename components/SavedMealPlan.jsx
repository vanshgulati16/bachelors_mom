import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Spinner } from './Spinner';
import WeeklyPlannerList from './WeeklyPlannerComponent/WeeklyPlannerList';

export default function SavedMealPlan() {
  const [savedMealPlan, setSavedMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedMealPlan = async () => {
      try {
        const response = await fetch('/api/getSavedMealPlan');
        if (!response.ok) {
          throw new Error('Failed to fetch saved meal plan');
        }
        const data = await response.json();
        setSavedMealPlan(data);
      } catch (error) {
        console.error('Error fetching saved meal plan:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedMealPlan();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  if (!savedMealPlan) {
    return <p>No saved meal plan found.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">This Week's Meal Plan</h2>
      <p className="mb-4">
        {format(new Date(savedMealPlan.dateRange.from), 'MMM d, yyyy')} - {format(new Date(savedMealPlan.dateRange.to), 'MMM d, yyyy')}
      </p>
      <WeeklyPlannerList mealPlan={savedMealPlan.mealPlan} />
    </div>
  );
}