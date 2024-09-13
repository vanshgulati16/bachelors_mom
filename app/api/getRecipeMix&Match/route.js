import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
     
    const { ingredients, selectedSpices, additionalSpices, cookingTime, selectedCuisines, selectedTypeOfMeal, selectedMealTime } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_API_KEY');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
     // First define
//  const startTime = process.hrtime();
 // To start it:
//  const elapsed = process.hrtime(startTime);
 
    const prompt = `I have ${ingredients}, ${selectedSpices.join(', ')}, ${additionalSpices}. Suggest 3 dishes I can make at home quickly (within ${cookingTime}) with their recipes and sources. The cuisines is ${selectedCuisines} and the type of meal is ${selectedTypeOfMeal}, for this meal of the day ${selectedMealTime}.For each dish, provide:
      1. Dish name
      2. Brief description
      3. Ingredients list
      4. Step-by-step recipe
      5. Estimated cooking time
      6. Source or origin of the recipe with link
      7. Whether the dish is Veg or Non Veg

      Format the response in following structure:
      [
        {
          "name": "Dish Name",
          "description": "Brief description",
          "ingredients": ["ingredient1", "ingredient2", ...],
          "recipe": ["step1", "step2", ...],
          "cookingTime": "Estimated time",
          "source": "Recipe source or origin",
          "cuisines": ["cuisine1", "cuisine2", ...],
          "type": "Veg" or "Non-Veg"
        },
        ...
      ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = await response.text();

    // console.log('Raw AI response:', responseText);

    // Remove any potential markdown code block syntax and trim whitespace
    let cleanedResponseText = responseText.replace(/```json\s*|\s*```/g, '').trim();

    // Attempt to parse the JSON
    let recipeJson;
    try {
      recipeJson = JSON.parse(cleanedResponseText);
      // console.log(recipeJson)
          // To end it:
    // const responseTimeInMs = elapsed[0] * 1000 + elapsed[1] / 1000000;
    // console.log('Response Time:', responseTimeInMs, 'ms');
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      
      // If parsing fails, attempt to find and extract the JSON array
      const jsonArrayMatch = cleanedResponseText.match(/\[[\s\S]*\]/);
      if (jsonArrayMatch) {
        try {
          recipeJson = JSON.parse(jsonArrayMatch[0]);
        } catch (secondParseError) {
          console.error('Second JSON Parse Error:', secondParseError);
          throw new Error('Failed to parse the generated recipe data');
        }
      } else {
        throw new Error('Failed to extract valid JSON from the response');
      }
    }

    // Ensure recipeJson is an array
    if (!Array.isArray(recipeJson)) {
      recipeJson = [recipeJson]; // Wrap in array if it's a single object
    }
    
    return NextResponse.json(recipeJson);
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ message: 'Error generating recipe', error: error.message }, { status: 500 });
  }
}