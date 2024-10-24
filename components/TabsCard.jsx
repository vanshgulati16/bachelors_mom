"use client";

import Image from "next/image";
import { Tabs } from "./ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";

export function TabsCard() {
  const [hoveredImage, setHoveredImage] = useState(null);

const FeatureImage = ({ src, alt, text }) => (
  <motion.div 
    className="relative mb-4 group w-full"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300, damping: 10 }}
    onHoverStart={() => setHoveredImage(alt)}
    onHoverEnd={() => setHoveredImage(null)}
  >
    <div className="relative w-full aspect-video h-40 sm:h-48 md:h-56 lg:h-64">
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        className="rounded-lg"
      />
      <motion.div 
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: hoveredImage === alt ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {text}
      </motion.div>
    </div>
    <p className="mt-2 text-xs sm:text-sm md:text-base font-semibold text-center">{text}</p>
  </motion.div>
);

  const tabs = [
    {
      title: "About",
      value: "about",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 md:p-10 text-base md:text-xl font-medium text-white bg-gradient-to-br from-amber-200 to-orange-300 font-kaisei-decol">
          <h3 className="text-2xl md:text-4xl font-bold mb-6">About Dish Dash Momzie</h3>
          <p className="mb-4">Dish Dash Momzie is an AI-powered application designed to revolutionize your cooking experience. It helps users discover and explore recipes from various cuisines, eliminating the need for endless Google searches.</p>
          <p>Our app takes the ingredients you have on hand and curates personalized recipes tailored to your available items, making meal planning effortless and exciting.</p> 
        </div>
      ),
    },
    {
      title: "Features",
      value: "features",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl px-6 md:p-10 text-base md:text-xl font-medium text-white bg-gradient-to-br from-amber-200 to-orange-300 font-kaisei-decol">
          <h3 className="text-2xl md:text-4xl font-bold mb-6">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 items-center justify-center">
            <FeatureImage
              src="/img/mix&match.png" 
              alt="Mix & Match" 
              text="Mix & Match: Combine ingredients creatively"
              href="/find"
            />
            <FeatureImage
              src="/img/weeklyplanner.png" 
              alt="Weekly Planner" 
              text="Weekly Planner: Plan your meals effortlessly"
              href="/weekPlanner"
            />
          </div>
        </div>
      ),
      className: "text-lg md:text-xl font-bold px-6 py-3",
    },
    {
      title: "Mobile App",
      value: "mobile-app",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 md:p-10 text-base md:text-xl font-medium text-white bg-gradient-to-br from-amber-200 to-orange-300 font-kaisei-decol">
          <h3 className="text-2xl md:text-4xl font-bold mb-6">Mobile App</h3>
          <p>Our mobile app is currently in development. Stay tuned for updates on its release, bringing the power of Dish Dash Momzie to your pocket!</p>
        </div>
      ),
    },
    {
      title: "Contribute",
      value: "contribute",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 md:p-10 text-base md:text-xl font-medium text-white bg-gradient-to-br from-amber-200 to-orange-300 font-kaisei-decol">
          <h3 className="text-2xl md:text-4xl font-bold mb-6">Contribute to Dish Dash Momzie</h3>
          <p className="mb-4">Interested in contributing to our UI/UX or development? We'd love to hear from you!</p>
          <p>Contact us at: <a href="mailto:contribute@dishdash.com" className="underline hover:text-amber-100 font-bold">dishdashmomzie@gmail.com</a></p>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 md:px-8 lg:px-12">
      <div className="h-[30rem] md:h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-20 md:my-40">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}
