import { connectToDatabase } from "@/lib/utils";
import { SavedRecipe } from "@/modals/savedRecipe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Recipe ID is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const result = await SavedRecipe.findOneAndDelete({ _id: id, userId: session.user.id });
    
    if (!result) {
      return NextResponse.json({ message: 'Recipe not found or not authorized to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Recipe removed successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error removing saved recipe' }, { status: 500 });
  }
}