// Import necessary styles and components
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

// Configure chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, polygonMumbai],
  [
    alchemyProvider({ apiKey: "dQpbOCpVuiWvn-P_uDROh1dpMKGWZZP_" }),
    publicProvider(),
  ]
);

// Configure connectors and default wallets
const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID", // Replace with your actual project ID
  chains,
});

// Function to configure Wagmi (useful for client-side only execution)
const getWagmiConfig = () => {
  return createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });
};

// Import necessary components and styles
import Sidebar from "../src/components/sidebar";
import "../styles/globals.css";

// Main App component
function MyApp({ Component, pageProps }: AppProps) {
  // Use getWagmiConfig on the client side to avoid hydration issues
  const wagmiConfig = getWagmiConfig();

  return (
    // Wrap the app with WagmiConfig and RainbowKitProvider
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} showRecentTransactions={true}>
        {/* Main layout structure */}
        <div className="w-full h-screen flex items-center">
          {/* Sidebar */}
          <div className="w-64 h-full border-r-[1px]">
            <Sidebar />
            {/* Mobile message (visible on small screens) */}
            <div className="flex bg-white items-center justify-center w-full h-screen text-sm md:hidden font-med font-Poppins z-[10000] fixed overflow-hidden top-0 ">
              <p>only available on desktop</p>
            </div>
          </div>
          {/* Main content area */}
          <div className="w-full h-full flex items-center justify-center">
            <Component {...pageProps} />
          </div>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

// Export the configured App component
export default MyApp;
