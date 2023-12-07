import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, polygonMumbai],
  [
    alchemyProvider({ apiKey: "dQpbOCpVuiWvn-P_uDROh1dpMKGWZZP_" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

type LayoutProps = {
  children: React.ReactNode;
};
import Sidebar from "../src/components/sidebar";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} showRecentTransactions={true}>
        <div className="w-full h-screen flex items-center ">
          <div className="w-64 h-full border-r-[1px] ">
            <Sidebar />{" "}
            <div className="flex bg-white items-center justify-center w-full h-screen text-sm md:hidden font-med font-Poppins z-[10000] fixed overflow-hidden top-0 ">
              <p>only available on desktop</p>
            </div>
          </div>
          <div className=" w-full h-full flex items-center justify-center ">
            <Component {...pageProps} />
          </div>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
