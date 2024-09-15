import { connectToDatabase } from "@/lib/utils";
import { Grocery } from "@/modals/groceryModal";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const groceries = await Grocery.find({ userId: session.user.id });
    return NextResponse.json(groceries, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching groceries' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { name, quantity, measurement, category } = await request.json();
    const grocery = new Grocery({
      userId: session.user.id,
      name,
      quantity,
      measurement,
      category
    });
    await grocery.save();
    return NextResponse.json({ message: 'Grocery added successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error adding grocery' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Grocery ID is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const result = await Grocery.findOneAndDelete({ _id: id, userId: session.user.id });
    
    if (!result) {
      return NextResponse.json({ message: 'Grocery not found or not authorized to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Grocery removed successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error removing grocery' }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ message: 'Grocery ID is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const { name, quantity, measurement, category } = await request.json();
    
    const updatedGrocery = await Grocery.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { name, quantity, measurement, category },
      { new: true }
    );

    if (!updatedGrocery) {
      return NextResponse.json({ message: 'Grocery not found or not authorized to update' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Grocery updated successfully', grocery: updatedGrocery }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating grocery' }, { status: 500 });
  }
}
