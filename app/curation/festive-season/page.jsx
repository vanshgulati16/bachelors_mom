'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { StickyScrollReveal } from '@/components/StickyScrollReveal';
import Tabs from '@/components/Tabs';

const FestiveSeasonPage = () => {
  const title = "Festive Season";

  const tabs = ["Holi", "Diwali", "Christmas"];
  const [activeTab, setActiveTab] = useState(0);

  const holiContent = [
    {
      title: "Holi Celebrations",
      description: "The festival of colors filled with joy and tradition",
      imageUrl: "/img/holi-celebration.jpg",
    },
    // Add more Holi-related content items
  ];

  const diwaliContent = [
    {
      title: "Diwali Festivities",
      description: "The festival of lights celebrating victory of light over darkness",
      imageUrl: "/img/diwali-celebration.jpg",
    },
    // Add more Diwali-related content items
  ];

  const christmasContent = [
    {
      title: "Christmas Joy",
      description: "The season of giving and spreading happiness",
      imageUrl: "/img/christmas-celebration.jpg",
    },
    // Add more Christmas-related content items
  ];

  const getActiveContent = () => {
    switch (activeTab) {
      case 0:
        return holiContent;
      case 1:
        return diwaliContent;
      case 2:
        return christmasContent;
      default:
        return holiContent;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-80">
        <Image
          src="/img/festival.jpg"
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
        <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white bg-black bg-opacity-30">
          {title}
        </h1>
      </div>
      <div className="mt-8">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className="pt-10">
        <StickyScrollReveal content={getActiveContent()} />
      </div>
    </div>
  );
};

export default FestiveSeasonPage;
