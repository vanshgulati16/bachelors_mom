import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(request) {
  try {
    const {
      dateRange,
      planDuration,
      glossaryBought,
      spicesAvailable,
      selectedDietaryRestrictions,
      selectedCuisines,
      selectedMealTimes,
      profession,
      numberOfPeople,
      allergies
    } = await request.json();

    const prompt = `Generate a ${planDuration === 'week' ? '7-day' : '30-day'} meal plan for ${dateRange} based on the following:
      Groceries: ${glossaryBought}
      Spices available: ${spicesAvailable}
      Dietary restrictions: ${selectedDietaryRestrictions.join(', ')}
      Cuisines: ${selectedCuisines.join(', ')}
      Meal times: ${selectedMealTimes.join(', ')}
      Profession: ${profession}
      Number of people: ${numberOfPeople}
      ${allergies ? `Allergies to avoid: ${allergies}.` : ''}

      For each day, provide meals for the selected meal times. Include a brief description and main ingredients for each meal. Please ensure that the recipe does not include any of the mentioned allergies or ingredients to avoid.
      Format the response as a JSON array of objects, where each object represents a day:
      [
        {
          "day": 1,
          "date": "YYYY-MM-DD",
          "meals": [
            {
              "mealTime": "Breakfast",
              "dish": "Dish name",
              "description": "Brief description",
              "mainIngredients": ["ingredient1", "ingredient2"],
              "time": "time to make the dish",
              "servings": "number of people"
            }
          ]
        }
      ]
      Provide only the JSON array without any additional text.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let responseText = await result.response.text();
    responseText = responseText.replace(/```json\s*|\s*```/g, '').replace(/```Json\s*|\s*```/g, '').replace(/,\s*([\]}])/g, '$1').trim();
    
    let generatedMealPlan;
    try {
      generatedMealPlan = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.error('Raw response:', responseText);
      return NextResponse.json({ error: 'Failed to parse the generated meal plan.' }, { status: 500 });
    }

    if (!Array.isArray(generatedMealPlan) || generatedMealPlan.length === 0) {
      console.error('Invalid meal plan structure:', generatedMealPlan);
      return NextResponse.json({ error: 'The generated meal plan is not in the expected format.' }, { status: 500 });
    }

    return NextResponse.json({ mealPlan: generatedMealPlan });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return NextResponse.json({ error: 'An error occurred while generating the meal plan.' }, { status: 500 });
  }
}