"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ChakraProviderLocal } from "@/providers/chakraProvider";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();

    return (
        <ChakraProviderLocal>
            <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />

                <div>
                    {children}

                </div>
            </QueryClientProvider>
        </ChakraProviderLocal>
    );
};

export default ReactQueryProvider;