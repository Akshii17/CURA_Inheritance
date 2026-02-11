import { createContext, useContext, useEffect, useState } from "react";
import { request, gql } from "graphql-request";
import { GET_ARTWORKS } from "../lib/GraphqlQueries";




const QueryContext = createContext(null);
export const useQueryContext = () => useContext(QueryContext);


const GRAPHQL_ENDPOINT = "https://api.studio.thegraph.com/query/1723072/cura-graph-2/version/latest";


export const QueryContextProvider = ({ children }) => {


    // artworks
    const [dup_artworks, setArtworks] = useState([]);
    const [DS, setDS] = useState([]);
    const [auction, setAuction] = useState([]);
    const [direct, setDirect] = useState([]);
    const [error, setError] = useState(null);

    const seen = new Set();
    const artworks = [];

    


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


    return (
        <QueryContext.Provider
            value={{
                artworks,
                error,
                DS,


                fetchArtworks,
                setArtworks,
                fetchDS,
            }}
        >
            {children}
        </QueryContext.Provider>
    );




}









