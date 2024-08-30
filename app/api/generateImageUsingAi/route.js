import { NextResponse } from "next/server";
import fetch from 'node-fetch';

export async function POST(request) {
    console.log("API route called");
    
    if (!request) {
        console.error("No request object");
        return new NextResponse('No request object', { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GETIMG_API_KEY;
    if(!apiKey) {
        console.error("API key not found");
        return new NextResponse('API key not found', { status: 403 });
    }

    try {
        const { body } = await request.json();
        console.log("Received body:", body);

        const recipeName = body.topic || body.text; // Use either topic or text as the recipe name
        const basePrompt = `Create a appetizing and visually appealing image of the dish "${recipeName}". The image should showcase the dish in a professional, mouth-watering style suitable for a cookbook or food blog. Ensure the composition is clean, well-lit, and focuses on the dish itself.`;
        console.log("Generated prompt:", basePrompt);

        const url = 'https://api.getimg.ai/v1/flux-schnell/text-to-image';
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                response_format: 'b64',
                output_format: 'jpeg',
                prompt: basePrompt,
                width: 1024,
                height: 720,
                steps: 5
            })
        };

        console.log("Sending request to getimg.ai");
        const response = await fetch(url, options);
        console.log("Received response from getimg.ai:", response.status);

        const json = await response.json();

        if (response.ok) {
            console.log("Successfully generated image");
            const frontendResponse = {
                imageData: json.image,
            };
            return new NextResponse(JSON.stringify(frontendResponse), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            console.error("Error from getimg.ai:", json);
            throw new Error(`${response.status}: ${JSON.stringify(json)}`);
        }
    } catch (error) {
        console.error("Error in API route:", error);
        return new NextResponse(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}