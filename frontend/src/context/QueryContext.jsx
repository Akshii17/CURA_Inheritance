import { createContext, useContext, useEffect, useState } from "react";
import { request, gql } from "graphql-request";
import { GET_ARTWORKS, GET_AUCTIONS, GET_DS, GET_ARTISTS, GET_LIKED_ARTWORKS } from "../lib/GraphqlQueries";
import { useArtistContext } from "./ArtistContext";




const QueryContext = createContext(null);
export const useQueryContext = () => useContext(QueryContext);


const GRAPHQL_ENDPOINT = "https://api.studio.thegraph.com/query/1723072/cura-graph-2/version/latest";


export const QueryContextProvider = ({ children }) => {

  const { artist } = useArtistContext();



    // artworks
    const [dup_artworks, setArtworks] = useState([]);
    const [dup_artists, setArtists] = useState([]);
    const [DS, setDS] = useState([]);
    const [dup_auction, setAuction] = useState([]);
    const [likedArtworks, setLikedArtworks] = useState([]);
    const [error, setError] = useState(null);

    const seenArtist = new Set();
    const artists = [];

    const seen = new Set();
    const artworks = [];

    const seenAuc = new Set();
    const auction = [];

    //fetch artists
    const fetchArtists = async () => {
        try {
            const data = await request(GRAPHQL_ENDPOINT, GET_ARTISTS);
            setArtists(data.artistStates);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    for (const artist of dup_artists) {
        if (!seenArtist.has(artist?.artistAddress?.toLowerCase())) {
            seenArtist.add(artist.artistAddress.toLowerCase());
            artists.push(artist);
        }
    }

    //fetch artworks
    const fetchArtworks = async () => {
        try {
            const data = await request(GRAPHQL_ENDPOINT, GET_ARTWORKS);
            setArtworks(data.artworkStates);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchArtworks();
    }, []);

    for (const art of dup_artworks) {
        if (!seen.has(art.artworkID)) {
            seen.add(art.artworkID);
            artworks.push(art);
        }
    }

    // fetch DS
    const fetchDS = async () => {
        try {
            const data = await request(GRAPHQL_ENDPOINT, GET_DS);
            setDS(data.dsstates);
        } catch (err) {
            setError(err.message);
        }
    };


    useEffect(() => {
        fetchDS();
    }, []);


    //fetch Auction
     const fetchAuction = async () => {
        try {
            const data = await request(GRAPHQL_ENDPOINT, GET_AUCTIONS);
            setAuction(data.auctionStates);
        } catch (err) {
            setError(err.message);
        }
    };


    useEffect(() => {
        fetchAuction();
    }, []);

    for (const auc of dup_auction) {
        if (!seenAuc.has(auc.artID)) {
            seenAuc.add(auc.artID);
            auction.push(auc);
        }
    }


    //fetch Liked Art
    const fetchLikedArtworks = async () => {
        try {
            
            const data = await request(GRAPHQL_ENDPOINT, GET_LIKED_ARTWORKS,
                {
                user: artist.artistAddress.toLowerCase()
            });
            setLikedArtworks(data.artworkLikeds);
        } catch (err) {
            setError(err.message);
        }
    };


    useEffect(() => {
        fetchLikedArtworks();
    }, [artist]);


    return (
        <QueryContext.Provider
            value={{
                artworks,
                error,
                DS,
                auction,
                artists,
                likedArtworks,


                fetchArtworks,
                setArtworks,
                fetchDS,
                fetchAuction,
                fetchArtists,
                fetchLikedArtworks,
            }}
        >
            {children}
        </QueryContext.Provider>
    );




}









