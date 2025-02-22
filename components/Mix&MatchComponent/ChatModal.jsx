'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DOMPurify from 'isomorphic-dompurify';

export default function ChatModal({ recipe, isOpen, onClose, allergies }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hi! What can i help you with for ${recipe.name}. Feel free to ask me about any modifications or substitutions you want to make to the recipe.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentlyTyping, setCurrentlyTyping] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    };

    scrollToBottom();
  }, [messages, currentlyTyping, isLoading]);

  const renderMessage = (content) => {
    if (content.includes('<ul>')) {
      const sanitizedContent = DOMPurify.sanitize(content);
      return (
        <div 
          className="chat-list"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
        />
      );
    }
    return content;
  };

  const typeMessage = async (text) => {
    setIsTyping(true);
    let currentText = '';
    
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setCurrentlyTyping(currentText);
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    
    setIsTyping(false);
    setCurrentlyTyping('');
    setMessages(prev => [...prev, { role: 'assistant', content: text }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          recipe: recipe,
          history: messages,
          allergies: allergies
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setIsLoading(false);
      await typeMessage(data.response);
    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
    }
  };

  // Function to parse allergies string into array
  const getAllergyBadges = () => {
    if (!allergies) return [];
    return allergies.split(',').map(allergy => allergy.trim()).filter(Boolean);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Ask About {recipe.name}</DialogTitle>
          {allergies && (
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Allergies:</span>
              {getAllergyBadges().map((allergy, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                >
                  Sea food
                </Badge>
              ))}
            </div>
          )}
        </DialogHeader>

        <ScrollArea 
          className="flex-grow p-4" 
          ref={scrollAreaRef}
        >
          <div className="space-y-4" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800'
                  } chat-message`}
                >
                  {msg.role === 'user' ? msg.content : renderMessage(msg.content)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-800 chat-message">
                  {renderMessage(currentlyTyping)}
                  <span className="animate-pulse">▋</span>
                </div>
              </div>
            )}
            {isLoading && !isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 p-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about this recipe..."
            className="flex-grow"
            disabled={isLoading || isTyping}
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || isTyping}
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 