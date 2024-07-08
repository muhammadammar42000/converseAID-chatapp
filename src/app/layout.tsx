import type { Metadata } from "next";
import "./globals.css";

import { ChakraProviderLocal } from "@/providers/chakraProvider";
import { fonts } from "@/fonts/fonts";

export const metadata: Metadata = {
  title: "Trukkr | Tracking App",
  description: "Trukkr next gen tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.rubik.variable}>
      <body>
        <ChakraProviderLocal>
          <div>{children}</div>
        </ChakraProviderLocal>
      </body>
    </html>
  );
}
