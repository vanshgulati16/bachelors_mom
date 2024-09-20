"use client"; 
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import BrandLogo from "@/components/BrandLogo";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingBag } from 'lucide-react'


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const session = useSession();
  const pathname = usePathname();

  function handleSignOut(){
    signOut({callbackUrl: '/'})
  }

  const getLinkClassName = (href) => {
    const baseClasses = "px-3 py-1 rounded-lg text-lg";
    return pathname === href
      ? `${baseClasses} text-orange-600 font-extrabold`
      : `${baseClasses} hover:text-black text-gray-500`;
  };

  return (
    <nav className="fixed top-0 py-1 left-0 w-full z-50 border-b bg-white dark:bg-gray-800 shadow-md">
      <div className="mx-auto px-3">
        <div className="flex justify-between">
          <div className="flex">
            <BrandLogo />
          </div>
          <div className="hidden md:flex gap-2 items-center justify-center font-bold">
            <Link href="/find" className={getLinkClassName("/find")}>
              Mix & Match
            </Link>
            {/* <Link href="/party" className=" px-3 py-1 rounded-lg text-lg hover:text-black text-gray-500 ">
                Party Planner
            </Link> */}
            <Link href="/weekPlanner" className={getLinkClassName("/weekPlanner")}>
              Week Meal Planner
            </Link>
          </div>
          <div className="hidden md:flex gap-2 items-center justify-center font-bold">
            {session.data?.user && (
              <span className="text-sm text-gray-600 mr-2">Hi, {session.data.user.name}</span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session.data?.user?.image || ""} />
                  <AvatarFallback>{session.data?.user?.name?.[0] || "?"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/grocery-bag" className="w-full">
                    <div className="flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      Inventory
                    </div>
                  </Link>
                </DropdownMenuItem>
                {session.data?.user ? (
                  <DropdownMenuItem>
                    <button onClick={handleSignOut} className="w-full text-left">
                      Logout
                    </button>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem>
                    <button onClick={() => signIn()} className="w-full text-left">
                      Login with Google
                    </button>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden px-4"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className="md:hidden my-2 bg-white">
          {isMenuOpen && (
            <div className="text-center flex flex-col gap-2 border-t border-theme-blue-light py-2 font-bold">
              <Link className={getLinkClassName("/find")} href="/find">
                Mix & Match
              </Link>
              {/* <Link className=" py-1 hover:text-black text-gray-500" href="/party">Party Planner</Link> */}
              <Link className={getLinkClassName("/weekPlanner")} href="/weekPlanner">
                Weekly Meal Planner
              </Link>
              <Link className={getLinkClassName("/Inventory")} href="/grocery-bag">
               <div className="flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    Inventory
                  </div>
              </Link>
              <Link className={getLinkClassName("/profile")} href="/profile">
                Profile
              </Link>
              {session.data?.user ? (
                <div>
                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <form action={
                    async ()=>{
                      // "use server"
                      await signIn("google")
                    }

                  }>
                    <button
                      // onClick={() => signIn()}
                      type= "submit"
                      className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                    >
                      Login with Google
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}