import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { WagmiProvider } from "wagmi";
import { http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import { ArtistContextProvider } from "./context/ArtistContext.jsx";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "cura",
  // projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  projectId:"7355e9ea606b9bd11e2395eafc4aa1d6",
  chains: [sepolia],
  // ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/PHX4a063CZKRHksCdw8ao"),

  }
});
const chains = [sepolia];


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={chains}
        >
          <ArtistContextProvider>
          <App />
          </ArtistContextProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
