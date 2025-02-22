import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message, recipe, history } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Format chat history for context
    const formattedHistory = history
      .filter(msg => msg.role !== 'assistant' || !msg.content.includes("Hi! I'm your cooking assistant"))
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    const prompt = `You are a helpful, friendly cooking assistant. You have detailed knowledge about the following recipe:

Recipe Name: ${recipe.name}
Description: ${recipe.description}
Type: ${recipe.type}
Ingredients: ${JSON.stringify(recipe.ingredients)}
Instructions: ${JSON.stringify(recipe.instructions || recipe.recipe)}
Cooking Time: ${recipe.cookingTime}

Previous conversation context:
${formattedHistory}

Current User Question: ${message}

Based on the recipe details and our conversation history, please provide your response following these STRICT guidelines:
1. Each point should be wrapped in <li> tags
2. Keep each point concise and actionable
3. Use emojis sparingly (1-2 per response) for emphasis
4. No headers or sections - just list items
5. Maximum 4-5 points per response
6. No introductory text or conclusions
7. Reference previous conversation points when relevant
8. Maintain consistency with previous answers

Example format:
<ul>
<li>First point here</li>
<li>Second point here</li>
<li>Third point here</li>
</ul>

Remember to be friendly but direct in your response.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Ensure response is properly formatted as HTML list
    const formattedText = text.includes('<ul>')
      ? text
      : `<ul>${text
          .trim()
          .split('\n')
          .filter(line => line.trim())
          .map(line => line.startsWith('<li>') ? line : `<li>${line}</li>`)
          .join('')}</ul>`;

    return NextResponse.json({ response: formattedText });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
} 