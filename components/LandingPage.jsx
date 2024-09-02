'use client'
import { useState, useEffect } from 'react'
import { Link as ScrollLink, Element } from 'react-scroll'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Utensils, CalendarDays, Refrigerator, Search, ChefHat, PartyPopper, ArrowRight, Check } from 'lucide-react'

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
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&w=1920&q=80" 
            alt="Colorful ingredients"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="mb-6 text-6xl font-bold">Dish Dash</h1>
          <p className="mb-8 text-2xl">Transform your ingredients into culinary masterpieces!</p>
          <div className="flex justify-center space-x-4">
            <ScrollLink to="features" smooth={true} duration={500}>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">Explore Features</Button>
            </ScrollLink>
            <ScrollLink to="pricing" smooth={true} duration={500}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-black bg-white hover:bg-white hover:text-black hover:scale-105 transition-all duration-200"
              >
                View Pricing
              </Button>
            </ScrollLink>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Element name="features">
        <section className="bg-background min-h-screen flex items-center">
          <div className="container mx-auto px-4 py-20">
            <h2 className="mb-12 text-center text-4xl font-bold text-primary">Our Features</h2>
            <div className="grid gap-8 md:grid-cols-2">
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
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-primary">
                    <CalendarDays className="mr-2" />
                    Party Planner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-secondary-foreground">Plan your perfect party menu with ease. Our smart algorithm suggests dishes and snacks tailored to your event and available ingredients.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </Element>

      {/* How It Works Section */}
      <section className="min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-20">
          <h2 className="mb-12 text-center text-4xl font-bold text-primary">How It Works</h2>
          <div className="mb-16">
            <h3 className="mb-8 text-center text-3xl font-semibold text-primary">Recipe Finder</h3>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <Refrigerator className="h-12 w-12 text-primary" />
                </div>
                <p className="text-lg text-secondary-foreground">Input your available ingredients</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <Search className="h-12 w-12 text-primary" />
                </div>
                <p className="text-lg text-secondary-foreground">Our app matches recipes to your ingredients</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <ChefHat className="h-12 w-12 text-primary" />
                </div>
                <p className="text-lg text-secondary-foreground">Cook and enjoy your new culinary creations</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-8 text-center text-3xl font-semibold text-primary">Party Planner</h3>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <CalendarDays className="h-12 w-12 text-primary" />
                </div>
                <p className="text-lg text-secondary-foreground">Input party details and preferences</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <Utensils className="h-12 w-12 text-primary" />
                </div>
                <p className="text-lg text-secondary-foreground">Receive a tailored menu suggestion</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                  <PartyPopper className="h-12 w-12 text-primary" />
                </div>
                <p className="text-lg text-secondary-foreground">Host the perfect party with a curated menu</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Element name="pricing">
        <section className="bg-background min-h-screen flex items-center">
          <div className="container mx-auto px-4 py-20">
            <h2 className="mb-12 text-center text-4xl font-bold text-primary">Choose Your Plan</h2>
            <Tabs defaultValue="free" className="mx-auto max-w-3xl">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="free">Free Tier</TabsTrigger>
                <TabsTrigger value="premium">Premium Tier</TabsTrigger>
              </TabsList>
              <TabsContent value="free">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">Free Tier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="mr-2 h-5 w-5 text-primary" />
                        <span className="text-secondary-foreground">Basic recipe suggestions</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-5 w-5 text-primary" />
                        <span className="text-secondary-foreground">Limited ingredient input (up to 5)</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-5 w-5 text-primary" />
                        <span className="text-secondary-foreground">Access to community recipes</span>
                      </li>
                    </ul>
                    <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">Sign Up for Free</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="premium">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary">Premium Tier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="mr-2 h-5 w-5 text-primary" />
                        <span className="text-secondary-foreground">Advanced recipe suggestions with AI</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-5 w-5 text-primary" />
                        <span className="text-secondary-foreground">Unlimited ingredient input</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-5 w-5 text-primary" />
                        <span className="text-secondary-foreground">Exclusive premium recipes</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-5 w-5 text-primary" />
                        <span className="text-secondary-foreground">Advanced party planning features</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-5 w-5 text-primary" />
                        <span className="text-secondary-foreground">Nutritional information and meal planning</span>
                      </li>
                    </ul>
                    <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">Get Premium</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </Element>

      {/* Call to Action Section */}
      <Element name="cta">
        <section className="bg-gradient-to-r from-primary to-primary-foreground min-h-screen flex items-center">
          <div className="container mx-auto px-4 py-20">
            <h2 className="mb-8 text-center text-4xl font-bold text-primary-foreground">Join Dish Dash Today!</h2>
            <div className="mx-auto max-w-md">
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
                    <Button className="w-full bg-primary text-primary-foreground text-lg hover:bg-primary/90" type="submit">
                      Get Early Access
                      <ArrowRight className="ml-2" size={20} />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </Element>
    </div>
  )
}