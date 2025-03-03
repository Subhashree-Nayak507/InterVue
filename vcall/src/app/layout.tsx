import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ui/providers/ThemeProvider";
import ConvexClerkProvider from "@/components/ui/providers/convexClerkProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InterVue",
  description: "Remote Interview Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
           <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SignedIn>
            <div className="min-h-screen">
       <Navbar />
       <main className="px-4 sm:px-6 lg:px-8">{ children } </main>
        </div>
            </SignedIn>
        <SignedOut >
          <RedirectToSignIn />
        </SignedOut>
        </ThemeProvider>
      </body>
    </html>
    </ConvexClerkProvider>
  );
}
