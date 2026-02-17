import favicon from './assets/curaa.png';

// Dynamically inject the favicon from the assets folder
const link = document.querySelector("link[rel~='icon']");
if (link) {
  link.href = favicon;
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { WagmiProvider } from "wagmi";
import { http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client/react";
import apolloClient from "./lib/apolloClient";


import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import { ArtistContextProvider } from "./context/ArtistContext.jsx";
import { QueryContextProvider } from "./context/QueryContext.jsx";


const queryClient = new QueryClient();


const config = getDefaultConfig({
  appName: "cura",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [sepolia],
  // ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_ID),


  }
});
const chains = [sepolia];




createRoot(document.getElementById("root")).render(
  //<StrictMode>
    <WagmiProvider config={config}>
      <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={chains}
        >
          <ArtistContextProvider>
            <QueryContextProvider>
                <App />
            </QueryContextProvider>
          </ArtistContextProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
      </ApolloProvider>
    </WagmiProvider>
  //</StrictMode>,
);



