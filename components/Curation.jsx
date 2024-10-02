import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CurationItem = ({ title, imageSrc }) => {
  return (
    <div>
    {/* <Link href={`/curated/${title.toLowerCase().replace(/\s+/g, '-')}`} className="flex flex-col items-center m-4"> */}
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
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Curations</h1>
      <p className="text-center text-red-500 pb-10">
        Work In Progress!!!!!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <CurationItem title="Iconic" imageSrc="/img/iconic.png" />
        <CurationItem title="Celeb Influenced" imageSrc="/img/celeb.png" />
        <CurationItem title="Festive Season" imageSrc="https://i.pinimg.com/564x/7d/c3/53/7dc3531a907f14f26882a1a93de6a06f.jpg" />
      </div>
    </div>
  );
};

export default Curation;
