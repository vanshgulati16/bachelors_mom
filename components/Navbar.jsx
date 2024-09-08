"use client";
import React, { useState } from "react";
import Link from "next/link";
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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const session = useSession();

  return (
    <nav className="fixed top-0 py-1 left-0 w-full z-10 border-b bg-white">
      <div className="mx-auto px-3">
        <div className="flex justify-between">
          <div className="flex">
            <BrandLogo />
          </div>
          <div className="hidden md:flex gap-2 items-center justify-center font-bold">
            <Link href="/find" className="px-3 py-1 rounded-lg text-lg hover:text-black text-gray-500">
              Mix & Match
            </Link>
            {/* <Link href="/party" className=" px-3 py-1 rounded-lg text-lg hover:text-black text-gray-500 ">
                Party Planner
            </Link> */}
            <Link href="/weekPlanner" className="px-3 py-1 rounded-lg text-lg hover:text-black text-gray-500">
              Week Meal Planner
            </Link>
          </div>
          <div className="hidden md:flex gap-2 items-center justify-center font-bold">
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
                {session.data?.user ? (
                  <DropdownMenuItem>
                    <button onClick={() => signOut()} className="w-full text-left">
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
              <Link className="py-1 hover:text-black text-gray-500" href="/find">
                Mix & Match
              </Link>
              {/* <Link className=" py-1 hover:text-black text-gray-500" href="/party">Party Planner</Link> */}
              <Link className="py-1 hover:text-black text-gray-500" href="/weekPlanner">
                Weekly Meal Planner
              </Link>
              <Link className="py-1 hover:text-black text-gray-500" href="/profile">
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
                  <button
                    onClick={() => signIn()}
                    className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                  >
                    Login with Google
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}