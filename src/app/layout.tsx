import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { NavBar } from "@/components/NavBar";
import { ProgressProvider } from "@/lib/progress-context";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Learning Portal",
  description:
    "An interactive AI learning portal for high school students: fundamentals, practical tools, and ethical use.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <AuthProvider>
          <ProgressProvider>
            <NavBar />
            <main>{children}</main>
            <footer className="footer no-print">
              <div className="page">
                <p className="text-secondary" style={{ fontSize: "0.875rem" }}>
                  Built for the TSA Webmaster event — [Your Chapter Name], 2026–27.
                </p>
              </div>
            </footer>
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
