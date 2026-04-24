import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FloatingHomeButton } from "@/components/FloatingHomeButton";
import { SplashScreen } from "@/components/SplashScreen";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zoladyne Energy Dashboard",
  description: "Real-time energy monitoring dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark">
          <SplashScreen />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: 1 }}>
              {children}
            </div>
            <Footer />
          </div>
          <FloatingHomeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
