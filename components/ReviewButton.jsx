import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const pages = ['Mix & Match', 'Week Planner'];

export default function ReviewButton() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    try {
      const response = await fetch('https://formspree.io/f/xdknjbqn', {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Review submitted",
          description: "Thank you for your feedback!",
        })
        form.reset();
        setOpen(false);
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Leave a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Your Name" required />
          <Input type="email" name="email" placeholder="Your Email" required />
          <Input name="profession" placeholder="Your Profession" required />
          <Select name="page" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page} value={page}>{page}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea name="message" placeholder="Your Review" required />
          <Button type="submit">Submit Review</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}