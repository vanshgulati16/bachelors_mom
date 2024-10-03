'use client'
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/hooks/use-toast";
import { Pencil, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import NotLoggedInComponent from './NotLoggedIn';

const measurements = ['kg', 'g', 'L', 'mL', 'oz', 'lb', 'cup', 'tbsp', 'tsp', 'piece'];

export default function GroceryBag() {
  const [groceries, setGroceries] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newMeasurement, setNewMeasurement] = useState('');
  const [newCategory, setNewCategory] = useState('ingredient');
  const { toast } = useToast();
  const [editingId, setEditingId] = useState(null);
  const {data: session} = useSession()

  useEffect(() => {
    fetchGroceries();
  }, []);

  const fetchGroceries = async () => {
    try {
      const response = await fetch('/api/groceries');
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setGroceries(data);
      }
    } catch (error) {
      console.error('Error fetching groceries:', error);
    }
  };

  const handleAddGrocery = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/groceries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItem, quantity: newQuantity, measurement: newMeasurement, category: newCategory }),
      });
      if (response.ok) {
        setNewItem('');
        setNewQuantity('');
        setNewMeasurement('');
        fetchGroceries();
        toast({ title: "Grocery added successfully" });
      }
    } catch (error) {
      console.error('Error adding grocery:', error);
      toast({ title: "Error adding grocery", variant: "destructive" });
    }
  };

  const handleDeleteGrocery = async (id) => {
    try {
      const response = await fetch(`/api/groceries?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchGroceries();
        toast({ title: "Grocery deleted successfully" });
      }
    } catch (error) {
      console.error('Error deleting grocery:', error);
      toast({ title: "Error deleting grocery", variant: "destructive" });
    }
  };

  const handleModifyGrocery = async (id) => {
    const itemToEdit = groceries.find(g => g._id === id);
    setNewItem(itemToEdit.name);
    setNewQuantity(itemToEdit.quantity);
    setNewMeasurement(itemToEdit.measurement);
    setNewCategory(itemToEdit.category);
    setEditingId(id);
  };

  const handleUpdateGrocery = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/groceries?id=${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItem, quantity: newQuantity, measurement: newMeasurement, category: newCategory }),
      });
      if (response.ok) {
        setEditingId(null);
        setNewItem('');
        setNewQuantity('');
        setNewMeasurement('');
        fetchGroceries();
        toast({ title: "Grocery updated successfully" });
      }
    } catch (error) {
      console.error('Error updating grocery:', error);
      toast({ title: "Error updating grocery", variant: "destructive" });
    }
  };

  return (
    <>
    {session ? (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <form onSubmit={editingId ? handleUpdateGrocery : handleAddGrocery} className="mb-4 flex flex-col sm:flex-row gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
          className="flex-grow"
        />
        <div className="flex gap-2">
          <Input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            placeholder="Quantity"
            className="w-full sm:w-24"
          />
          <Select value={newMeasurement} onValueChange={setNewMeasurement}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Measurement" />
            </SelectTrigger>
            <SelectContent>
              {measurements.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={newCategory} onValueChange={setNewCategory}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ingredient">Ingredient</SelectItem>
              <SelectItem value="spice">Spice</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-grow">{editingId ? 'Update' : 'Add'}</Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
      <div>
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        {groceries.filter(g => g.category === 'ingredient').length > 0 ? (
          groceries.filter(g => g.category === 'ingredient').map((grocery) => (
            <div key={grocery._id} className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 p-2 border rounded">
              <span className="mb-2 sm:mb-0">{grocery.name} - {grocery.quantity} {grocery.measurement}</span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleModifyGrocery(grocery._id)} className="flex-grow sm:flex-grow-0">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteGrocery(grocery._id)} className="flex-grow sm:flex-grow-0">
                  <X className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No Ingredients added yet</p>
        )}
        
        <h2 className="text-xl font-semibold mb-2 mt-4">Spices</h2>
        {groceries.filter(g => g.category === 'spice').length > 0 ? (
          groceries.filter(g => g.category === 'spice').map((grocery) => (
            <div key={grocery._id} className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 p-2 border rounded">
              <span className="mb-2 sm:mb-0">{grocery.name} - {grocery.quantity} {grocery.measurement}</span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleModifyGrocery(grocery._id)} className="flex-grow sm:flex-grow-0">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteGrocery(grocery._id)} className="flex-grow sm:flex-grow-0">
                  <X className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No Spices added yet</p>
        )}
      </div>
    </div>
    ) : (
        <NotLoggedInComponent/>
    )}
    </>
  );
}
