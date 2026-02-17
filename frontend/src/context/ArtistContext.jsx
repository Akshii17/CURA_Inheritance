import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

import ContractAddress from "../lib/ContractAddress";
import abi from "../lib/abi.json";

export const ArtistContext = createContext(null);
export const useArtistContext = () => useContext(ArtistContext);

export const ArtistContextProvider = ({ children }) => {
  const { address, isConnected } = useAccount();

  const [contract, setContract] = useState(null);
  const [artist, setArtist] = useState(null);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!isConnected || !address) {
        setContract(null);
        setArtist(null);
        setNeedsRegistration(false);
        return;
      }

      try {
        setIsLoading(true);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const c = new ethers.Contract(ContractAddress, abi, signer);
        setContract(c);

        const artistData = await c.login(); // throws if not registered
        setArtist(artistData);
        setNeedsRegistration(false);

      } catch (err) {
        console.log("User not registered");
        setArtist(null);
        setNeedsRegistration(true);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [address, isConnected]);


  const fetchArtist = async () => {
  if (!contract) return;

  try {
    const artistData = await contract.login();
    setArtist(artistData);
    setNeedsRegistration(false);
  } catch {
    setArtist(null);
    setNeedsRegistration(true);
  }
};


  return (
    <ArtistContext.Provider
      value={{
        contract,
        artist,
        address,
        isConnected,
        needsRegistration,
        isLoading,
        fetchArtist
      }}
    >
      {children}
    </ArtistContext.Provider>
  );
};
