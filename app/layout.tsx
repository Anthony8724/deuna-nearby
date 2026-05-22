import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { DeunaSessionProvider } from "@/context/deuna-session-context";
import { DemoGlobalChrome } from "@/components/demo/demo-global-chrome";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DeUna — Tu billetera digital",
  description:
    "Paga, transfiere y descubre comercios con beneficios exclusivos cerca de ti.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DeUna",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#f8f9fa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-dvh overflow-x-hidden bg-background font-sans text-foreground touch-manipulation">
        <DeunaSessionProvider>
          <DemoGlobalChrome />
          {children}
        </DeunaSessionProvider>
      </body>
    </html>
  );
}