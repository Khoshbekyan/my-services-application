// 📄 ՖԱՅԼ: app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hy">
      <body className="min-h-full flex flex-col">
    
        {children}
      </body>
    </html>
  );
}
