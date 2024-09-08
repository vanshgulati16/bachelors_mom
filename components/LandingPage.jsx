'use client'
import { useState, useEffect } from 'react'
import { Link as ScrollLink, Element } from 'react-scroll'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Utensils, CalendarDays, Refrigerator, Search, ChefHat, PartyPopper, ArrowRight, Check } from 'lucide-react'
import { AnimatedButton } from './AnimatedButton'

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

export default function LandingPage() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-red-50">
      {/* Hero Section */}
      <motion.section
        initial="initial"
        animate="animate"
        variants={staggerChildren}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&w=1920&q=80" 
            alt="Colorful ingredients"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            variants={fadeIn}
            className="mb-6 text-6xl font-bold"
          >
            Dish Dash Momzie
          </motion.h1>
          <motion.p 
            variants={fadeIn}
            className="mb-8 text-2xl"
          >
            Transform your ingredients into culinary masterpieces!
          </motion.p>
          <motion.div 
            variants={fadeIn}
            className="flex justify-center space-x-4"
          >
            <ScrollLink to="features" smooth={true} duration={500}>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Explore Features
              </Button>
            </ScrollLink>
            {/* <ScrollLink to="pricing" smooth={true} duration={500}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-black bg-white hover:bg-white hover:text-black hover:scale-105 transition-all duration-200"
              >
                View Pricing
              </Button>
            </ScrollLink> */}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <Element name="features">
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerChildren}
          className="bg-background min-h-screen flex items-center"
        >
          <div className="container mx-auto px-4 py-20">
            <motion.h2 variants={fadeIn} className="mb-12 text-center text-4xl font-bold text-primary">
              Our Features
            </motion.h2>
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div variants={fadeIn}>
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl text-primary">
                      <Utensils className="mr-2" />
                      Recipe Finder
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-secondary-foreground">Discover exciting new dishes based on the ingredients you already have. Say goodbye to food waste and hello to culinary creativity!</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl text-primary">
                      <CalendarDays className="mr-2" />
                      Weekly Planner
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-secondary-foreground">Plan your perfect week menu with ease. Our smart algorithm suggests dishes and snacks tailored according to your availabbilty and profession.</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </Element>

      {/* How It Works Section */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerChildren}
        className="min-h-screen flex items-center"
      >
        <div className="container mx-auto px-4 py-20">
          <motion.h2 variants={fadeIn} className="mb-12 text-center text-4xl font-bold text-primary">
            How It Works
          </motion.h2>
          <div className="mb-16">
            <motion.h3 variants={fadeIn} className="mb-8 text-center text-3xl font-semibold text-primary">
              Recipe Finder
            </motion.h3>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: Refrigerator, text: "Input your available ingredients" },
                { icon: Search, text: "Our app matches recipes to your ingredients" },
                { icon: ChefHat, text: "Cook and enjoy your new culinary creations" }
              ].map((item, index) => (
                <motion.div key={index} variants={fadeIn} className="text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <item.icon className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-lg text-secondary-foreground">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <motion.h3 variants={fadeIn} className="mb-8 text-center text-3xl font-semibold text-primary">
              Weekly Planner
            </motion.h3>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: CalendarDays, text: "Input your available ingredients for the week" },
                { icon: Utensils, text: "Receive a tailored menu suggestion" },
                { icon: PartyPopper, text: "No more 'Aaj kya khaoge?'" }
              ].map((item, index) => (
                <motion.div key={index} variants={fadeIn} className="text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <item.icon className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-lg text-secondary-foreground">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      {/* <Element name="pricing">
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerChildren}
          className="bg-background min-h-screen flex items-center"
        >
          <div className="container mx-auto px-4 py-20">
            <motion.h2 variants={fadeIn} className="mb-12 text-center text-4xl font-bold text-primary">
              Choose Your Plan
            </motion.h2>
            <Tabs defaultValue="free" className="mx-auto max-w-3xl">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="free">Free Tier</TabsTrigger>
                <TabsTrigger value="premium">Premium Tier</TabsTrigger>
              </TabsList>
              <TabsContent value="free">
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Free Tier</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {[
                          "Basic recipe suggestions",
                          "Limited ingredient input (up to 5)",
                          "Access to community recipes"
                        ].map((item, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="mr-2 h-5 w-5 text-primary" />
                            <span className="text-secondary-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Sign Up for Free
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              <TabsContent value="premium">
                <motion.div variants={fadeIn}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Premium Tier</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {[
                          "Advanced recipe suggestions with AI",
                          "Unlimited ingredient input",
                          "Exclusive premium recipes",
                          "Advanced party planning features",
                          "Nutritional information and meal planning"
                        ].map((item, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="mr-2 h-5 w-5 text-primary" />
                            <span className="text-secondary-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Get Premium
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.section>
      </Element> */}

      {/* Call to Action Section */}
      {/* <Element name="cta">
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerChildren}
          className="bg-gradient-to-r from-primary to-primary-foreground min-h-screen flex items-center"
        >
          <div className="container mx-auto px-4 py-20">
            <motion.h2 variants={fadeIn} className="mb-8 text-center text-4xl font-bold text-primary-foreground">
              Join Dish Dash Today!
            </motion.h2>
            <motion.div variants={fadeIn} className="mx-auto max-w-md">
              <Card className="border-4 border-primary-foreground">
                <CardContent className="pt-6">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-4">
                      <Label htmlFor="email" className="text-lg">Email</Label>
                      <Input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    {/* <Button className="w-full bg-primary text-primary-foreground text-lg hover:bg-primary/90" type="submit">
                      Get Early Access
                      <ArrowRight className="ml-2" size={20} />
                    </Button> 
                    <AnimatedButton className="w-full" type="submit"/>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>
      </Element> */}
    </div>
  )
}