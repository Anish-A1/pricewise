"use client"; // Required for client-side logic like React Context

import Navbar from '@/components/Navbar';
import './globals.css';
import { UserProvider } from '../context/UserContext';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {/* Navbar and content stay within the max width */}
          <main className="max-w-10xl mx-auto">
            <Navbar />
            {children}
          </main>

          {/* Footer spans full width */}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
