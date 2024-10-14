import type { Metadata } from "next";
import "./globals.css";

import { fonts } from "@/fonts/fonts";
import ReactQueryProvider from "@/utils/ReactQueryProvider";
export const metadata: Metadata = {
  title: "ConverseAID",
  description: "ConverseAID.Ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={fonts.rubik.variable} suppressHydrationWarning>
      <body>
        <ReactQueryProvider>
          {children}     </ReactQueryProvider>

      </body>
    </html>
  );
}
