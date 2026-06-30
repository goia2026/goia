import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GOIA Huqqa Lounge",
  description: "Premium digital menu for GOIA Huqqa Lounge",
  applicationName: "GOIA Menu",
  appleWebApp: {
    capable: true,
    title: "GOIA Menu",
    statusBarStyle: "black-translucent"
  },
  formatDetection: {
    telephone: false
  },
  manifest: "/site.webmanifest"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#080807"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
