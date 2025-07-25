import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SupabaseInitializer } from "@/components/SupabaseInitializer";
import { Footer } from "@/components/Footer";

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
        url: "/images/Fur Finance Logo.png",
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
    images: ["/images/Fur Finance Logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-modern min-h-screen text-foreground`}>
        <div className="relative min-h-screen">
          {/* Subtle animated background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-happy-green/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-happy-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-happy-purple/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>
          
                                          {/* Main content */}
          <div className="relative z-10 flex flex-col min-h-screen">
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
        </div>
      </body>
    </html>
  );
}
