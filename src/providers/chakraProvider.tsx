// app/providers.tsx
"use client";

import customTheme from "@/lib/chakratheme";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";

export function ChakraProviderLocal({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={customTheme}>
      <ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
      {children}
    </ChakraProvider>
  );
}
