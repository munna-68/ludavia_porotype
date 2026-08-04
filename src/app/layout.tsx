import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { AppHeader } from "@/components/chrome/app-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "LudaVia",
  description: "LudaVia investor prototype",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <AppProviders>
          <AppHeader />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
