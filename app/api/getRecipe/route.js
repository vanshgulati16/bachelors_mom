import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    // console.log('Received body:', body);

    const { dish, servings } = body;

    if (!dish) {
      return NextResponse.json({ message: 'Dish name is required' }, { status: 400 });
    }

    if (!servings) {
      return NextResponse.json({ message: 'Servings are required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_API_KEY');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate a recipe for ${dish} for ${servings} people. Include the following information:
      - Name of the dish
      - Brief description
      - Type (Veg or Non-Veg)
      - Cooking time
      - Cuisines (list)
      - Ingredients (list, with quantities adjusted for ${servings} people)
      - Instructions (numbered steps)
      - Source (if applicable)
      - Servings (for ${servings} people)

      Format the response as a JSON object with the following structure:
      {
        "name": "Dish Name",
        "description": "Brief description",
        "type": "Veg or Non-Veg",
        "cookingTime": "Estimated cooking time",
        "cuisines": ["Cuisine1", "Cuisine2"],
        "ingredients": ["Ingredient1", "Ingredient2"],
        "instructions": ["Step 1", "Step 2"],
        "source": "Source of the recipe (if applicable)",
        "servings": "for ${servings} people"
      }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = await response.text()

    let newResponseText = responseText.replace(/```json/g, '').replace(/```/g, '').replace(/```JSON/g,'');
    const recipeJson = JSON.parse(newResponseText);
    
    return NextResponse.json(recipeJson);
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ message: 'Error generating recipe', error: error.message }, { status: 500 });
  }
}