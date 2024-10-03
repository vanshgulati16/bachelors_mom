import { connectToDatabase } from "@/lib/utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MealPlan = mongoose.models.MealPlan || mongoose.model("MealPlan", mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mealPlan: [{}],
  dateRange: {
    from: Date,
    to: Date
  },
  createdAt: { type: Date, default: Date.now },
}));

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const savedMealPlan = await MealPlan.findOne({ userId: session.user.id }).sort({ createdAt: -1 });
    
    if (!savedMealPlan) {
      return NextResponse.json({ message: 'No saved meal plan found' }, { status: 404 });
    }

    return NextResponse.json(savedMealPlan, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching saved meal plan' }, { status: 500 });
  }
}
