"use client"; 
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const session = useSession();
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  function handleSignOut() {
    signOut({callbackUrl: '/'});
    setIsMenuOpen(false);
  }

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getLinkClassName = (href) => {
    const baseClasses = "px-3 py-1 rounded-lg text-sm";
    return pathname === href
      ? `${baseClasses} text-orange-600 font-extrabold`
      : `${baseClasses} hover:text-black text-gray-500`;
  };
  
  return (
    <nav className="fixed top-0 left-0 w-full z-50 h-16" style={{ backgroundColor: '#FFFDD0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center">
          <BrandLogo />
          <Badge variant="primary" className="ml-2">BETA</Badge>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/find" className={getLinkClassName("/find")}>
            Mix & Match
          </Link>
          <Link href="/weekPlanner" className={getLinkClassName("/weekPlanner")}>
            Week Meal Planner
          </Link>
          <Link href="/curation" className={getLinkClassName("/curation")}>
            Curation
          </Link>
          {session.data?.user ? (
          //    <div className="relative">
          //    <button
          //      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          //      className="focus:outline-none"
          //    >
          //      <Avatar className="w-8 h-8">
          //        <AvatarImage src={session.data.user.image || ""} />
          //        <AvatarFallback>{session.data.user.name?.[0] || "?"}</AvatarFallback>
          //      </Avatar>
          //    </button>
          //    {isDropdownOpen && (
          //      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          //        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          //          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeMenu}>
          //            Profile
          //          </Link>
          //          <Link href="/grocery-bag" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeMenu}>
          //            <div className="flex items-center">
          //              <ShoppingBag className="w-4 h-4 mr-1" />
          //              Inventory
          //            </div>
          //          </Link>
          //          <button
          //            onClick={handleSignOut}
          //            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          //          >
          //            Sign out
          //          </button>
          //        </div>
          //      </div>
          //    )}
          //  </div>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.data.user.image || ""} />
                    <AvatarFallback>{session.data.user.name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-[60] mt-2" align="end" sideOffset={5}>
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full" onClick={closeMenu}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/grocery-bag" className="w-full" onClick={closeMenu}>
                    <div className="flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      Inventory
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={handleSignOut} className="w-full text-left">
                    Sign out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium"
            >
              sign in
            </button>
          )}
        </div>

        <button
          aria-label="Open menu"
          className="md:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu />
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-50 md:hidden"
          >
            <div className="p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <BrandLogo />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="focus:outline-none"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col space-y-6 items-center text-center">
                <Link href="/find" className={getLinkClassName("/find")} onClick={closeMenu}>
                  Mix & Match
                </Link>
                <Link href="/weekPlanner" className={getLinkClassName("/weekPlanner")} onClick={closeMenu}>
                  Week Meal Planner
                </Link>
                <Link href="/curation" className={getLinkClassName("/curation")} onClick={closeMenu}>
                  Curation
                </Link>
                <Link href="/grocery-bag" className={getLinkClassName("/grocery-bag")} onClick={closeMenu}>
                  <div className="flex items-center">
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    Inventory
                  </div>
                </Link>
                {session.data?.user ? (
                  <>
                    <Link href="/profile" className={getLinkClassName("/profile")} onClick={closeMenu}>
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="px-3 py-1 text-gray-500 hover:text-black"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { signIn(); closeMenu(); }}
                    className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium"
                  >
                    sign in
                  </button>  
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
