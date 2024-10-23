import { Inter, EB_Garamond, Didact_Gothic, Kaisei_Decol } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster"
import SessionWrapper from "@/components/SessionWrapper";
import { Analytics } from "@vercel/analytics/react"
import BackgroundWrapper from '@/components/BackgroundWrapper'

const ebGaramond = EB_Garamond({ 
  subsets: ["latin"],
  variable: '--font-eb-garamond',
});

const didactGothic = Didact_Gothic({
  weight: '400',
  subsets: ["latin"],
  variable: '--font-didact-gothic',
});

const kaiseiDecol = Kaisei_Decol({
  weight: '400',
  subsets: ["latin"],
  variable: '--font-kaisei-decol',
});

export const metadata = {
  title: "Dish Dash Momzie",
  description: "Your one stop Mommy for all your recipe needs",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={`${ebGaramond.variable} ${didactGothic.variable} ${kaiseiDecol.variable}`}>
          <Analytics/>
          <Providers attribute="class" defaultTheme="light" enableSystem>
            <Navbar/>
              <div className="pt-12">
                <main>
                <BackgroundWrapper>
                  {children}
                </BackgroundWrapper>
              </main>
              <Toaster />
            </div>
          </Providers>
        </body>
      </html>
    </SessionWrapper>
  );
}
