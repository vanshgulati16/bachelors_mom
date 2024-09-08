import React from 'react';
import Image from "next/image";
import Link from "next/link";

function BrandLogo() {
    return (
        <Link href="/landing" className="flex gap-2 flex-row items-center justify-center px-3 py-1">
            <Image
                src="/img/dishdash_logo.jpeg"
                alt="logo"
                width={50}
                height={50}
                className="w-auto h-10 rounded-xl overflow-clip"
            />
            <div
                className=" text-theme-blue-dark text-2xl"
            style={{fontWeight:900}}
            >Dish Dash Momzie
            </div>
        </Link>

    );
}

export default BrandLogo;