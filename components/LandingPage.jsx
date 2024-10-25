'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import {Search, Calendar, ChevronDown} from 'lucide-react'
import Link from 'next/link'
import Footer from './Footer'
import { TextEffect } from './TextEffect'
import { TabsCard } from './TabsCard'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const bounceAnimation = {
  y: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  }
}

const BouncingArrow = ({ onClick, bounce }) => (
  <motion.div
    className="flex flex-col items-center justify-center absolute bottom-4 left-0 right-0 mx-auto cursor-pointer"
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop"
    }}
    onClick={onClick}
  >
    <span className="text-primary font-bold mb-2">Know More</span>
    <ChevronDown className="h-8 w-8 text-primary" />
  </motion.div>
);


export default function LandingPage() {
  const [showFooter, setShowFooter] = useState(false)
  const tabsCardRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      // const windowHeight = window.innerHeight
      // const documentHeight = document.documentElement.scrollHeight

      if (scrollPosition > 0) {
        setShowFooter(true)
      } else {
        setShowFooter(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTabsCard = () => {
    tabsCardRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Main content */}
      <motion.section
        initial="initial"
        animate="animate"
        variants={staggerChildren}
        className="flex-grow flex flex-col md:flex-row items-center justify-center overflow-hidden relative p-4 pb-16 h-[95vh] z-10"
      >
        {/* Mobile view images (above content) */}
        <motion.div
          variants={staggerChildren}
          className="w-full md:hidden max-w-4xl relative h-1/4 mt-8 mb-10"
        >
          <DishImage 
            src="/img/pasta.jpeg" 
            name="Pasta Carbonara" 
            cuisine="Italian" 
            className="absolute left-0 top-0 z-10"
            bounce={-5}
          />
          <DishImage 
            src="/img/sushi.jpeg" 
            name="Sushi Roll" 
            cuisine="Japanese" 
            className="absolute left-1/4 top-1/3 z-20"
            bounce={5}
          />
          <DishImage 
            src="/img/Butter_Chicken.jpeg" 
            name="Butter Chicken" 
            cuisine="Indian" 
            className="absolute right-1/4 top-0 z-30"
            bounce={-5}
          />
          <DishImage 
            src="/img/taco.jpeg" 
            name="Tacos al Pastor" 
            cuisine="Mexican" 
            className="absolute right-0 top-1/2 z-40"
            bounce={5}
          />
        </motion.div>

        {/* Desktop view left side images */}
        <motion.div
          variants={staggerChildren}
          className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 px-10"
        >
          <DishImage 
            src="/img/pasta.jpeg" 
            name="Pasta Carbonara" 
            cuisine="Italian" 
            className="relative left-8 top-4"
            bounce={-5}
          />
          <DishImage 
            src="/img/sushi.jpeg" 
            name="Sushi Roll" 
            cuisine="Japanese" 
            className="relative -left-8 top-8"
            bounce={5}
          />
        </motion.div>

        {/* Center content */}
        <div className="container mx-auto px-4 max-w-3xl mt-16 md:mt-0">
          <motion.h1 
            variants={fadeIn}
            className="mb-6 text-4xl md:text-6xl font-bold text-center text-primary font-eb-garamond"
          >
            Dish Dash Momzie
          </motion.h1>
          <div 
            variants={fadeIn}
            className="mb-8 text-xl md:text-2xl text-center text-secondary-foreground"
          >
            {/* Your one stop Mommy for all your recipe needs */}
            <TextEffect className="font-eb-garamond" />
          </div>
          
          {/* Central buttons (visible on both mobile and desktop) */}
          <motion.div 
            variants={fadeIn}
            className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8 mb-12"
          >
            <Link href="/find" className="w-full md:w-auto">
              <Button size="lg" className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6">
                <Search className="mr-2 h-6 w-6" />
                Recipe Finder
              </Button>
            </Link>
            <Link href="/weekPlanner" className="w-full md:w-auto">
              <Button size="lg" className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6">
                <Calendar className="mr-2 h-6 w-6" />
                Weekly Planner
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Desktop view right side images */}
        <motion.div
          variants={staggerChildren}
          className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 px-10"
        >
          <DishImage 
            src="/img/Butter_Chicken.jpeg" 
            name="Butter Chicken" 
            cuisine="Indian" 
            className="relative right-8 top-4"
            bounce={-5}
          />
          <DishImage 
            src="/img/taco.jpeg" 
            name="Tacos al Pastor" 
            cuisine="Mexican" 
            className="relative -right-8 top-8"
            bounce={5}
          />
        </motion.div>

        {/* Bouncing Arrow */}
        <BouncingArrow onClick={scrollToTabsCard} />
      </motion.section>

      {/* New section: TabsCard */}
      <motion.section
        ref={tabsCardRef}
        initial="initial"
        animate="animate"
        variants={staggerChildren}
        className="py-16"
      >
        <TabsCard />
      </motion.section>

      {/* Footer */}
      <div className={`transition-opacity duration-300 ${showFooter ? 'opacity-100' : 'opacity-0'} z-10`}>
        <Footer />
      </div>
    </div>
  )
}

// Updated DishImage component with continuous bouncing animation
function DishImage({ src, name, cuisine, className, bounce }) {
  return (
    <motion.div
      variants={fadeIn}
      className={`text-center w-24 sm:w-32 md:w-48 lg:w-56 ${className}`}
      animate={{ y: [0, bounce] }}
      transition={bounceAnimation}
    >
      <img src={src} alt={name} className="w-full h-24 sm:h-32 md:h-48 lg:h-56 object-cover rounded-lg shadow-lg" />
      <p className="font-semibold text-primary text-xs sm:text-sm md:text-base mt-2">{name}</p>
      <p className="text-secondary-foreground text-xs md:text-sm">{cuisine}</p>
    </motion.div>
  )
}
