import { gql } from "@apollo/client";


export const GET_ARTISTS = gql`
  query GetArtists {
    artistStates {
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


export const GET_ARTWORKS = gql`
  query GetArtworks {
    artworkStates {
      artworkID
      artworkTitle
      available
      description
      id
      ipfsHash
      likes
      nftMinted
      originalArtist
      royaltyP
    }
  }
`;

export const GET_DS = gql`
  query MyQuery($id: BigInt!) {
    dsstates(where: { directSaleID: $id }) {
      artworkID
      directSaleID
      price
      seller
      sold
      blockNumber
      blockTimestamp
      id
    }
  }
`;
