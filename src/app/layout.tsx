"use client";

import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen">
          <main className="flex-1">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}