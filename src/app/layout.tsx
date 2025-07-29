import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SupabaseInitializer } from "@/components/SupabaseInitializer";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fur Finance - Pet Expense Tracker",
  description: "A free, no-login tool to track your pet expenses, set budgets, and manage your furry friends' finances with ease.",
  keywords: "pet expenses, pet budget, pet finance, expense tracker, pet care",
  openGraph: {
    title: "Fur Finance – Track Pet Expenses",
    description: "A free, no-login tool to track your pet expenses, set budgets, and manage your furry friends' finances with ease.",
    url: "https://furfinance.vercel.app/",
    siteName: "Fur Finance",
    images: [
      {
        url: "/images/Fur Finance Logo New.png",
        width: 1200,
        height: 630,
        alt: "Fur Finance - Pet Expense Tracker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fur Finance – Track Pet Expenses",
    description: "A free, no-login tool to track your pet expenses, set budgets, and manage your furry friends' finances with ease.",
          images: ["/images/Fur Finance Logo New.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen text-foreground`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          
                                          {/* Main content */}
          <div className="flex flex-col min-h-screen">
            <SupabaseInitializer />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
                      
                      {/* Toast notifications */}
                      <Toaster 
                        position="top-right"
                        richColors
                        closeButton
                        duration={4000}
                      />
                      
                      {/* Vercel Analytics */}
                      <Analytics />
        </div>
      </body>
    </html>
  );
}
