"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {FaBars, FaTimes} from "react-icons/fa";
import BrandLogo from "@/components/BrandLogo";
import {signIn, signOut, useSession} from "next-auth/react"
// import {useSession, signIn} from "next-auth/react"
// import {GlobalContext} from "@/app/contexts/UserContext";
// import {useContext} from "react";
// import ConnectWallet from "@components/ConnectWallet";
// import {doc, getDoc, setDoc} from "firebase/firestore";
// import {db} from "@/app/_lib/fireBaseConfig";
// import {adjectives, animals, uniqueNamesGenerator} from 'unique-names-generator';


export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const session = useSession()
    // const {data: session} = useSession()
    // const {userData, setUserData, selectedChain, setSelectedChain} = useContext(GlobalContext);

    // // Configuration for name generation
    // const nameConfig = {
    //     dictionaries: [adjectives, animals],
    //     separator: ' ',
    //     length: 2,
    //     style: 'capital'
    // };

    // async function getUserFromDb(userId) {
    //     const userRef = doc(db, "users", userId);
    //     const userSnap = await getDoc(userRef);

    //     if (!userSnap.exists()) {
    //         // Generate a random name
    //         const randomName = uniqueNamesGenerator(nameConfig);

    //         // Create a new user document in Firestore
    //         await setDoc(userRef, {
    //             id: userId,
    //             name: randomName,
    //             walletAddress: "",
    //             posts: [],
    //             votes: [],
    //             payouts: [],
    //             aiGeneratedImages: [],
    //             // Add any other fields you want to store
    //         });

    //         //update the user data
    //         setUserData({
    //             id: userId,
    //             name: randomName
    //         });
    //     } else {
    //         // Retrieve user data from Firestore
    //         const user_data = userSnap.data();
    //         setUserData({
    //             id: user_data.id,
    //             name: user_data.name,
    //         });

    //     }

    // }

    // useEffect(() => {
    //     if (session && !userData) {
    //         getUserFromDb(session.user.name)
    //     }
    //     // console.log("userData", userData)
    // }, [session, setUserData])

    return (
        <nav className="fixed top-0 py-1 left-0 w-full z-10 border-b bg-white">

            <div className=" mx-auto px-3">
                <div className="flex justify-between">
                    <div className="flex">
                        <BrandLogo/>
                    </div>
                    <div className="hidden md:flex gap-2 items-center justify-center font-bold">
                        <Link href="/find" className=" px-3 py-1 rounded-lg text-lg hover:text-black text-gray-500 ">
                            Mix & Match 
                        </Link>
                        <Link href="/party" className=" px-3 py-1 rounded-lg text-lg hover:text-black text-gray-500 ">
                            Party Planner
                        </Link>
                        <Link
                            href="/profile"
                            className=" px-3 py-1 rounded-lg text-lg hover:text-black text-gray-500 "
                        >Profile
                        </Link>

                    </div>
                    <div className="hidden md:flex gap-2 items-center justify-center font-bold  ">
                        {session.data?.user &&
                            <button
                                onClick={() => signOut()}
                                className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                            >Logout
                            </button>
                        }
                        {!session.data?.user &&
                            <button
                                onClick={() => signIn()}
                                className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                            >Login with Google
                            </button>
                        }
                    </div>

                    <button
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="md:hidden px-4 "

                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FaTimes/> : <FaBars/>}
                    </button>
                </div>
                <div className="md:hidden my-2 bg-white">
                    {isMenuOpen && (<div
                        className=" text-center flex flex-col gap-2  border-t border-theme-blue-light py-2  font-bold">
                        <Link className=" py-1 hover:text-black text-gray-500" href="/find">Mix & Match</Link>
                        <Link className=" py-1 hover:text-black text-gray-500" href="/party">Party Planner</Link>
                        <Link className=" py-1 hover:text-black text-gray-500" href="/profile">Profile</Link>
                         {session.data?.user && <div>
                            <button
                                onClick={() => signOut()}
                                className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                            >Logout
                            </button>
                        </div> }
                        {!session.data?.user &&  <div>
                            <button
                                onClick={() => signIn()}
                                className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                            >Login with Google
                            </button>
                        </div>}
                    </div>)}
                </div>

            </div>
        </nav>);
}