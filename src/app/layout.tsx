import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "LudaVia",
  description: "LudaVia investor prototype",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-ink font-sans text-warm">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
