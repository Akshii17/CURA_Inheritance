import { useContext, createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAccount, useDisconnect } from "wagmi";
import { ethers } from "ethers";
import ContractAddress from "../lib/ContractAddress";
import abi from "../lib/abi.json";

export const ArtistContext = createContext(null);
export const useArtistContext = () => useContext(ArtistContext);

export const ArtistContextProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [contract, setContract] = useState(null);
  const [artist, setArtist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initContract = async () => {
      if (!isConnected || !address) {
        setContract(null);
        setArtist(null);
        return;
      }

      try {
        setIsLoading(true);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const c = new ethers.Contract(ContractAddress, abi, signer);
        setContract(c);

        // Fetch artist data
        const artistData = await c.login();
        setArtist(artistData);

      } catch (err) {
        console.log(err);
        console.log("No account exists");
        // disconnect();
        setArtist(null);
      } finally {
        setIsLoading(false);
      }
    };

    initContract();
  }, [address, isConnected, disconnect]);

  return (
    <ArtistContext.Provider
      value={{ isLoading, artist, isConnected, contract, address }}
    >
      {children}
    </ArtistContext.Provider>
  );
};
