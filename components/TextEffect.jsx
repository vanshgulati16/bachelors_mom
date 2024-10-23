"use client";
import { TextGenerateEffect } from "./ui/text-generate-effect";

const words = `Your one stop Mommy for all your recipe needs`;

const aboutText = `Dish Dash Momzie is an AI-powered application designed to revolutionize your cooking experience. It helps users discover and explore recipes from various cuisines, eliminating the need for endless Google searches. Our app takes the ingredients you have on hand and curates personalized recipes tailored to your available items, making meal planning effortless and exciting.`

export function TextEffect() {
  return <TextGenerateEffect words={words} />;
}

export function AboutTextEffect() {
  return <TextGenerateEffect words={aboutText} />;
}
