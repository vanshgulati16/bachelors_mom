import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const StickyScrollReveal = ({ content, className }) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const sectionHeight = 1 / cardLength;
    const currentSection = Math.min(Math.floor(latest / sectionHeight), cardLength - 1);
    setActiveCard(currentSection);
  });

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile view */}
      <div className="md:hidden">
        {content.map((item, index) => (
          <div key={item.title + index} className="mb-12">
            <div className="relative w-full h-64 mb-4">
              <Image
                src={item.imageUrl}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="px-4">
              <h2 className="text-2xl font-bold text-slate-100 mb-4">{item.title}</h2>
              <p className="text-lg text-slate-300 mb-4">{item.description}</p>
              {item.recipe && (
                <pre className="text-base text-black whitespace-pre-wrap bg-gradient-to-br from-orange-300 to-yellow-300 p-4 rounded-lg">
                  {item.recipe}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view */}
      <motion.div
        ref={ref}
        className="hidden md:block w-full"
        style={{ height: `${cardLength * 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center">
          <div className="relative w-full h-screen">
            {content.map((item, index) => (
              <motion.div
                key={item.title + index}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-10"
              >
                <div className={cn(
                  "w-1/2",
                  index % 2 === 0 ? "order-1" : "order-2"
                )}>
                  <div className="relative w-full h-96">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className={cn(
                  "w-1/2 px-10",
                  index % 2 === 0 ? "order-2" : "order-1"
                )}>
                  <h2 className="text-2xl font-bold text-slate-100 mb-4 mt-4">{item.title}</h2>
                  <p className="text-lg text-slate-300 mb-4">{item.description}</p>
                  {item.recipe && (
                    <pre className="text-base text-black whitespace-pre-wrap bg-gradient-to-br from-orange-300 to-yellow-300 p-4 rounded-lg">
                      {item.recipe}
                    </pre>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
