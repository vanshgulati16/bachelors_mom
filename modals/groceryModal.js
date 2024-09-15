import mongoose from 'mongoose';

const grocerySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  measurement: { type: String, required: true },
  category: { type: String, enum: ['ingredient', 'spice'], required: true },
}, { timestamps: true });

export const Grocery = mongoose.models.Grocery || mongoose.model('Grocery', grocerySchema);
