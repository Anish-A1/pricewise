//app\layout.server.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';  // Make sure Footer is imported
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* The main content is constrained to the max width */}
        <main className="max-w-10xl mx-auto">
          <Navbar />
          {children}
        </main>

        {/* Footer spans the full width */}
        <Footer />
      </body>
    </html>
  );
}
