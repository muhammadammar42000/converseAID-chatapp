// app/providers.tsx
"use client";

import customTheme from "@/lib/chakratheme";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";

export function ChakraProviderLocal({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={customTheme} toastOptions={{ defaultOptions: { position: 'top-right' } }}>
      <ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
      {children}
    </ChakraProvider>
  );
}
