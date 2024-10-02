import React from 'react';
import Image from 'next/image';

const CuratedItemPage = ({ params }) => {
  const { slug } = params;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // This is placeholder data. In a real application, you'd fetch this data based on the slug.
  const items = [
    { id: 1, name: 'Item 1', image: '/placeholder1.jpg' },
    { id: 2, name: 'Item 2', image: '/placeholder2.jpg' },
    { id: 3, name: 'Item 3', image: '/placeholder3.jpg' },
    { id: 4, name: 'Item 4', image: '/placeholder4.jpg' },
    // ... add more items as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-64 mb-8">
        <Image
          src="/placeholder-banner.jpg"
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
        <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white bg-black bg-opacity-50">
          {title}
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-center">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CuratedItemPage;
