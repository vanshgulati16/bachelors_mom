import { connectToDatabase } from "@/lib/utils";
import { SavedRecipe } from "@/modals/savedRecipe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (userId !== session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const savedRecipes = await SavedRecipe.find({ userId: userId });
    return NextResponse.json(savedRecipes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching saved recipes' }, { status: 500 });
  }
}
