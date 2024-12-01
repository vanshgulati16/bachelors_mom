import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
     
    const { ingredients, selectedSpices, additionalSpices, cookingTime, selectedCuisines, selectedTypeOfMeal, selectedMealTime, allergies } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_API_KEY');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
 
    const prompt = `I have ${ingredients}, ${selectedSpices.join(', ')}, ${additionalSpices}. Suggest 8 dishes I can make at home quickly (within ${cookingTime}) with their recipes and sources. The cuisines is ${selectedCuisines} and the type of meal is ${selectedTypeOfMeal}, for this meal of the day ${selectedMealTime} and avoid using these ingredients ${allergies}.For each dish, provide:
      1. Dish name
      2. Brief description
      3. Ingredients list with quantities
      4. Step-by-step recipe
      5. Estimated cooking time
      6. Source or origin of the recipe with link
      7. Whether the dish is Veg or Non Veg
      8. Serving Sizes (for how many people)

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
          "type": "Veg" or "Non-Veg",
          "servings": "number of people"
        },
        ...
      ]
      Provide only the JSON array without any additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = await response.text();

    // console.log('Raw AI response:', responseText);

    // Remove any potential markdown code block syntax and trim whitespace
    let cleanedResponseText = responseText.replace(/```json\s*|\s*```/g, '').replace(/,\s*([\]}])/g, '$1').trim();


    // Attempt to parse the JSON
    let recipeJson;
    try {
      recipeJson = JSON.parse(cleanedResponseText);
      // console.log(recipeJson)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      
      // If parsing fails, attempt to find and extract the JSON array
      // const jsonArrayMatch = cleanedResponseText.match(/\[[\s\S]*\]/);
      // if (jsonArrayMatch) {
      //   try {
      //     recipeJson = JSON.parse(jsonArrayMatch[0]);
      //   } catch (secondParseError) {
      //     console.error('Second JSON Parse Error:', secondParseError);
      //     throw new Error('Failed to parse the generated recipe data');
      //   }
      // } else {
      //   throw new Error('Failed to extract valid JSON from the response');
      // }
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