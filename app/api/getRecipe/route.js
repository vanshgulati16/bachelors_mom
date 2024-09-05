import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { dish } = await req.json();

    if (!dish) {
      return NextResponse.json({ message: 'Dish name is required' }, { status: 400 });
    }

    console.log('Initializing Google Generative AI...');
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_API_KEY');
    console.log('Getting generative model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    console.log('Preparing prompt...');
    const prompt = `Generate a recipe for ${dish}. Include the following information:
      - Name of the dish
      - Brief description
      - Type (Veg or Non-Veg)
      - Cooking time
      - Cuisines (list)
      - Ingredients (list)
      - Instructions (numbered steps)
      - Source (if applicable)

      Format the response as a JSON object with the following structure:
      {
        "name": "Dish Name",
        "description": "Brief description",
        "type": "Veg or Non-Veg",
        "cookingTime": "Estimated cooking time",
        "cuisines": ["Cuisine1", "Cuisine2"],
        "ingredients": ["Ingredient1", "Ingredient2"],
        "instructions": ["Step 1", "Step 2"],
        "source": "Source of the recipe (if applicable)"
      }`;

    console.log('Generating content...');
    const result = await model.generateContent(prompt);
    console.log('Content generated. Parsing response...');
    const response = await result.response;
    const responseText = await response.text()
    // console.log(responseText)
    let newResponseText = responseText.replace(/```json/g, '').replace(/```/g, '').replace(/```JSON/g,'');
    // console.log(newResponseText)
    const recipeJson = JSON.parse(newResponseText);
    console.log(recipeJson)
    
    console.log('Sending response...');
    return NextResponse.json(recipeJson);
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ message: 'Error generating recipe', error: error.message }, { status: 500 });
  }
}