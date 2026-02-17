import { createContext, useContext, useEffect, useState } from "react";
import { request } from "graphql-request";
import {
  GET_ARTWORKS,
  GET_AUCTIONS,
  GET_DS,
  GET_ARTISTS,
  GET_LIKED_ARTWORKS,
  GET_FOLLOWING_LIST,
  GET_FOLLOWERS_LIST,
  GET_WITHDRAWALS
} from "../lib/GraphqlQueries";
import { useArtistContext } from "./ArtistContext";

const QueryContext = createContext(null);
export const useQueryContext = () => useContext(QueryContext);

const GRAPHQL_ENDPOINT =
  "https://api.studio.thegraph.com/query/1723072/cura-graph-5/version/latest";

export const QueryContextProvider = ({ children }) => {
  const { artist, contract } = useArtistContext();

  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [auction, setAuction] = useState([]);
  const [DS, setDS] = useState([]);
  const [likedArtworks, setLikedArtworks] = useState([]);
  const [owners, setOwners] = useState({});
  const [following, setFollowing] = useState([]);
  const [followersList, setFollowersList] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [error, setError] = useState(null);

  // 🔥 HELPERS

  const dedupeByKey = (array, key) => {
    const seen = new Set();
    return array.filter((item) => {
      if (seen.has(item[key])) return false;
      seen.add(item[key]);
      return true;
    });
  };

  // 🔥 FETCH FUNCTIONS

  const fetchArtworks = async () => {
    try {
      const data = await request(GRAPHQL_ENDPOINT, GET_ARTWORKS);
      const unique = dedupeByKey(data.artworkStates, "artworkID");
      setArtworks(unique);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchArtists = async () => {
    try {
      const data = await request(GRAPHQL_ENDPOINT, GET_ARTISTS);
      const unique = dedupeByKey(
        data.artistStates.map((a) => ({
          ...a,
          artistAddress: a.artistAddress?.toLowerCase(),
        })),
        "artistAddress"
      );
      setArtists(unique);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAuction = async () => {
    try {
      const data = await request(GRAPHQL_ENDPOINT, GET_AUCTIONS);
      const unique = dedupeByKey(data.auctionStates, "artID");
      setAuction(unique);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchDS = async () => {
  try {
    const data = await request(GRAPHQL_ENDPOINT, GET_DS);

    const unique = dedupeByKey(data.dsstates, "artworkID");

    setDS(unique);
  } catch (err) {
    setError(err.message);
  }
};


  const fetchLikedArtworks = async () => {
    try {
      if (!artist?.artistAddress) return;

      const data = await request(GRAPHQL_ENDPOINT, GET_LIKED_ARTWORKS, {
        user: artist.artistAddress.toLowerCase(),
      });

      setLikedArtworks(data.artworkLikeds);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchFollowingList = async () => {
    console.log("hey");

    try {
      const data = await request(GRAPHQL_ENDPOINT, GET_FOLLOWING_LIST, {
        user: artist.artistAddress.toLowerCase()
      });
      console.log(data.follows);
      console.log(1);
      setFollowing(data.follows);
    } catch (err) {
      console.log(err);

      setError(err.message);
    }
  };


  const fetchFollowersList = async () => {
    try {
        
        const data = await request(GRAPHQL_ENDPOINT, GET_FOLLOWERS_LIST,
            {
            user: artist?.artistAddress?.toLowerCase()
        });
        setFollowersList(data.follows);
    } catch (err) {
        setError(err.message);
    }
 };

 const fetchWithdrawals = async () => {
    console.log("hey");

    try {
      const data = await request(GRAPHQL_ENDPOINT, GET_WITHDRAWALS, {
        user: artist.artistAddress.toLowerCase()
      });

      setWithdrawals(data.withdraws);
    } catch (err) {
      console.log(err);

      setError(err.message);
    }
  };


  // 🔥 OWNERS FETCH (PARALLEL)

  const fetchOwners = async () => {
    if (!contract || artworks.length === 0) return;

    try {
      const ownershipMap = {};

      const promises = artworks.map(async (art) => {
        const owner = await contract.checkOwnership(art.artworkID);
        ownershipMap[art.artworkID] = owner.toLowerCase();
      });

      await Promise.all(promises);
      console.log(ownershipMap);

      setOwners(ownershipMap);
    } catch (err) {
      console.error("Owner fetch error:", err);
    }
  };

  // =========================
  // 🔥 EFFECTS
  // =========================

  // Load Graph data on mount
  useEffect(() => {
    fetchArtworks();
    fetchArtists();
    fetchAuction();
    fetchDS();
  }, []);

  // Load owners when artworks + contract ready
  useEffect(() => {
    if (!contract || artworks.length === 0) return;
    fetchOwners();
  }, [contract, artworks]);

  // Load liked when artist changes
  useEffect(() => {
    if(artist){

      fetchLikedArtworks();
      fetchFollowingList();
      fetchFollowersList();
      fetchWithdrawals();
    }

  }, [artist]);

  // =========================
  // 🔥 PROVIDER
  // =========================

  return (
    <QueryContext.Provider
      value={{
        artworks,
        artists,
        auction,
        DS,
        likedArtworks,
        owners,
        error,
        following,
        followersList,
        withdrawals,

        fetchArtworks,
        fetchArtists,
        fetchAuction,
        fetchDS,
        fetchLikedArtworks,
        fetchFollowingList,
        fetchFollowersList,
        fetchWithdrawals
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};
