import mongoose from "mongoose";

const savedRecipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  description: String,
  image: String,
  ingredients: [String],
  procedure: [String],
  type: String,
  cookingTime: String
});

export const SavedRecipe = mongoose.models.SavedRecipe || mongoose.model("SavedRecipe", savedRecipeSchema);
