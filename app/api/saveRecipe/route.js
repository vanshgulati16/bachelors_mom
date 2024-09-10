import { connectToDatabase } from "@/lib/utils";
import { SavedRecipe } from "@/modals/savedRecipe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { name, description, image, ingredients, recipe, type, cookingTime, cuisines } = await req.json();
    
    const savedRecipe = new SavedRecipe({
      userId: session.user.id,
      name,
      description,
      image,
      ingredients,
      procedure: recipe,
      type,
      cookingTime,
      cuisines
    });

    await savedRecipe.save();
    return NextResponse.json({ message: 'Recipe saved successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error saving recipe' }, { status: 500 });
  }
}
