import { connectToDatabase } from "@/lib/utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mealPlan: [{}],
  dateRange: {
    from: Date,
    to: Date
  },
  createdAt: { type: Date, default: Date.now },
});

const MealPlan = mongoose.models.MealPlan || mongoose.model("MealPlan", MealPlanSchema);

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { mealPlan, dateRange } = await req.json();
    
    // Delete any existing meal plan for the user
    await MealPlan.deleteMany({ userId: session.user.id });

    const newMealPlan = new MealPlan({
      userId: session.user.id,
      mealPlan,
      dateRange
    });

    await newMealPlan.save();
    return NextResponse.json({ message: 'Meal plan saved successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error saving meal plan' }, { status: 500 });
  }
}
