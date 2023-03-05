import { UIConfigProvider } from "@common/config-provider";
import ThemeApplier from "@common/theme/ThemeApplier";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import RouterProvider from "./RouterProvider";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <UIConfigProvider>
                <ThemeApplier>
                    <RouterProvider />
                </ThemeApplier>
            </UIConfigProvider>
        </QueryClientProvider>
    );
}

export default App;
