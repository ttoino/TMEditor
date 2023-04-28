import { UIConfigProvider } from "@common/config-provider";
import ThemeApplier from "@common/theme/ThemeApplier";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import RouterProvider from "./RouterProvider";
import globalStyles from "@common/theme/globalStyles";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    globalStyles();

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
