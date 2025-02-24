import type { Metadata } from "next";
import { GeistSans } from "@/app/fonts";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ClerkProvider } from '@clerk/nextjs';
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Emoji Maker",
  description: "Create custom emojis using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
          <Providers>
            <Header />
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}