import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GOIA Huqqa Lounge",
  description: "Carte digitale premium de GOIA Huqqa Lounge",
  applicationName: "Carte GOIA",
  appleWebApp: {
    capable: true,
    title: "Carte GOIA",
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
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
