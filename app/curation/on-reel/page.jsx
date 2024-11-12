'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { StickyScrollReveal } from '@/components/StickyScrollReveal';
import Tabs from '@/components/Tabs';

const OnReelPage = () => {
  const title = "On reel";

  const tabs = ["Sweet", "Munchies", "Meals"];
  const [activeTab, setActiveTab] = useState(0);

  const sweetContent = [
    {
      title: "Apple Tart",
      description:
        "A classic French dessert with a buttery pastry crust and a sweet, spiced apple filling.",
      recipe: `
Ingredients:
- 1 (9-inch) tart pan
- 1 (9-inch) pie crust
- 6 cups peeled and sliced apples
- 1/2 cup granulated sugar
- 1/4 cup packed brown sugar
- 1/4 cup all-purpose flour
- 1 tablespoon cinnamon
- 1/4 teaspoon nutmeg
- 1/4 cup cold unsalted butter, cut into small pieces

Instructions:
1. Preheat oven to 400 degrees F (200 degrees C).
2. Place the pie crust in the tart pan and press it into the bottom and up the sides.
3. In a large bowl, combine apples, granulated sugar, brown sugar, flour, cinnamon, and nutmeg.
4. Pour apple mixture into the pie crust.
5. Dot the top with butter.
6. Bake for 40-45 minutes, or until crust is golden brown and filling is bubbly.
7. Let cool completely before serving.
      `,
      imageUrl: "https://images.immediate.co.uk/production/volatile/sites/30/2022/08/French-apple-tart-ffb6034.jpg?resize=768,574",
    },
    {
      title: "Apple Crumble",
      description:
        "A warm, comforting dessert with a sweet, crisp topping.",
      recipe: `
Ingredients:
- 3 apples, peeled and diced
- 1/4 cup sugar
- 1 tbsp lemon juice
- 1/2 cup flour
- 1/4 cup rolled oats
- 1/4 cup brown sugar
- 1/4 cup butter, cold and cubed

Instructions:
1. Preheat oven to 375°F (190°C).
2. In a bowl, combine apples, sugar, and lemon juice.
3. In another bowl, combine flour, oats, brown sugar, and butter.
4. Use your fingers to rub the butter into the flour mixture until it resembles coarse crumbs.
5. Pour the apple mixture into a baking dish, then sprinkle the crumble topping evenly over the apples.
6. Bake for 30-35 minutes, or until the crumble is golden brown and the apples are tender.
7. Serve warm with ice cream or whipped cream.
      `,
      imageUrl: "https://images.immediate.co.uk/production/volatile/sites/30/2022/08/French-apple-tart-ffb6034.jpg?resize=768,574",
    },
    // {
    //   title: "Audio Editing",
    //   description: "Fine-tune your audio with advanced tools for mixing, equalizing, and adding sound effects.",
    //   content: (
    //     <div className="h-full w-full bg-gray-900 flex items-center justify-center text-white">
    //       <Image src="/img/celeb.png" width={300} height={300} alt="Audio editing tools" />
    //     </div>
    //   ),
    // },
  ];

  const munchiesContent = [
    {
      title: "Apple Tart",
      description:
        "A classic French dessert with a buttery pastry crust and a sweet, spiced apple filling.",
      recipe: `
Ingredients:
- 1 (9-inch) tart pan
- 1 (9-inch) pie crust
- 6 cups peeled and sliced apples
- 1/2 cup granulated sugar
- 1/4 cup packed brown sugar
- 1/4 cup all-purpose flour
- 1 tablespoon cinnamon
- 1/4 teaspoon nutmeg
- 1/4 cup cold unsalted butter, cut into small pieces

Instructions:
1. Preheat oven to 400 degrees F (200 degrees C).
2. Place the pie crust in the tart pan and press it into the bottom and up the sides.
3. In a large bowl, combine apples, granulated sugar, brown sugar, flour, cinnamon, and nutmeg.
4. Pour apple mixture into the pie crust.
5. Dot the top with butter.
6. Bake for 40-45 minutes, or until crust is golden brown and filling is bubbly.
7. Let cool completely before serving.
      `,
      imageUrl: "https://images.immediate.co.uk/production/volatile/sites/30/2022/08/French-apple-tart-ffb6034.jpg?resize=768,574",
    },
    {
      title: "Apple Crumble",
      description:
        "A warm, comforting dessert with a sweet, crisp topping.",
      recipe: `
Ingredients:
- 3 apples, peeled and diced
- 1/4 cup sugar
- 1 tbsp lemon juice
- 1/2 cup flour
- 1/4 cup rolled oats
- 1/4 cup brown sugar
- 1/4 cup butter, cold and cubed

Instructions:
1. Preheat oven to 375°F (190°C).
2. In a bowl, combine apples, sugar, and lemon juice.
3. In another bowl, combine flour, oats, brown sugar, and butter.
4. Use your fingers to rub the butter into the flour mixture until it resembles coarse crumbs.
5. Pour the apple mixture into a baking dish, then sprinkle the crumble topping evenly over the apples.
6. Bake for 30-35 minutes, or until the crumble is golden brown and the apples are tender.
7. Serve warm with ice cream or whipped cream.
      `,
      imageUrl: "https://images.immediate.co.uk/production/volatile/sites/30/2022/08/French-apple-tart-ffb6034.jpg?resize=768,574",
    },
    // {
    //   title: "Audio Editing",
    //   description: "Fine-tune your audio with advanced tools for mixing, equalizing, and adding sound effects.",
    //   content: (
    //     <div className="h-full w-full bg-gray-900 flex items-center justify-center text-white">
    //       <Image src="/img/audio-editing.png" width={300} height={300} alt="Audio editing tools" />
    //     </div>
    //   ),
    // },
  ];

  const mealsContent = [
    {
      title: "Real-time Commenting",
      description: "Leave time-stamped comments and feedback directly on the video timeline.",
      imageUrl: "/img/celeb.png",
    },
  ];

  const getActiveContent = () => {
    switch (activeTab) {
      case 0:
        return sweetContent;
      case 1:
        return munchiesContent;
      case 2:
        return mealsContent;
      default:
        return sweetContent;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-80">
        <Image
          src="/img/iconic.png"
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

export default OnReelPage;
