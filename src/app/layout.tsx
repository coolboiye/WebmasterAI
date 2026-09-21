import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { NavBar } from "@/components/NavBar";
import { SiteFooter } from "@/components/SiteFooter";
import { ProgressProvider } from "@/lib/progress-context";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI Learning Portal",
    template: "%s · AI Learning Portal",
  },
  description:
    "An interactive AI learning portal for high school students: fundamentals, practical tools, and ethical use.",
};

export const viewport: Viewport = {
  themeColor: "#06121a",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const saved = localStorage.getItem("ai-portal-theme"); const theme = saved === "light" || saved === "dark" ? saved : "dark"; document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; } catch (_) {} })();`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col bg-canvas text-body">
        <a
          href="#main"
          className="no-print sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-[3px] focus:bg-brand focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-brand"
        >
          Skip to content
        </a>

        <AuthProvider>
          <ProgressProvider>
            <NavBar />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
