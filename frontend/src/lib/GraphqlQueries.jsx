import { gql } from "@apollo/client";

export const GET_ARTISTS = gql`
  query GetArtists {
    artistStates(first: 5) {
      artistAddress
      followerCount
      id
      name
      pfpHash
      username
      transactionHash
      blockNumber
      blockTimestamp
    }
  }
`;


