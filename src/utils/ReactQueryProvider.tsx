"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ChakraProviderLocal } from "@/providers/chakraProvider";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();

    return (
        <ChakraProviderLocal>
            <QueryClientProvider client={queryClient}>
                <div>
                    {children}

                </div>
            </QueryClientProvider>
        </ChakraProviderLocal>
    );
};

export default ReactQueryProvider;