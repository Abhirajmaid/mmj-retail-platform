"use client";

import { ToastContextProvider } from "@/src/context/ToastContext";

export function Providers({ children }) {
    return (
        <ToastContextProvider >
            {children}
        </ToastContextProvider>
    )
}