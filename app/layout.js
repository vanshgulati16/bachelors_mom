// import { Inter } from "next/font/google";
// import "./globals.css";
// import { Providers } from "@/components/Providers";
// import Navbar from "@/components/Navbar";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Door Dash",
//   description: "Make dishes with your available ingredients",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//         <body className='pt-10'>
//         <Providers attribute="class" defaultTheme="system" enableSystem>
//         <Navbar/>
//         <div>
//           <main>
//             {children}
//           </main>
//         </div>
//       </Providers>
//         </body>
//     </html>
//   );
// }

import { Inter, EB_Garamond, Didact_Gothic } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster"
import SessionWrapper from "@/components/SessionWrapper";
import { Analytics } from "@vercel/analytics/react"

const ebGaramond = EB_Garamond({ 
  subsets: ["latin"],
  variable: '--font-eb-garamond',
});

const didactGothic = Didact_Gothic({
  weight: '400',
  subsets: ["latin"],
  variable: '--font-didact-gothic',
});

export const metadata = {
  title: "Dish Dash",
  description: "Make dishes with your available ingredients",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={`pt-10 ${ebGaramond.variable} ${didactGothic.variable}`}>
          <Analytics/>
          <Providers attribute="class" defaultTheme="light" enableSystem>
            <Navbar />
            <div>
              <main>
                {children}
              </main>
              <Toaster />
            </div>
          </Providers>
        </body>
      </html>
    </SessionWrapper>
  );
}