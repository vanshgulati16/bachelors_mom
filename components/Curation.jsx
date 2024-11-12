import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CurationItem = ({ title, imageSrc }) => {
  const subfolder = title.toLowerCase().replace(/\s+/g, '-');
  return (
    <div>
      {/* <Link href={`/curation/${subfolder}`} className="flex flex-col items-center m-4"> */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
          <Image
            src={imageSrc}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">{title}</h2>
      {/* </Link> */}
    </div>
  );
};

const Curation = () => {
  const curationItems = [
    { title: "On Reel", imageSrc: "/img/iconic.png" },
    { title: "Celeb Influenced", imageSrc: "/img/celeb.png" },
    { title: "Festive Season", imageSrc: "/img/festival.jpg" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 font-kaisei-decol">Curations</h1>
      <p className="text-center text-gray-500 mb-8">
        We have curated some of the best designs from our community.
      </p>
      <p className="text-center text-red-500 mb-8">
        work in progress
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {curationItems.map((item, index) => (
          <CurationItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Curation;
